import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Mail, Users, Send, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Subscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

export function NewsletterAdmin() {
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [deletingEmails, setDeletingEmails] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    subject: '',
    blogTitle: '',
    blogExcerpt: '',
    blogUrl: '',
    blogDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  // Fetch subscriber count on load and set up auto-refresh polling
  useEffect(() => {
    // Test server health first
    const testServerHealth = async () => {
      try {
        const healthResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/health`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        
        if (healthResponse.ok) {
          // Initial fetch
          fetchSubscriberCount();

          // Set up polling to auto-refresh every 10 seconds
          const pollInterval = setInterval(() => {
            fetchSubscriberCount();
          }, 10000); // 10 seconds

          // Cleanup interval on component unmount
          return () => clearInterval(pollInterval);
        } else {
          // Server responded but not healthy - show error only once on initial load
          toast.error('Backend server is not responding. Please check if it is deployed.');
          setIsLoadingCount(false);
        }
      } catch (error) {
        // Network error - likely in preview mode without deployed backend
        // Only show toast, don't spam console
        toast.error('Cannot connect to backend server. Please ensure the Supabase edge function is deployed.');
        setIsLoadingCount(false);
      }
    };

    testServerHealth();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/newsletter/subscribers`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        // Silent fail on poll failures
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setSubscriberCount(data.count);
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      // Silent fail on polling - network errors are expected in preview environments
      // Only log in development for debugging
      if (window.location.hostname === 'localhost') {
        console.log('Newsletter subscriber fetch failed (expected in preview):', error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.blogTitle || !formData.blogUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/newsletter/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Newsletter send error:', data);
        const errorMsg = data.error || 'Failed to send newsletter';
        const hintMsg = data.hint || '';
        
        // Show detailed error
        toast.error(errorMsg, { duration: 8000 });
        
        // Show hint if available
        if (hintMsg) {
          setTimeout(() => {
            toast.info(hintMsg, { duration: 10000 });
          }, 500);
        }
        
        throw new Error(errorMsg);
      }

      setEmailSent(true);
      toast.success(`Newsletter sent successfully to ${data.sent} subscribers!`);
      
      // Reset form
      setFormData({
        subject: '',
        blogTitle: '',
        blogExcerpt: '',
        blogUrl: '',
        blogDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });

      // Reset success state after 5 seconds
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the subscriber list?`)) {
      return;
    }

    // Add to deleting set to show loading state
    setDeletingEmails(prev => new Set(prev).add(email));

    try {
      console.log('Deleting subscriber:', email);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/newsletter/unsubscribe`,
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
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete subscriber');
      }

      toast.success(`Successfully removed ${email} from subscribers`);
      
      // Refresh the subscriber list
      await fetchSubscriberCount();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to remove subscriber. Please try again.');
    } finally {
      // Remove from deleting set
      setDeletingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(email);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscriber Stats */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Subscribers</p>
              {isLoadingCount ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{subscriberCount}</p>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchSubscriberCount}
            disabled={isLoadingCount}
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* Send Newsletter Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 rounded-full p-2">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Send Newsletter</h3>
            <p className="text-sm text-gray-600">Notify subscribers about new blog posts</p>
          </div>
        </div>

        {emailSent && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Newsletter sent successfully!</p>
          </div>
        )}

        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject *
            </label>
            <Input
              type="text"
              placeholder="e.g., New Analysis: Ondo State Election Results"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Post Title *
            </label>
            <Input
              type="text"
              placeholder="e.g., Electoral Integrity in Cameroon's 2025 Presidential Election"
              value={formData.blogTitle}
              onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
              required
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Post Excerpt
            </label>
            <Textarea
              placeholder="A brief summary of the blog post (optional)"
              value={formData.blogExcerpt}
              onChange={(e) => setFormData({ ...formData, blogExcerpt: e.target.value })}
              rows={3}
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Post URL *
            </label>
            <Input
              type="url"
              placeholder="https://yourwebsite.com/blog/post-url"
              value={formData.blogUrl}
              onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
              required
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publication Date
            </label>
            <Input
              type="text"
              placeholder="e.g., October 16, 2025"
              value={formData.blogDate}
              onChange={(e) => setFormData({ ...formData, blogDate: e.target.value })}
              disabled={isSending}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSending || subscriberCount === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending to {subscriberCount} subscribers...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter to {subscriberCount} Subscribers
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Subscriber List Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Subscriber List</h3>
            <p className="text-sm text-gray-600 mt-1">
              {subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'} • Auto-refreshing every 10s
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>

        {isLoadingCount ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : subscribers.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber, index) => (
                  <TableRow key={subscriber.email}>
                    <TableCell className="font-medium text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {subscriber.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubscriber(subscriber.email)}
                        disabled={deletingEmails.has(subscriber.email)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingEmails.has(subscriber.email) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No subscribers yet</p>
          </div>
        )}
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm text-blue-800">
            <strong>⚠️ Important SendGrid Setup:</strong> Before sending newsletters, you must verify your sender email address in SendGrid.
          </p>
        </div>
        <div className="bg-white/50 rounded p-3 text-sm text-blue-900">
          <p className="font-semibold mb-2">Required Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Log in to your SendGrid account</li>
            <li>Go to Settings → Sender Authentication → Single Sender Verification</li>
            <li>Add and verify: <code className="bg-blue-100 px-1 py-0.5 rounded">updates@athenaelectionobservatory.org</code></li>
            <li>Check your email and click the verification link</li>
          </ol>
        </div>
        <div>
          <a 
            href="https://app.sendgrid.com/settings/sender_auth/senders" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-700 hover:text-blue-900 underline font-medium"
          >
            → Open SendGrid Sender Verification Settings
          </a>
        </div>
      </div>
    </div>
  );
}