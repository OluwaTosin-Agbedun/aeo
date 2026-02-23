import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Vote, 
  CheckCircle,
  BarChart3,
  FileText,
  Target,
  Calendar
} from 'lucide-react';
import { InteractiveLeadingCandidateCard } from './InteractiveLeadingCandidateCard';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  badge?: string;
}

const StatCard = React.memo(function StatCard({ title, value, description, icon, variant = 'default', progress, badge }: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case 'danger':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      default:
        return 'border-gray-200 bg-white hover:bg-gray-50';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-all duration-200 hover:shadow-md border rounded-xl shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-gray-800">{title}</CardTitle>
        <div className={getIconColor()}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  );
});

function ResultUploadedCard({ percentage }: { percentage: number }) {
  return (
    <Card 
      className="border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md border rounded-xl shadow-sm"
      role="region"
      aria-label={`Result Uploaded ${percentage}%`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-gray-800">Result Uploaded</CardTitle>
        <CheckCircle className="h-4 w-4 text-blue-600" style={{ color: '#0B6FF0' }} aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>{percentage.toFixed(2)}%</div>
        <p className="text-xs text-gray-500 mb-2">Polling Units reporting results</p>
      </CardContent>
    </Card>
  );
}

function LastUpdateCard() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className="border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-md border rounded-xl shadow-sm cursor-help"
            role="region"
            aria-label="Last Update: Nov 19th, 2024 11:59:05 PM"
            aria-live="polite"
            aria-atomic="true"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-gray-800 font-semibold">Last Update</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-gray-900">
                Nov 19th, 2024 11:59:05 PM
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last automatic data sync time</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function VoterTurnoutCard({ percentage, totalVotes, registered }: { percentage: string; totalVotes: number; registered: number }) {
  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150 transition-all duration-200 hover:shadow-md border rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-orange-900">Voter Turnout</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-orange-900 mb-1">{percentage}%</div>
        <p className="text-xs text-orange-800 mb-2">{totalVotes.toLocaleString()} votes cast from {registered.toLocaleString()} registered</p>
      </CardContent>
    </Card>
  );
}

export function OndoStatsCards() {
  const [polling, setPolling] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElectionData();
  }, []);

  const loadElectionData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/Ondo`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPolling(data.data.polling);
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Error loading election data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  const turnoutPercentage = stats?.accreditedVoters && stats?.registeredVoters
    ? ((stats.accreditedVoters / stats.registeredVoters) * 100).toFixed(2)
    : '0';

  const topStats = [
    {
      title: "LGAs Reporting",
      value: `${polling?.reportingLGAs || 0}/${polling?.totalLGAs || 0}`,
      description: "Local Government Areas uploaded",
      icon: <MapPin className="h-4 w-4" />,
      variant: 'success' as const,
      progress: polling?.totalLGAs ? (polling.reportingLGAs / polling.totalLGAs) * 100 : 0
    },
    {
      title: "Total Voters",
      value: formatNumber(stats?.registeredVoters || 0),
      description: "Registered voters in Ondo State",
      icon: <Users className="h-4 w-4" />,
      variant: 'default' as const
    }
  ];

  const electionSummaryStats = [
    {
      title: "EC8A Accredited Voters",
      value: formatNumber(stats?.accreditedVoters || 0),
      description: "Voters accredited using EC8A forms",
      icon: <FileText className="h-4 w-4" />,
      variant: 'default' as const
    },
    {
      title: "Total Number of Valid Votes",
      value: formatNumber(stats?.validVotes || 0),
      description: "Valid votes counted and verified",
      icon: <CheckCircle className="h-4 w-4" />,
      variant: 'success' as const
    },
    {
      title: "Total Number of Votes Cast",
      value: formatNumber(stats?.totalVotes || 0),
      description: "Total votes submitted by voters",
      icon: <Vote className="h-4 w-4" />,
      variant: 'default' as const
    },
    {
      title: "Total Polling Units in Ondo State",
      value: formatNumber(polling?.totalPollingUnits || 0),
      description: "Complete polling unit infrastructure",
      icon: <MapPin className="h-4 w-4" />,
      variant: 'default' as const
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Row: Key Tracking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResultUploadedCard percentage={polling?.uploadPercentage || 0} />
        <VoterTurnoutCard 
          percentage={turnoutPercentage} 
          totalVotes={stats?.totalVotes || 0}
          registered={stats?.registeredVoters || 0}
        />
        <LastUpdateCard />
        <InteractiveLeadingCandidateCard />
        {topStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Election Summary Stats Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-[32px]">Election Summary Stats</h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto text-[16px] font-bold">
            Comprehensive metrics from 2024 Ondo State Governorship Off-Cycle Election data collection and verification process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electionSummaryStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}