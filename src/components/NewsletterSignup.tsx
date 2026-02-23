import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
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

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 border border-green-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Our Community!
          </h3>
          <p className="text-gray-600">
            You're now subscribed to AEO Updates. We'll notify you whenever we publish new election analysis and insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 border border-blue-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Subscribe to AEO Updates
          </h3>
          <p className="text-gray-600">
            Get email updates whenever we publish new election analysis, reports, and insights. Stay informed on election integrity across Nigeria and Africa.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-base"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
