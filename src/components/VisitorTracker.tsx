import { useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function VisitorTracker() {
  useEffect(() => {
    trackVisit();
  }, []);

  const trackVisit = async () => {
    try {
      // Get or create visitor ID
      let visitorId = localStorage.getItem('aeo_visitor_id');
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('aeo_visitor_id', visitorId);
      }

      // Detect device type
      const deviceType = getDeviceType();
      
      // Detect browser
      const browser = getBrowser();
      
      // Get screen size
      const screenSize = `${window.screen.width}x${window.screen.height}`;
      
      // Get referrer
      const referrer = document.referrer || 'direct';
      
      // Get current page
      const page = window.location.pathname;
      
      // Track the visit
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/analytics/track`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            visitorId,
            page,
            deviceType,
            browser,
            screenSize,
            referrer,
            timestamp: new Date().toISOString()
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to track visit. Status:', response.status, 'Error:', errorText);
      } else {
        const result = await response.json();
        console.log('Visit tracked successfully:', result);
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      // Only log if it's not a network error in development
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // Network error - likely CORS or server not reachable
        // This is expected in some environments, so we'll just log it quietly
        console.warn('Visitor tracking unavailable (network error)');
      } else {
        console.error('Error tracking visit:', error);
      }
    }
  };

  const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
    if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
    return 'Other';
  };

  return null; // This component doesn't render anything
}