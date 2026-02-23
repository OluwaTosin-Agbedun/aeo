import { Hono } from "npm:hono@4.6.14";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const app = new Hono();
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

// Supabase client for storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to retry operations with exponential backoff
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 100
): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`Retry attempt ${i + 1}/${maxRetries} failed:`, error?.message);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

// Safe wrapper for kv.get that returns null on connection errors
async function safeKvGet(key: string, defaultValue: any = null): Promise<any> {
  try {
    return await retryOperation(() => kv.get(key));
  } catch (error) {
    console.error(`KV get error for key "${key}":`, error?.message);
    return defaultValue;
  }
}

// Safe wrapper for kv.getByPrefix that returns empty array on connection errors
async function safeKvGetByPrefix(prefix: string): Promise<any[]> {
  try {
    return await retryOperation(() => kv.getByPrefix(prefix));
  } catch (error) {
    console.error(`KV getByPrefix error for prefix "${prefix}":`, error?.message);
    return [];
  }
}

// Safe wrapper for kv.set that logs errors but doesn't throw
async function safeKvSet(key: string, value: any): Promise<boolean> {
  try {
    await retryOperation(() => kv.set(key, value));
    return true;
  } catch (error) {
    console.error(`KV set error for key "${key}":`, error?.message);
    return false;
  }
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c35202b6/health", (c) => {
  return c.json({ status: "ok" });
});

// Newsletter subscription endpoint
app.post("/make-server-c35202b6/newsletter/subscribe", async (c) => {
  try {
    const { email } = await c.req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400);
    }

    // Check if email already exists
    const existingSubscriber = await safeKvGet(`newsletter:${email.toLowerCase()}`);
    if (existingSubscriber) {
      return c.json({ 
        success: true, 
        message: 'This email is already subscribed',
        alreadySubscribed: true 
      });
    }

    // Store subscription
    const subscriptionData = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      active: true
    };

    console.log('Saving subscription with key:', `newsletter:${email.toLowerCase()}`);
    console.log('Subscription data:', subscriptionData);
    await kv.set(`newsletter:${email.toLowerCase()}`, subscriptionData);

    // Verify it was saved
    const verifySubscription = await kv.get(`newsletter:${email.toLowerCase()}`);
    console.log('Verification - subscription saved:', verifySubscription);

    console.log(`Newsletter subscription successful: ${email}`);
    return c.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      alreadySubscribed: false 
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return c.json({ error: 'Failed to subscribe to newsletter' }, 500);
  }
});

// Get all newsletter subscribers (for admin use or sending emails)
app.get("/make-server-c35202b6/newsletter/subscribers", async (c) => {
  try {
    // getByPrefix returns an array of values directly (not objects with .value property)
    const subscribers = await kv.getByPrefix('newsletter:');
    console.log('Raw subscribers from DB:', subscribers);
    
    // Filter for active subscribers
    const activeSubscribers = subscribers.filter(sub => sub?.active === true);
    
    console.log('Active subscribers count:', activeSubscribers.length);
    console.log('Active subscribers:', activeSubscribers);
    
    return c.json({ 
      success: true, 
      count: activeSubscribers.length,
      subscribers: activeSubscribers 
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

// Unsubscribe endpoint
app.post("/make-server-c35202b6/newsletter/unsubscribe", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const subscriber = await kv.get(`newsletter:${email.toLowerCase()}`);
    if (!subscriber) {
      return c.json({ error: 'Email not found in subscriber list' }, 404);
    }

    // Mark as inactive instead of deleting
    await kv.set(`newsletter:${email.toLowerCase()}`, {
      ...subscriber,
      active: false,
      unsubscribedAt: new Date().toISOString()
    });

    console.log(`Newsletter unsubscribe successful: ${email}`);
    return c.json({ 
      success: true, 
      message: 'Successfully unsubscribed from newsletter' 
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return c.json({ error: 'Failed to unsubscribe' }, 500);
  }
});

// Send newsletter to all subscribers (for new blog posts)
app.post("/make-server-c35202b6/newsletter/send", async (c) => {
  try {
    const { subject, blogTitle, blogExcerpt, blogUrl, blogDate } = await c.req.json();

    if (!subject || !blogTitle || !blogUrl) {
      return c.json({ error: 'Missing required fields: subject, blogTitle, blogUrl' }, 400);
    }

    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return c.json({ error: 'Email service not configured' }, 500);
    }

    // Get all active subscribers
    const subscribers = await kv.getByPrefix('newsletter:');
    const activeSubscribers = subscribers
      .filter(sub => sub?.active === true)
      .map(sub => sub.email);

    if (activeSubscribers.length === 0) {
      return c.json({ 
        success: true, 
        message: 'No active subscribers to send to',
        sent: 0 
      });
    }

    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { background: #ffffff; padding: 30px 20px; }
            .blog-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .blog-title { font-size: 24px; font-weight: bold; color: #1e3a5f; margin-bottom: 10px; }
            .blog-date { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
            .blog-excerpt { color: #4b5563; margin-bottom: 20px; }
            .btn { display: inline-block; background: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            .unsubscribe { color: #6b7280; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">ATHENA ELECTION OBSERVATORY</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New Election Analysis Published</p>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              <p>We've just published a new election analysis that you might find interesting:</p>
              
              <div class="blog-card">
                <div class="blog-title">${blogTitle}</div>
                ${blogDate ? `<div class="blog-date">${blogDate}</div>` : ''}
                ${blogExcerpt ? `<div class="blog-excerpt">${blogExcerpt}</div>` : ''}
                <a href="${blogUrl}" class="btn">Read Full Analysis</a>
              </div>
              
              <p>Stay informed on election integrity across Nigeria and Africa with our latest insights and research.</p>
            </div>
            
            <div class="footer">
              <p><strong>Athena Election Observatory</strong></p>
              <p>Promoting transparency and integrity in Nigerian elections</p>
              <p style="margin-top: 15px;">
                You're receiving this email because you subscribed to AEO Updates.<br>
                <a href="#" class="unsubscribe">Unsubscribe from future emails</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
ATHENA ELECTION OBSERVATORY - New Election Analysis

${blogTitle}
${blogDate ? `Published: ${blogDate}` : ''}

${blogExcerpt || ''}

Read the full analysis: ${blogUrl}

---
Athena Election Observatory
Promoting transparency and integrity in Nigerian elections

You're receiving this email because you subscribed to AEO Updates.
    `;

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: activeSubscribers.map(email => ({
          to: [{ email }],
          subject: subject
        })),
        from: {
          email: 'updates@athenaelectionobservatory.org',
          name: 'Athena Election Observatory'
        },
        content: [
          {
            type: 'text/plain',
            value: emailText
          },
          {
            type: 'text/html',
            value: emailHtml
          }
        ]
      })
    });

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid API error response:', errorText);
      console.error('SendGrid response status:', sendGridResponse.status);
      
      let detailedError = 'Failed to send emails via SendGrid';
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors && errorJson.errors.length > 0) {
          detailedError = `SendGrid error: ${errorJson.errors[0].message}`;
          console.error('SendGrid error details:', errorJson.errors);
        }
      } catch (e) {
        // If parsing fails, use the raw error text
        detailedError = `SendGrid error (${sendGridResponse.status}): ${errorText.substring(0, 200)}`;
      }
      
      return c.json({ 
        error: detailedError,
        hint: 'Please ensure your SendGrid sender email (updates@athenaelectionobservatory.org) is verified in your SendGrid account. Visit: https://app.sendgrid.com/settings/sender_auth/senders'
      }, 500);
    }

    console.log(`Newsletter sent successfully to ${activeSubscribers.length} subscribers`);
    return c.json({ 
      success: true, 
      message: `Newsletter sent to ${activeSubscribers.length} subscribers`,
      sent: activeSubscribers.length
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return c.json({ error: 'Failed to send newsletter' }, 500);
  }
});

// ===== ELECTION DATA MANAGEMENT ENDPOINTS =====

// Get all states with their monitoring status
app.get("/make-server-c35202b6/election/states", async (c) => {
  try {
    const states = await safeKvGet('election:states', []);
    console.log('States retrieved:', states?.length || 0, 'states');
    return c.json({ 
      success: true, 
      states: states || [] 
    });
  } catch (error) {
    console.error('Error fetching election states:', error?.message);
    // Return empty states array instead of error - frontend has fallback
    return c.json({ 
      success: true, 
      states: []
    });
  }
});

// Update states list
app.post("/make-server-c35202b6/election/states", async (c) => {
  try {
    const { states } = await c.req.json();
    
    if (!Array.isArray(states)) {
      return c.json({ error: 'States must be an array' }, 400);
    }
    
    await kv.set('election:states', states);
    console.log('States updated successfully');
    
    return c.json({ 
      success: true, 
      message: 'States updated successfully' 
    });
  } catch (error) {
    console.error('Error updating states:', error);
    return c.json({ error: 'Failed to update states' }, 500);
  }
});

// Get election data for a specific state
app.get("/make-server-c35202b6/election/state/:stateName", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    
    const [candidates, stats, polling] = await Promise.all([
      kv.get(`election:candidates:${stateKey}`),
      kv.get(`election:stats:${stateKey}`),
      kv.get(`election:polling:${stateKey}`)
    ]);
    
    return c.json({ 
      success: true,
      state: stateName,
      data: {
        candidates: candidates || [],
        stats: stats || {},
        polling: polling || {}
      }
    });
  } catch (error) {
    console.error('Error fetching state election data:', error);
    return c.json({ error: 'Failed to fetch state data' }, 500);
  }
});

// Update election data for a specific state
app.post("/make-server-c35202b6/election/state/:stateName", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    const { candidates, stats, polling } = await c.req.json();
    
    // Update each data type if provided
    if (candidates !== undefined) {
      await kv.set(`election:candidates:${stateKey}`, candidates);
    }
    
    if (stats !== undefined) {
      await kv.set(`election:stats:${stateKey}`, stats);
    }
    
    if (polling !== undefined) {
      await kv.set(`election:polling:${stateKey}`, polling);
    }
    
    console.log(`Election data updated for state: ${stateName}`);
    
    return c.json({ 
      success: true, 
      message: `Election data updated for ${stateName}` 
    });
  } catch (error) {
    console.error('Error updating state election data:', error);
    return c.json({ error: 'Failed to update state data' }, 500);
  }
});

// Initialize default election data (one-time setup)
app.post("/make-server-c35202b6/election/initialize", async (c) => {
  try {
    // Default states data
    const defaultStates = [
      { name: 'Anambra', status: 'Active Monitoring', records: 2847 },
      { name: 'Ondo', status: 'Completed', records: 3245 },
      { name: 'Lagos', status: 'No Records', records: 0 },
      { name: 'Kano', status: 'No Records', records: 0 },
      { name: 'Rivers', status: 'No Records', records: 0 },
      { name: 'Kaduna', status: 'No Records', records: 0 }
    ];
    
    // Default Ondo state data (completed election)
    const ondoCandidates = [
      { 
        name: 'Lucky Aiyedatiwa', 
        party: 'APC', 
        votes: 392882, 
        percentage: 72.74,
        color: '#22c55e'
      },
      { 
        name: 'Agboola Ajayi', 
        party: 'PDP', 
        votes: 147753, 
        percentage: 27.36,
        color: '#ef4444'
      }
    ];
    
    const ondoStats = {
      registeredVoters: 2053061,
      accreditedVoters: 560392,
      totalVotes: 540035,
      rejectedVotes: 12093,
      validVotes: 527942
    };
    
    const ondoPolling = {
      totalPollingUnits: 3933,
      uploadedResults: 3932,
      uploadPercentage: 99.97,
      totalLGAs: 18,
      reportingLGAs: 18
    };

    // Default Anambra state data (upcoming election - Nov 8, 2025)
    const anambraCandidates = [
      { 
        name: 'Charles Soludo', 
        party: 'APGA', 
        votes: 0, 
        percentage: 0,
        color: '#FBBF24'
      },
      { 
        name: 'Andy Uba', 
        party: 'APC', 
        votes: 0, 
        percentage: 0,
        color: '#3b82f6'
      },
      { 
        name: 'Ifeanyi Ubah', 
        party: 'YPP', 
        votes: 0, 
        percentage: 0,
        color: '#22c55e'
      }
    ];
    
    const anambraStats = {
      registeredVoters: 2800000,
      accreditedVoters: 0,
      totalVotes: 0,
      rejectedVotes: 0,
      validVotes: 0
    };
    
    const anambraPolling = {
      totalPollingUnits: 5720,
      uploadedResults: 0,
      uploadPercentage: 0,
      totalLGAs: 21,
      reportingLGAs: 0
    };

    // Default Anambra Key Highlights
    const anambraHighlights = [
      {
        title: 'Election Date',
        mainStatistic: 'Nov 8, 2025',
        description: 'Anambra State Governorship Election',
        colorTheme: 'blue'
      },
      {
        title: 'Registered Voters',
        mainStatistic: '2.8M',
        description: 'eligible voters across 21 LGAs',
        colorTheme: 'green'
      },
      {
        title: 'Polling Units',
        mainStatistic: '5,720',
        description: 'polling units to be monitored',
        colorTheme: 'purple'
      }
    ];
    
    // Save default data with safe operations
    console.log('Starting initialization...');
    const results = await Promise.all([
      safeKvSet('election:states', defaultStates),
      safeKvSet('election:candidates:ondo', ondoCandidates),
      safeKvSet('election:stats:ondo', ondoStats),
      safeKvSet('election:polling:ondo', ondoPolling),
      safeKvSet('election:candidates:anambra', anambraCandidates),
      safeKvSet('election:stats:anambra', anambraStats),
      safeKvSet('election:polling:anambra', anambraPolling),
      safeKvSet('election:highlights:anambra', anambraHighlights)
    ]);
    
    const successCount = results.filter(r => r).length;
    console.log(`Initialized ${successCount}/${results.length} election data items`);
    
    // Default blog post
    const defaultBlogPost = {
      id: 'default-anambra-election-2025',
      title: 'Anambra State Governorship Election 2025: What to Expect',
      summary: 'As Anambra State prepares for its governorship election on November 8, 2025, the Athena Election Observatory provides key insights into what citizens and observers should expect.',
      content: `The upcoming Anambra State governorship election represents a crucial moment for Nigeria's democratic process. With 2.8 million registered voters across 21 Local Government Areas and 5,720 polling units, the election will be closely monitored for transparency and integrity.

Key contenders include incumbent Governor Charles Soludo (APGA), Andy Uba (APC), and Ifeanyi Ubah (YPP). The Athena Election Observatory will provide real-time monitoring and comprehensive analysis throughout the electoral process.

Our monitoring framework includes:
- Real-time result tracking from all 5,720 polling units
- LGA-level breakdown and analysis
- Voter turnout metrics and participation rates
- Election integrity assessments
- Incident reporting and verification

Stay tuned to this dashboard for live updates as results come in on election day.`,
      imageUrl: 'https://images.unsplash.com/photo-1586619057346-bf1b5d620817?w=800',
      publishDate: 'November 1, 2025',
      slug: 'anambra-2025-election-preview',
      category: 'Election Analysis',
      author: 'Athena Election Observatory Team',
      createdAt: new Date().toISOString()
    };
    
    const blogPostSaved = await safeKvSet(`blog_post:${defaultBlogPost.id}`, defaultBlogPost);
    console.log(`Blog post initialization: ${blogPostSaved ? 'success' : 'failed'}`);
    
    console.log('Election data initialization completed');
    
    return c.json({ 
      success: true, 
      message: 'Election data initialized successfully with Ondo and Anambra states and default blog post' 
    });
  } catch (error) {
    console.error('Error initializing election data:', error);
    return c.json({ error: 'Failed to initialize election data' }, 500);
  }
});

// Force re-initialize (useful for resetting data)
app.post("/make-server-c35202b6/election/force-reinitialize", async (c) => {
  try {
    // This endpoint allows forcing a re-initialization even if data exists
    // Useful for resetting to defaults or updating sample data
    
    // Default states data
    const defaultStates = [
      { name: 'Anambra', status: 'Active Monitoring', records: 2847 },
      { name: 'Ondo', status: 'Completed', records: 3245 },
      { name: 'Lagos', status: 'No Records', records: 0 },
      { name: 'Kano', status: 'No Records', records: 0 },
      { name: 'Rivers', status: 'No Records', records: 0 },
      { name: 'Kaduna', status: 'No Records', records: 0 }
    ];
    
    // Anambra state data
    const anambraCandidates = [
      { 
        name: 'Charles Soludo', 
        party: 'APGA', 
        votes: 0, 
        percentage: 0,
        color: '#FBBF24'
      },
      { 
        name: 'Andy Uba', 
        party: 'APC', 
        votes: 0, 
        percentage: 0,
        color: '#3b82f6'
      },
      { 
        name: 'Ifeanyi Ubah', 
        party: 'YPP', 
        votes: 0, 
        percentage: 0,
        color: '#22c55e'
      }
    ];
    
    const anambraStats = {
      registeredVoters: 2800000,
      accreditedVoters: 0,
      totalVotes: 0,
      rejectedVotes: 0,
      validVotes: 0
    };
    
    const anambraPolling = {
      totalPollingUnits: 5720,
      uploadedResults: 0,
      uploadPercentage: 0,
      totalLGAs: 21,
      reportingLGAs: 0
    };

    const anambraHighlights = [
      {
        title: 'Election Date',
        mainStatistic: 'Nov 8, 2025',
        description: 'Anambra State Governorship Election',
        colorTheme: 'blue'
      },
      {
        title: 'Registered Voters',
        mainStatistic: '2.8M',
        description: 'eligible voters across 21 LGAs',
        colorTheme: 'green'
      },
      {
        title: 'Polling Units',
        mainStatistic: '5,720',
        description: 'polling units to be monitored',
        colorTheme: 'purple'
      }
    ];
    
    // Update states list
    await kv.set('election:states', defaultStates);
    
    // Update Anambra data
    await kv.set('election:candidates:anambra', anambraCandidates);
    await kv.set('election:stats:anambra', anambraStats);
    await kv.set('election:polling:anambra', anambraPolling);
    await kv.set('election:highlights:anambra', anambraHighlights);
    
    console.log('✅ Anambra data re-initialized successfully');
    
    return c.json({ 
      success: true, 
      message: 'Anambra election data re-initialized successfully' 
    });
  } catch (error) {
    console.error('Error re-initializing Anambra data:', error);
    return c.json({ error: 'Failed to re-initialize data' }, 500);
  }
});

// Get Key Highlights data for a specific state
app.get("/make-server-c35202b6/election/state/:stateName/highlights", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    
    const highlights = await kv.get(`election:highlights:${stateKey}`);
    
    return c.json({ 
      success: true,
      state: stateName,
      highlights: highlights || []
    });
  } catch (error) {
    console.error('Error fetching highlights data:', error);
    return c.json({ error: 'Failed to fetch highlights data' }, 500);
  }
});

// Update Key Highlights data for a specific state
app.post("/make-server-c35202b6/election/state/:stateName/highlights", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    const { highlights } = await c.req.json();
    
    if (!Array.isArray(highlights)) {
      return c.json({ error: 'Highlights must be an array' }, 400);
    }
    
    await kv.set(`election:highlights:${stateKey}`, highlights);
    console.log(`Highlights data updated for state: ${stateName}, count: ${highlights.length}`);
    
    return c.json({ 
      success: true, 
      message: `Highlights updated for ${stateName}` 
    });
  } catch (error) {
    console.error('Error updating highlights data:', error);
    return c.json({ error: 'Failed to update highlights data' }, 500);
  }
});

// Get LGA breakdown data for a specific state
app.get("/make-server-c35202b6/election/state/:stateName/lgas", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    
    const lgaData = await kv.get(`election:lgas:${stateKey}`);
    
    return c.json({ 
      success: true,
      state: stateName,
      lgas: lgaData || []
    });
  } catch (error) {
    console.error('Error fetching LGA data:', error);
    return c.json({ error: 'Failed to fetch LGA data' }, 500);
  }
});

// Update LGA breakdown data for a specific state
app.post("/make-server-c35202b6/election/state/:stateName/lgas", async (c) => {
  try {
    const stateName = c.req.param('stateName');
    const stateKey = stateName.toLowerCase().replace(/\s+/g, '_');
    const { lgas } = await c.req.json();
    
    if (!Array.isArray(lgas)) {
      return c.json({ error: 'LGAs must be an array' }, 400);
    }
    
    await kv.set(`election:lgas:${stateKey}`, lgas);
    console.log(`LGA data updated for state: ${stateName}, count: ${lgas.length}`);
    
    return c.json({ 
      success: true, 
      message: `LGA data updated for ${stateName}` 
    });
  } catch (error) {
    console.error('Error updating LGA data:', error);
    return c.json({ error: 'Failed to update LGA data' }, 500);
  }
});

// ===== VISITOR TRACKING ENDPOINTS =====

// Track a new visitor/page view
app.post("/make-server-c35202b6/analytics/track", async (c) => {
  try {
    const { visitorId, page, deviceType, browser, screenSize, referrer, timestamp } = await c.req.json();
    
    if (!visitorId || !page) {
      return c.json({ error: 'visitorId and page are required' }, 400);
    }
    
    // Store the visit
    const visitKey = `visit:${timestamp || Date.now()}:${visitorId}`;
    const visitData = {
      visitorId,
      page,
      deviceType: deviceType || 'unknown',
      browser: browser || 'unknown',
      screenSize: screenSize || 'unknown',
      referrer: referrer || 'direct',
      timestamp: timestamp || new Date().toISOString()
    };
    
    await kv.set(visitKey, visitData);
    
    // Update visitor record
    const visitorKey = `visitor:${visitorId}`;
    const existingVisitor = await kv.get(visitorKey);
    
    if (existingVisitor) {
      await kv.set(visitorKey, {
        ...existingVisitor,
        lastVisit: visitData.timestamp,
        visitCount: (existingVisitor.visitCount || 1) + 1,
        pages: [...new Set([...(existingVisitor.pages || []), page])]
      });
    } else {
      await kv.set(visitorKey, {
        visitorId,
        firstVisit: visitData.timestamp,
        lastVisit: visitData.timestamp,
        visitCount: 1,
        pages: [page],
        deviceType: visitData.deviceType,
        browser: visitData.browser
      });
    }
    
    console.log(`Tracked visit from ${visitorId} to ${page}`);
    return c.json({ success: true, message: 'Visit tracked successfully' });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return c.json({ error: 'Failed to track visit' }, 500);
  }
});

// Get visitor analytics
app.get("/make-server-c35202b6/analytics/stats", async (c) => {
  try {
    // Get all visits and visitors
    const visits = await kv.getByPrefix('visit:');
    const visitors = await kv.getByPrefix('visitor:');
    
    // Device breakdown - count unique visitors per device type
    const deviceBreakdown = visitors.reduce((acc: any, v: any) => {
      const device = v.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    
    // Browser breakdown - count unique visitors per browser
    const browserBreakdown = visitors.reduce((acc: any, v: any) => {
      const browser = v.browser || 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});
    
    // Page views breakdown (for reference)
    const pageViews = visits.reduce((acc: any, v: any) => {
      const page = v.page || 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});
    
    // Top pages
    const topPages = Object.entries(pageViews)
      .map(([page, count]) => ({ page, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);
    
    // Referrer breakdown (from first visit)
    const referrerBreakdown = visits.reduce((acc: any, v: any) => {
      const ref = v.referrer || 'direct';
      acc[ref] = (acc[ref] || 0) + 1;
      return acc;
    }, {});
    
    // Recent visits (last 100)
    const recentVisits = visits
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100);
    
    return c.json({
      success: true,
      analytics: {
        totalVisits: visits.length,
        uniqueVisitors: visitors.length,
        todayVisits: visits.length, // All visits are recent due to 24h retention
        weekVisits: visits.length,
        monthVisits: visits.length,
        deviceBreakdown,
        browserBreakdown,
        pageViews,
        topPages,
        referrerBreakdown,
        recentVisits
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Clear old visitor data (24-hour retention policy)
app.post("/make-server-c35202b6/analytics/cleanup", async (c) => {
  try {
    const { hoursToKeep } = await c.req.json();
    const keepHours = hoursToKeep || 24;
    const cutoffDate = new Date(Date.now() - keepHours * 60 * 60 * 1000);
    
    const visits = await kv.getByPrefix('visit:');
    let deletedCount = 0;
    
    for (const visit of visits) {
      if (new Date(visit.timestamp) < cutoffDate) {
        const visitKey = `visit:${visit.timestamp}:${visit.visitorId}`;
        await kv.del(visitKey);
        deletedCount++;
      }
    }
    
    console.log(`Cleaned up ${deletedCount} old visit records (older than ${keepHours} hours)`);
    return c.json({ 
      success: true, 
      message: `Deleted ${deletedCount} records older than ${keepHours} hours` 
    });
  } catch (error) {
    console.error('Error cleaning up analytics:', error);
    return c.json({ error: 'Failed to cleanup analytics' }, 500);
  }
});

// ===== BLOG POST MANAGEMENT ENDPOINTS =====

// Get all blog posts
app.get("/make-server-c35202b6/blog-posts", async (c) => {
  try {
    console.log('Fetching blog posts...');
    const blogPosts = await safeKvGetByPrefix('blog_post:');
    console.log('Blog posts retrieved:', blogPosts?.length || 0);
    
    // Sort by creation date (newest first) - handle empty array
    const sortedPosts = (blogPosts || []).sort((a: any, b: any) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log(`Retrieved ${sortedPosts.length} blog posts`);
    return c.json({ 
      success: true, 
      posts: sortedPosts 
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error?.message);
    // Return empty posts array instead of error - frontend has fallback
    return c.json({ 
      success: true, 
      posts: []
    });
  }
});

// Create or update a blog post
app.post("/make-server-c35202b6/blog-posts", async (c) => {
  try {
    const blogPost = await c.req.json();
    
    if (!blogPost.id || !blogPost.title || !blogPost.content) {
      return c.json({ error: 'Missing required fields: id, title, content' }, 400);
    }
    
    // Save blog post
    await kv.set(`blog_post:${blogPost.id}`, blogPost);
    
    console.log(`Blog post saved: ${blogPost.id} - ${blogPost.title}`);
    return c.json({ 
      success: true, 
      message: 'Blog post saved successfully',
      post: blogPost 
    });
  } catch (error) {
    console.error('Error saving blog post:', error);
    return c.json({ error: 'Failed to save blog post' }, 500);
  }
});

// Delete a blog post
app.delete("/make-server-c35202b6/blog-posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if blog post exists
    const existingPost = await kv.get(`blog_post:${id}`);
    if (!existingPost) {
      return c.json({ error: 'Blog post not found' }, 404);
    }
    
    // Delete the blog post
    await kv.del(`blog_post:${id}`);
    
    console.log(`Blog post deleted: ${id}`);
    return c.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return c.json({ error: 'Failed to delete blog post' }, 500);
  }
});

// Get a blog post by slug
app.get("/make-server-c35202b6/blog-posts/by-slug/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    
    // Get all blog posts and find the one with matching slug
    const blogPosts = await kv.getByPrefix('blog_post:');
    const post = blogPosts.find((p: any) => p.slug === slug);
    
    if (!post) {
      console.log(`Blog post not found for slug: ${slug}`);
      return c.json({ error: 'Blog post not found' }, 404);
    }
    
    console.log(`Retrieved blog post by slug: ${slug} - ${post.title}`);
    return c.json({ 
      success: true, 
      post: post 
    });
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return c.json({ error: 'Failed to fetch blog post' }, 500);
  }
});

// Upload blog post image
app.post("/make-server-c35202b6/blog-images/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size exceeds 5MB limit' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `blog_${timestamp}_${randomString}.${fileExt}`;

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Ensure bucket exists (lazy initialization)
    const bucketName = 'make-c35202b6-blog-images';
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880 // 5MB limit
        });
        console.log(`Created blog images bucket: ${bucketName}`);
      }
    } catch (bucketError) {
      console.error('Error checking/creating bucket:', bucketError);
      // Continue anyway - bucket might already exist
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return c.json({ error: `Failed to upload image: ${error.message}` }, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`Blog image uploaded successfully: ${fileName}`);
    return c.json({
      success: true,
      url: publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Delete blog post image
app.delete("/make-server-c35202b6/blog-images/:fileName", async (c) => {
  try {
    const fileName = c.req.param('fileName');
    
    if (!fileName) {
      return c.json({ error: 'File name is required' }, 400);
    }

    const bucketName = 'make-c35202b6-blog-images';
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error('Supabase storage delete error:', error);
      return c.json({ error: `Failed to delete image: ${error.message}` }, 500);
    }

    console.log(`Blog image deleted successfully: ${fileName}`);
    return c.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog image:', error);
    return c.json({ error: 'Failed to delete image' }, 500);
  }
});

// ===== PDF RESOURCE MANAGEMENT ENDPOINTS =====

// Get all PDF resources
app.get("/make-server-c35202b6/pdf-resources", async (c) => {
  try {
    const pdfResources = await kv.getByPrefix('pdf_resource:');
    
    // Sort by publish date (newest first) or creation date
    const sortedResources = pdfResources.sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    console.log(`Retrieved ${sortedResources.length} PDF resources`);
    return c.json({ 
      success: true, 
      resources: sortedResources 
    });
  } catch (error) {
    console.error('Error fetching PDF resources:', error);
    return c.json({ error: 'Failed to fetch PDF resources' }, 500);
  }
});

// Create or update a PDF resource
app.post("/make-server-c35202b6/pdf-resources", async (c) => {
  try {
    const pdfResource = await c.req.json();
    
    if (!pdfResource.id || !pdfResource.title || !pdfResource.hostedUrl) {
      return c.json({ error: 'Missing required fields: id, title, hostedUrl' }, 400);
    }
    
    // Save PDF resource
    await kv.set(`pdf_resource:${pdfResource.id}`, pdfResource);
    
    console.log(`PDF resource saved: ${pdfResource.id} - ${pdfResource.title}`);
    return c.json({ 
      success: true, 
      message: 'PDF resource saved successfully',
      resource: pdfResource 
    });
  } catch (error) {
    console.error('Error saving PDF resource:', error);
    return c.json({ error: 'Failed to save PDF resource' }, 500);
  }
});

// Delete a PDF resource
app.delete("/make-server-c35202b6/pdf-resources/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if PDF resource exists
    const existingResource = await kv.get(`pdf_resource:${id}`);
    if (!existingResource) {
      return c.json({ error: 'PDF resource not found' }, 404);
    }
    
    // Delete the PDF resource
    await kv.del(`pdf_resource:${id}`);
    
    console.log(`PDF resource deleted: ${id}`);
    return c.json({ 
      success: true, 
      message: 'PDF resource deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting PDF resource:', error);
    return c.json({ error: 'Failed to delete PDF resource' }, 500);
  }
});

// Initialize default PDF resources (one-time setup)
app.post("/make-server-c35202b6/pdf-resources/initialize", async (c) => {
  try {
    const defaultResources = [
      {
        id: 'pdf_1',
        title: 'Do Votes Count? Kogi 2023 Election',
        summary: 'Examines INEC\'s handling of the 2023 Kogi governorship election, highlighting irregularities in accreditation and result transmission that undermined voter confidence.',
        fileName: 'Do votes count Kogi 2023 election.pdf',
        fileSize: '2.8 MB',
        category: 'Election Analysis',
        publishDate: 'December 2023',
        hostedUrl: 'https://www.dropbox.com/scl/fi/wun47gh2nwyekhedv0u3p/Do-votes-count-Kogi-2023-election.pdf?rlkey=t654wmf0lne1x58qt40tqpf0e&st=ddtmbp8b&dl=1',
        previewContent: 'This comprehensive report examines the 2023 Kogi State Governorship Election, focusing on INEC\'s handling of electoral processes. The analysis reveals significant irregularities in voter accreditation procedures and result transmission mechanisms that fundamentally undermined public confidence in the electoral outcome. Key findings include discrepancies between BVAS accreditation data and declared results, delayed result uploads to the IReV portal, and inconsistencies in polling unit result sheets. The report provides evidence-based recommendations for strengthening electoral integrity in future elections, including enhanced real-time monitoring systems and improved transparency measures.',
        createdAt: new Date('2023-12-01').toISOString()
      },
      {
        id: 'pdf_2',
        title: 'Do Votes Count? Imo 2023 Election',
        summary: 'Finds widespread non-compliance in the Imo 2023 election. Nearly a quarter of declared results conflicted with accreditation data, raising questions of legitimacy.',
        fileName: 'Do votes count Imo 2023 election.pdf',
        fileSize: '3.2 MB',
        category: 'Election Analysis',
        publishDate: 'January 2024',
        hostedUrl: 'https://www.dropbox.com/scl/fi/6ypgneu111afdk558t13s/Do-votes-count-Imo-2023-election.pdf?rlkey=uqdivl0l6nfod0lulfnwin78j&st=2e40vbcp&dl=1',
        previewContent: 'This detailed investigation into the 2023 Imo State Governorship Election reveals alarming levels of non-compliance with electoral regulations. The study found that nearly 25% of declared results directly conflicted with BVAS accreditation data, raising fundamental questions about the election\'s legitimacy. Through systematic analysis of polling unit data, the report documents widespread irregularities including over-voting, result manipulation, and failure to follow prescribed procedures. The findings highlight critical weaknesses in INEC\'s oversight mechanisms and call for urgent reforms to restore credibility to Nigeria\'s electoral processes.',
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'pdf_3',
        title: 'Compromised by Design: Fragile Integrity of INEC\'s Technology',
        summary: 'Explores vulnerabilities in INEC\'s technology (BVAS, IReV), showing risks of manipulation, transparency gaps, and weakening of Nigeria\'s democratic process.',
        fileName: 'Compromised by design.pdf',
        fileSize: '4.1 MB',
        category: 'Technology Assessment',
        publishDate: 'February 2024',
        hostedUrl: 'https://www.dropbox.com/scl/fi/h598d58hbm65jzzpyjosy/Compromised-by-design.pdf?rlkey=6rhvynv8s5fpgfyz250hq71ny&st=dg6e9m4q&dl=1',
        previewContent: 'This technical analysis exposes critical vulnerabilities in INEC\'s electoral technology infrastructure, particularly the Bimodal Voter Accreditation System (BVAS) and the INEC Result Viewing (IReV) portal. The report documents systemic weaknesses that create opportunities for manipulation while maintaining an appearance of technological sophistication. Key concerns include inadequate security protocols, lack of real-time verification mechanisms, and transparency gaps that obscure the true integrity of electoral processes. The study argues that current technological implementations may actually be weakening Nigeria\'s democratic foundations by providing false confidence in compromised systems.',
        createdAt: new Date('2024-02-01').toISOString()
      },
      {
        id: 'pdf_4',
        title: 'Athena Summary of 2023 off-cycle election',
        summary: 'The 2023 off-cycle elections shaped state governance and policy through key gubernatorial and legislative races. Outcomes reflected shifting political dynamics and voter priorities.',
        fileName: 'Athena Sumamry of 2023 off-cycle election.pdf',
        fileSize: '2.5 MB',
        category: 'Comprehensive Report',
        publishDate: 'March 2024',
        hostedUrl: 'https://www.dropbox.com/scl/fi/7nemn0h5blr2u9zvd87ml/Athena-Sumamry-of-2023-off-cycle-election.pdf?rlkey=r96py6i3v4xj0eyxs8xvkuw0c&st=vnejg6m0&dl=1',
        previewContent: 'This comprehensive summary analyzes the 2023 off-cycle elections across Nigeria, examining how these critical gubernatorial and legislative races shaped state governance structures and policy directions. The report provides detailed insights into the electoral outcomes that reflected significant shifts in political dynamics and evolving voter priorities. Key focus areas include voter turnout patterns, candidate performance analysis, and the impact of electoral reforms on overall election quality. The study also evaluates the effectiveness of INEC\'s updated procedures and technology deployment in these smaller-scale elections, offering valuable lessons for future electoral processes.',
        createdAt: new Date('2024-03-01').toISOString()
      },
      {
        id: 'pdf_5',
        title: 'DO VOTES COUNT Bayelsa 2023 election',
        summary: 'Bayelsa 2023 election: PDP\'s Douye Diri wins governorship with over 312,000 votes. The outcome shapes the state\'s political future.',
        fileName: 'DO VOTES COUNT Bayelsa 2023 election.pdf',
        fileSize: '2.9 MB',
        category: 'Election Analysis',
        publishDate: 'November 2023',
        hostedUrl: 'https://www.dropbox.com/scl/fi/v22ffy4s0bnsy05fkkv0f/DO-VOTES-COUNT-Bayelsa-2023-election.pdf?rlkey=jl2km76nidponrwj5vg4aqzdh&st=qc554l2w&dl=1',
        previewContent: 'This detailed analysis of the 2023 Bayelsa State Governorship Election examines the electoral process that led to PDP candidate Douye Diri\'s victory with over 312,000 votes. The report investigates the integrity of the electoral process, including voter accreditation procedures, result compilation and transmission, and the overall conduct of the election. Key findings cover BVAS functionality, polling unit irregularities, and compliance with electoral guidelines. The study also analyzes the implications of this electoral outcome for Bayelsa State\'s political landscape and governance trajectory, providing insights into how the results will shape the state\'s future policy directions and political dynamics.',
        createdAt: new Date('2023-11-01').toISOString()
      },
      {
        id: 'pdf_6',
        title: 'Review of INEC\'s Innovation in Electoral Technology 2015-2025',
        summary: 'A decade-long review examining INEC\'s technological innovations from 2015 to 2025, analyzing the evolution, impact, and effectiveness of electoral technology systems in Nigeria.',
        fileName: 'REVIEW-OF-INEC-S-INNOVATION-IN-ELECTORAL-TECHNOLOGY-2015-2025.pdf',
        fileSize: '11 MB',
        category: 'Technology Assessment',
        publishDate: 'October 2025',
        hostedUrl: 'https://www.dropbox.com/scl/fi/9qmbyv5ntzg1qckyyuxsw/REVIEW-OF-INEC-S-INNOVATION-IN-ELECTORAL-TECHNOLOGY-2015-2025.pdf?rlkey=9mm5n31nrdbrow8wcs5adw7iq&st=ysgxri43&dl=1',
        previewContent: 'This comprehensive decade-long review examines INEC\'s journey in electoral technology innovation from 2015 to 2025, tracing the evolution from card readers to the modern BVAS system. The report provides an in-depth analysis of the development, deployment, and impact of various technological solutions implemented by INEC to enhance electoral integrity. Key areas of focus include the effectiveness of biometric voter authentication, electronic result transmission systems, and the IReV portal. The study evaluates both successes and challenges in technology adoption, offering critical insights into how these innovations have shaped Nigeria\'s electoral landscape. The report also provides recommendations for future technological enhancements and addresses persistent vulnerabilities in the current systems.',
        createdAt: new Date('2025-10-01').toISOString()
      }
    ];

    // Save all default resources
    for (const resource of defaultResources) {
      await kv.set(`pdf_resource:${resource.id}`, resource);
    }

    console.log(`Initialized ${defaultResources.length} default PDF resources`);
    return c.json({ 
      success: true, 
      message: `Initialized ${defaultResources.length} PDF resources successfully` 
    });
  } catch (error) {
    console.error('Error initializing PDF resources:', error);
    return c.json({ error: 'Failed to initialize PDF resources' }, 500);
  }
});



Deno.serve(app.fetch);