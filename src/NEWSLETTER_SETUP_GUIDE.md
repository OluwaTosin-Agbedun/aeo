# AEO Newsletter System - Setup & Usage Guide

## Overview
Your Athena Election Observatory dashboard now has a complete newsletter system that collects subscriber emails and sends them updates when you publish new blog posts.

## What's Been Implemented

### 1. Email Collection (Public-Facing)
- **Location**: AEO Updates tab, at the bottom
- **Features**:
  - Clean signup form with email validation
  - Success confirmation message
  - Prevents duplicate subscriptions
  - Shows benefits of subscribing

### 2. Newsletter Management Panel (Admin)
- **Location**: AEO Updates tab, between PDF Library and Newsletter Signup
- **Features**:
  - View active subscriber count
  - Send newsletters to all subscribers
  - Pre-filled email templates
  - Real-time sending status

### 3. Backend API
- **Endpoints**:
  - `POST /newsletter/subscribe` - New user subscriptions
  - `POST /newsletter/send` - Send newsletter to all subscribers
  - `GET /newsletter/subscribers` - View subscriber list
  - `POST /newsletter/unsubscribe` - User unsubscribe

## SendGrid Setup Instructions

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### Step 2: Verify Sender Identity
**IMPORTANT**: SendGrid requires sender verification before sending emails.

**Option A: Single Sender Verification (Easiest)**
1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Enter the email: `updates@athenaelectionobservatory.org` (or your preferred email)
4. Fill in your organization details
5. Check your email and click the verification link

**Option B: Domain Authentication (Professional)**
1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow instructions to add DNS records to your domain
4. Wait for verification (usually 24-48 hours)

### Step 3: Get API Key
1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "AEO Newsletter" or similar
4. Select **Full Access** or at minimum **Mail Send** permission
5. Copy the API key (you won't see it again!)
6. You've already provided this in the system

### Step 4: Update Email Address (If Needed)
If you verified a different sender email, update the backend code:
- File: `/supabase/functions/server/index.tsx`
- Find: `email: 'updates@athenaelectionobservatory.org'`
- Replace with your verified email address

## How to Send Newsletter Updates

### When You Publish a New Blog Post:

1. **Go to AEO Updates Tab**
   - Navigate to the "AEO Updates" tab in your dashboard

2. **Find Newsletter Management Section**
   - Located between the PDF library and newsletter signup

3. **Fill Out the Form**:
   - **Email Subject**: Catchy subject line (e.g., "New Analysis: Ondo State Election Results")
   - **Blog Post Title**: Full title of your blog post
   - **Blog Post Excerpt**: Brief summary (optional but recommended)
   - **Blog Post URL**: Full URL to the blog post
   - **Publication Date**: Auto-filled, but you can edit

4. **Click "Send Newsletter"**
   - The system will send emails to all active subscribers
   - You'll see a success message with the count of emails sent

## Email Template

The newsletter emails include:
- Professional header with AEO branding
- Blog post title, date, and excerpt
- "Read Full Analysis" call-to-action button
- Footer with unsubscribe option
- Both HTML (styled) and plain text versions

## Managing Subscribers

### View Subscriber Count
- Displayed in the Newsletter Management section
- Click "Refresh" to update the count

### View All Subscribers
Make a GET request to:
```
https://[your-project-id].supabase.co/functions/v1/make-server-c35202b6/newsletter/subscribers
```

### Export Subscribers
The API returns JSON with all subscriber data including:
- Email addresses
- Subscription dates
- Active status

## Troubleshooting

### "Email service not configured"
- Make sure you've provided your SendGrid API key
- Check that the key has "Mail Send" permissions

### "Failed to send emails via SendGrid"
- Verify your sender email address in SendGrid
- Check SendGrid dashboard for error details
- Ensure you haven't exceeded daily sending limits

### No subscribers receiving emails
- Check that subscribers exist (view count in admin panel)
- Verify emails are marked as "active" in the database
- Check spam folders

### Testing the System
1. Subscribe with your own email first
2. Send a test newsletter
3. Check your inbox (and spam folder)
4. Verify email formatting and links work

## SendGrid Free Tier Limits
- **100 emails per day** (free forever)
- For more, upgrade to paid plans starting at $19.95/month for 50,000 emails

## Best Practices

1. **Send Consistently**: Don't spam, but keep regular cadence
2. **Compelling Subjects**: Make subscribers want to open
3. **Quality Content**: Only send for significant blog posts
4. **Test First**: Send to yourself before mass distribution
5. **Monitor Metrics**: Check SendGrid dashboard for open rates

## Data Storage

All subscriber data is stored in your Supabase database using the KV store:
- Key format: `newsletter:[email]`
- Includes: email, subscription date, active status
- Secure and GDPR-compliant (with unsubscribe option)

## Future Enhancements (Optional)

You could add:
- Email templates for different types of content
- Scheduled sending
- Subscriber segmentation
- Analytics dashboard
- A/B testing for subject lines
- Welcome email for new subscribers

---

**Questions or Issues?**
- Check SendGrid documentation: https://docs.sendgrid.com/
- Review Supabase logs for errors
- Test with your own email first
