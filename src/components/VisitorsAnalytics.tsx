import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  Calendar,
  Clock,
  RefreshCw,
  Trash2,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  pageViews: Record<string, number>;
  topPages: Array<{ page: string; count: number }>;
  referrerBreakdown: Record<string, number>;
  recentVisits: Array<any>;
}

export function VisitorsAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6`;

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/analytics/stats`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (!response.ok) throw new Error('Failed to load analytics');

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
        setLastUpdated(new Date());
      }
    } catch (error) {
      // Silent fail in preview mode - backend might not be deployed
      if (window.location.hostname === 'localhost') {
        console.log('Analytics loading failed (expected in preview):', error instanceof Error ? error.message : 'Unknown error');
      }
      toast.error('Failed to load visitor analytics. Please ensure backend is deployed.');
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldData = async () => {
    if (!confirm('Delete visitor data older than 24 hours? This will permanently remove historical records.')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/analytics/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ hoursToKeep: 24 })
      });

      if (!response.ok) throw new Error('Failed to cleanup data');

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error cleaning up data:', error);
      toast.error('Failed to cleanup old data');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getPageName = (path: string) => {
    if (path === '/') return 'Home';
    return path.replace('/', '').split('/')[0] || 'Home';
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertDescription>
          No analytics data available yet. Visitor tracking is active and data will appear as users visit the site.
        </AlertDescription>
      </Alert>
    );
  }

  const totalDevices = Object.values(analytics.deviceBreakdown).reduce((a, b) => a + b, 0);
  const totalBrowsers = Object.values(analytics.browserBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Website Analytics Dashboard</h3>
          <p className="text-sm text-gray-600 mt-1">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAnalytics} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={cleanupOldData} variant="outline" size="sm" disabled={loading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Records (24h+)
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Unique devices tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.deviceBreakdown.desktop || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Desktop visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.deviceBreakdown.mobile || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Mobile visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tablet</CardTitle>
            <Tablet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.deviceBreakdown.tablet || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Tablet visitors</p>
          </CardContent>
        </Card>
      </div>

      {/* Browser Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Browser Breakdown
          </CardTitle>
          <CardDescription>Unique visitors by browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analytics.browserBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([browser, count]) => {
              const percentage = totalBrowsers > 0 ? (count / totalBrowsers) * 100 : 0;
              return (
                <div key={browser} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{browser}</span>
                    <div className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Traffic Sources
          </CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.referrerBreakdown)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([referrer, count]) => {
                const percentage = analytics.totalVisits > 0 
                  ? (count / analytics.totalVisits) * 100 
                  : 0;
                return (
                  <div key={referrer} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium truncate max-w-md">
                      {referrer === 'direct' ? '🔗 Direct / Bookmark' : `🌐 ${referrer}`}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{count} sessions</span>
                      <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}