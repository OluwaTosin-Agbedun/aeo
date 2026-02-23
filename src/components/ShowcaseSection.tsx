import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Calendar, Users, CheckCircle, Vote, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import anambraElectionInfographic from 'figma:asset/1ba4abd0d6c7db314c105d9b54cce49b1bac61d8.png';
import candidatesBackground from 'figma:asset/a7e0c31f691e2d10293a4254171a4af70750212e.png';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishDate: string;
  slug?: string;
  category: string;
  author: string;
  createdAt: string;
}

interface ElectionStats {
  registeredVoters: number;
  accreditedVoters: number;
  totalVotes: number;
  rejectedVotes: number;
  validVotes: number;
}

interface PollingData {
  totalPollingUnits: number;
  uploadedResults: number;
  uploadPercentage: number;
  totalLGAs: number;
  reportingLGAs: number;
}

interface Highlight {
  title: string;
  mainStatistic: string;
  description: string;
  colorTheme: string;
}

interface Candidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

interface ShowcaseSectionProps {
  onLearnMore?: () => void;
  onViewMoreInsights?: () => void;
  onNavigateToBlog?: (slug: string) => void;
  onViewAnambraAnalysis?: () => void;
}

export const ShowcaseSection = React.memo(function ShowcaseSection({ onLearnMore, onViewMoreInsights, onNavigateToBlog, onViewAnambraAnalysis }: ShowcaseSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showcasePost, setShowcasePost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [electionStats, setElectionStats] = useState<ElectionStats | null>(null);
  const [pollingData, setPollingData] = useState<PollingData | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Fetch Anambra election data
  useEffect(() => {
    const fetchAnambraData = async () => {
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        // Fetch election stats, polling data, and candidates
        const [statsResponse, highlightsResponse] = await Promise.all([
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/Anambra`,
            { 
              headers: { 'Authorization': `Bearer ${publicAnonKey}` },
              signal: controller.signal
            }
          ),
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/Anambra/highlights`,
            { 
              headers: { 'Authorization': `Bearer ${publicAnonKey}` },
              signal: controller.signal
            }
          )
        ]);

        clearTimeout(timeoutId);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setElectionStats(statsData.data?.stats || statsData.stats);
            setPollingData(statsData.data?.polling || statsData.polling);
            // Fetch candidates from the same response
            if (statsData.data?.candidates) {
              setCandidates(statsData.data.candidates);
            }
          }
        }

        if (highlightsResponse.ok) {
          const highlightsData = await highlightsResponse.json();
          if (highlightsData.success && highlightsData.highlights) {
            setHighlights(highlightsData.highlights);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⏱️ Anambra election data fetch timed out, using fallback data');
        } else {
          console.log('📊 Using fallback election data (backend unavailable)');
        }
        // Set default data for fallback
        setElectionStats({
          registeredVoters: 2800000,
          accreditedVoters: 0,
          totalVotes: 0,
          rejectedVotes: 0,
          validVotes: 0
        });
        setPollingData({
          totalPollingUnits: 5720,
          uploadedResults: 0,
          uploadPercentage: 0,
          totalLGAs: 21,
          reportingLGAs: 0
        });
        setHighlights([
          {
            title: 'Election Date',
            mainStatistic: 'Nov 8, 2025',
            description: 'Anambra State Governorship Election',
            colorTheme: 'blue'
          },
          {
            title: 'Registered Voters',
            mainStatistic: '2.8M',
            description: 'eligible voters across 21 LGAs',
            colorTheme: 'green'
          },
          {
            title: 'Polling Units',
            mainStatistic: '5,720',
            description: 'polling units to be monitored',
            colorTheme: 'purple'
          }
        ]);
      }
    };

    fetchAnambraData();
  }, []);

  // Fetch the latest blog post from the backend
  useEffect(() => {
    const fetchLatestBlogPost = async () => {
      try {
        setIsLoading(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/blog-posts`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        
        // Get the latest blog post (first item as backend sorts by newest first)
        if (data.posts && data.posts.length > 0) {
          setShowcasePost(data.posts[0]);
        } else {
          // Use fallback blog post if none exist
          setShowcasePost({
            id: 'fallback-anambra-2025',
            title: 'Anambra State Governorship Election 2025',
            summary: 'Real-time monitoring and analysis of the Anambra State governorship election',
            content: 'The Athena Election Observatory is providing comprehensive monitoring of the Anambra State governorship election scheduled for November 8, 2025.',
            imageUrl: 'https://images.unsplash.com/photo-1586619057346-bf1b5d620817?w=800',
            publishDate: 'November 8, 2025',
            slug: 'anambra-2025-monitoring',
            category: 'Election Monitoring',
            author: 'AEO Team',
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⏱️ Blog post fetch timed out, using fallback blog post');
        } else {
          console.log('📰 Using fallback blog post (backend unavailable)');
        }
        // Use fallback blog post on error
        setShowcasePost({
          id: 'fallback-anambra-2025',
          title: 'Anambra State Governorship Election 2025',
          summary: 'Real-time monitoring and analysis of the Anambra State governorship election',
          content: 'The Athena Election Observatory is providing comprehensive monitoring of the Anambra State governorship election scheduled for November 8, 2025.',
          imageUrl: 'https://images.unsplash.com/photo-1586619057346-bf1b5d620817?w=800',
          publishDate: 'November 8, 2025',
          slug: 'anambra-2025-monitoring',
          category: 'Election Monitoring',
          author: 'AEO Team',
          createdAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogPost();
  }, []);

  const handleReadMore = () => {
    // Navigate to Anambra State analysis in the dashboard
    if (onViewAnambraAnalysis) {
      onViewAnambraAnalysis();
    }
  };

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  const turnoutPercentage = electionStats?.accreditedVoters && electionStats?.registeredVoters
    ? ((electionStats.accreditedVoters / electionStats.registeredVoters) * 100).toFixed(2)
    : '0.00';

  // Don't render anything if no blog post is available
  if (isLoading || !showcasePost) {
    return null;
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-lg md:rounded-xl shadow-lg">
        {/* Background with overlay */}
        <div 
          className="relative bg-[#2d5a6f] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(45, 90, 111, 0.85), rgba(45, 90, 111, 0.85)), url(${showcasePost.imageUrl})`
          }}
        >
          <div 
            className="relative z-10 px-4 md:px-6 py-8 md:py-12"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${showcasePost.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="w-full max-w-5xl mx-auto">
              {/* Featured Badge */}
              <div className="flex justify-center mb-5">
                <Badge className="bg-yellow-400 text-gray-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                  Ekiti State Governorship Election - 2026
                </Badge>
              </div>

              {/* Header Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Ekiti State Election Overview
                </h2>
                <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto">
                  Comprehensive monitoring of Nigeria's upcoming governorship election
                </p>
              </div>

              {/* Key Highlight Indicators */}
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Election Date */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-5 border border-blue-400/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                        Election Date
                      </div>
                    </div>
                    <div className="text-white text-2xl md:text-3xl font-black mb-1">
                      25 June 2026
                    </div>
                    <div className="text-white/80 text-xs">
                      Swearing-in: 16 October 2026
                    </div>
                  </div>

                  {/* Polling Infrastructure */}
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg p-5 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Vote className="w-5 h-5 text-yellow-400" />
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                        Polling Infrastructure
                      </div>
                    </div>
                    <div className="text-white text-2xl md:text-3xl font-black mb-1">
                      2,445 Units
                    </div>
                    <div className="text-white/80 text-xs">
                      Across 16 LGAs · 177 Wards
                    </div>
                  </div>

                  {/* Candidates */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-5 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-yellow-400" />
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                        Candidates
                      </div>
                    </div>
                    <div className="text-white text-2xl md:text-3xl font-black mb-1">
                      11 Parties
                    </div>
                    <div className="text-white/80 text-xs">
                      APC, LP, NNPP, AAC & 7 others
                    </div>
                  </div>
                </div>

                {/* State Overview Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">State Profile</h3>
                      </div>
                      <div className="space-y-2 text-xs text-white/80">
                        <div className="flex justify-between">
                          <span className="text-white/60">Capital:</span>
                          <span className="text-white font-semibold">Ado-Ekiti</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Geo-Political Zone:</span>
                          <span className="text-white font-semibold">South West</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Landmass:</span>
                          <span className="text-white font-semibold">6,353 sq. km</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-yellow-400" />
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Incumbent Governor</h3>
                      </div>
                      <div className="space-y-2 text-xs text-white/80">
                        <div className="flex justify-between">
                          <span className="text-white/60">Name:</span>
                          <span className="text-white font-semibold">Biodun A. Oyebanji</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Age:</span>
                          <span className="text-white font-semibold">58 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Party:</span>
                          <span className="text-white font-semibold">APC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
      </section>

      {/* Full Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full h-[85vh] p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-400 text-gray-900">
                    {selectedPost?.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {selectedPost?.publishDate}
                  </div>
                </div>
                <DialogTitle className="text-2xl text-gray-900 pr-8">
                  {selectedPost?.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  By {selectedPost?.author}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Featured Image */}
              {selectedPost?.imageUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1586619057346-bf1b5d620817?w=800';
                    }}
                  />
                </div>
              )}

              {/* Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {selectedPost?.summary}
                </p>
              </div>

              {/* Full Content */}
              <div className="prose prose-lg max-w-none">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Full Analysis</h3>
                <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {selectedPost?.content}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <Button 
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});