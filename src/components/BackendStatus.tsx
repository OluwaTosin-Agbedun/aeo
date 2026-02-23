import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, WifiOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Delay initial check by 2 seconds to let the app load
    const initialTimer = setTimeout(checkBackendStatus, 2000);
    
    // Check status every 60 seconds
    const interval = setInterval(checkBackendStatus, 60000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/health`,
        { 
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );

      if (response.ok) {
        const wasOffline = status === 'offline';
        setStatus('online');
        setShowAlert(false); // Don't show alert when online
        if (wasOffline) {
          // Show success message briefly when coming back online
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 5000);
        }
      } else {
        setStatus('offline');
        setShowAlert(true);
      }
    } catch (error) {
      setStatus('offline');
      setShowAlert(true);
    }
  };

  // Don't show anything if backend is online
  if (status === 'online' && !showAlert) {
    return null;
  }

  // Don't show during initial check
  if (status === 'checking') {
    return null;
  }

  return (
    <>
      {status === 'offline' && showAlert && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <WifiOff className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Running in Offline Mode:</strong> The dashboard is displaying default election data. 
            All viewing features work normally. Backend features (Admin Center, live updates) require deployment.
            <button 
              onClick={checkBackendStatus}
              className="ml-2 underline hover:no-underline text-blue-700"
            >
              Check Connection
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'online' && showAlert && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Backend Connected:</strong> Successfully connected to Supabase Edge Function. All features are now available.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

// Compact status indicator for admin pages
export function BackendStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/health`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );

      setStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      setStatus('offline');
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'checking' && (
        <>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Checking backend...</span>
        </>
      )}
      {status === 'online' && (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700">Backend Online</span>
        </>
      )}
      {status === 'offline' && (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-700">Backend Offline</span>
          <button 
            onClick={checkBackendStatus}
            className="text-blue-600 hover:underline text-xs"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}
