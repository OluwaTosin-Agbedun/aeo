import { projectId, publicAnonKey } from './supabase/info';

/**
 * Initialize the backend with default election data if needed
 * This should be called once on first app load
 */
export async function initializeBackendIfNeeded() {
  try {
    console.log('Checking if backend initialization is needed...');
    
    // First, check if data already exists (no timeout to avoid errors)
    const checkResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/states`,
      { 
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      }
    );

    if (checkResponse.ok) {
      const data = await checkResponse.json();
      if (data.success && data.states && data.states.length > 0) {
        console.log('✅ Backend already initialized with', data.states.length, 'states');
        return { success: true, alreadyInitialized: true };
      }
    }

    // If no data exists, initialize with defaults
    console.log('Initializing backend with default data...');
    const initResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/initialize`,
      { 
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('Backend initialization failed:', initResponse.status, errorText);
      return { success: false, error: `Server returned ${initResponse.status}` };
    }

    const result = await initResponse.json();
    console.log('✅ Backend initialized successfully:', result);
    return { success: true, initialized: true };

  } catch (error) {
    console.error('⚠️ Backend initialization error:', error);
    console.log('💡 The app will use default/fallback data. To enable full functionality, ensure the Supabase Edge Function is deployed.');
    
    // Don't throw - just log and continue with fallback data
    return { 
      success: false, 
      error: 'Backend not available - using fallback data',
      usingFallback: true
    };
  }
}

/**
 * Initialize PDF resources if needed
 */
export async function initializePDFResourcesIfNeeded() {
  try {
    console.log('Checking if PDF resources initialization is needed...');
    
    // Check if PDF resources exist
    const checkResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources`,
      { 
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      }
    );

    if (checkResponse.ok) {
      const data = await checkResponse.json();
      if (data.success && data.resources && data.resources.length > 0) {
        console.log('✅ PDF resources already initialized with', data.resources.length, 'items');
        return { success: true, alreadyInitialized: true };
      }
    }

    // Initialize default PDF resources
    console.log('Initializing PDF resources with defaults...');
    const initResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources/initialize`,
      { 
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('PDF resources initialization failed:', initResponse.status, errorText);
      return { success: false, error: `Server returned ${initResponse.status}` };
    }

    const result = await initResponse.json();
    console.log('✅ PDF resources initialized successfully:', result);
    return { success: true, initialized: true };

  } catch (error) {
    console.error('⚠️ PDF resources initialization error:', error);
    console.log('💡 PDF resources will use fallback data.');
    return { 
      success: false, 
      error: 'Backend not available for PDF resources',
      usingFallback: true
    };
  }
}
