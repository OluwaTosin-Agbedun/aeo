import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FooterProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Footer({ activeTab = 'dashboard', onTabChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Subscribing email:', email);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();
      console.log('Subscription response:', data);

      if (!response.ok) {
        console.error('Subscription failed with status:', response.status);
        throw new Error(data.error || 'Failed to subscribe');
      }

      if (data.alreadySubscribed) {
        console.log('Email already subscribed');
        toast.info('This email is already subscribed to our newsletter');
      } else {
        console.log('Successfully subscribed!');
        setIsSubscribed(true);
        toast.success('Successfully subscribed! You will receive updates when we publish new blog posts.');
      }
      
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] text-white mt-0 pt-0 pb-0">
      {/* Newsletter Section - Hide on Diary of Election tab */}
      {activeTab !== 'diary' && (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 px-3 md:px-4 py-8 md:py-12" data-dynamic-section data-has-data="true">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4 md:mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-3 md:p-4">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Subscribe to AEO Updates
              </h3>
              <p className="text-sm md:text-base text-gray-600 px-2">
                Get email updates whenever we publish new election analysis, reports, and insights. Stay informed on election integrity across Nigeria and Africa.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 md:h-12 px-4 text-sm md:text-base"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 md:h-12 px-6 md:px-8 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap text-sm md:text-base"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Contact Section */}
      <div className="px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
            {/* Organization Info */}
            <div>
              <h3 className="text-lg font-bold mb-3">Athena Election Observatory</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Monitoring election integrity and promoting democratic transparency across Nigeria and Africa.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.location.href = '/aeo/about';
                      }
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('dashboard');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.location.href = '/aeo/dashboard';
                      }
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('diary');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.location.href = '/aeo/diary-of-election';
                      }
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    Diary of Election
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('aeo-updates');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.location.href = '/aeo/aeo-updates';
                      }
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    AEO Updates
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-3">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="text-white/80">Abuja, Nigeria</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                  <a href="mailto:info.centre@athenacentre.org" className="text-white/80 hover:text-white transition-colors">
                    info.centre@athenacentre.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 text-center text-sm text-white/70">
            <p>&copy; {new Date().getFullYear()} Athena Election Observatory. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}