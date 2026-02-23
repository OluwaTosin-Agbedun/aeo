import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from './ui/button';

export const CookieConsent = React.memo(function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies (permanent)
    const consentStatus = localStorage.getItem('cookieConsent');
    
    if (consentStatus === 'accepted') {
      // User accepted permanently, never show again
      return;
    }
    
    if (consentStatus && consentStatus.startsWith('declined_')) {
      // User declined, check if 24 hours have passed
      const declinedTimestamp = parseInt(consentStatus.split('_')[1]);
      const currentTime = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (currentTime - declinedTimestamp < twentyFourHours) {
        // Less than 24 hours have passed, don't show popup
        return;
      }
      // 24 hours have passed, show the popup again
    }
    
    // Show popup after 2 second delay for better UX
    setTimeout(() => {
      setShowConsent(true);
    }, 2000);
  }, []);

  const acceptCookies = () => {
    // Save permanent acceptance
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Save decline with current timestamp
    const currentTimestamp = Date.now();
    localStorage.setItem('cookieConsent', `declined_${currentTimestamp}`);
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl border-2 border-gray-200">
        <div className="p-4 md:p-6">
          {/* Close button */}
          <button
            onClick={declineCookies}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-3">
                <Cookie className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                By clicking "Accept All Cookies", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </a>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
              <Button
                onClick={acceptCookies}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Accept All
              </Button>
              <Button
                onClick={declineCookies}
                variant="outline"
                className="flex-1 md:flex-none border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
