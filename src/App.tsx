import React, { useState, useEffect } from 'react';
import { NigeriaMapWithOndo } from './components/NigeriaMapWithOndo';
import { OndoStatsCards } from './components/OndoStatsCards';
import { DynamicStatsCards } from './components/DynamicStatsCards';
import { StatesSummaryTable } from './components/StatesSummaryTable';
import { PDFResourceLibrary } from './components/PDFResourceLibrary';
import { BlogUpdates } from './components/BlogUpdates';
import { ElectoralIntegrityLanding } from './components/ElectoralIntegrityLanding';
import { PreElectionLanding } from './components/PreElectionLanding';
import { CoteIvoireLanding } from './components/CoteIvoireLanding';
import { OndoStateLanding } from './components/OndoStateLanding';
import { OndoLGABreakdown } from './components/OndoLGABreakdown';
import { GenericLGABreakdown } from './components/GenericLGABreakdown';
import { DynamicBlogLanding } from './components/DynamicBlogLanding';
import { ShowcaseSection } from './components/ShowcaseSection';
import { AboutLanding } from './components/AboutLanding';
import { DiaryOfElection } from './components/DiaryOfElection';
import { StatesFilter } from './components/StatesFilter';
import { NoRecordsMessage } from './components/NoRecordsMessage';
import { NewsletterSignup } from './components/NewsletterSignup';
import { NewsletterAdmin } from './components/NewsletterAdmin';
import { ElectionDataAdmin } from './components/ElectionDataAdmin';
import { BlogPostAdmin } from './components/BlogPostAdmin';
import { PDFResourceAdmin } from './components/PDFResourceAdmin';
import { VisitorTracker } from './components/VisitorTracker';
import { VisitorsAnalytics } from './components/VisitorsAnalytics';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CookieConsent } from './components/CookieConsent';
import { BackendStatus } from './components/BackendStatus';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { Settings } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { initializeBackendIfNeeded, initializePDFResourcesIfNeeded } from './utils/initializeBackend';
import heroImage from 'figma:asset/458baee4b588f524bba4f85be07600b1d9c6b3d6.png';

interface Highlight {
  title: string;
  mainStatistic: string;
  description: string;
  colorTheme: string;
}

interface ElectionData {
  candidates: any[];
  stats: any;
  polling: any;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [dynamicBlogSlug, setDynamicBlogSlug] = useState<string | null>(null);
  const [lgaBreakdownState, setLgaBreakdownState] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [loadingElectionData, setLoadingElectionData] = useState(false);
  const [statesWithData, setStatesWithData] = useState<string[]>([]);

  // Detect if we're on localhost or .figma.site (admin domain)
  const isAdminDomain = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname.endsWith('.figma.site'));

  // Initialize backend on first load
  useEffect(() => {
    const initBackend = async () => {
      console.log('🚀 Initializing Athena Election Observatory backend...');
      console.log('🌐 Backend URL:', `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6`);
      
      // First, check if backend is reachable
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const healthCheck = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/health`,
          { 
            headers: { 'Authorization': `Bearer ${publicAnonKey}` },
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        if (healthCheck.ok) {
          console.log('✅ Backend health check passed');
          const backendResult = await initializeBackendIfNeeded();
          const pdfResult = await initializePDFResourcesIfNeeded();
          
          if (backendResult.success) {
            console.log('✅ Backend initialization successful');
          }
        } else {
          console.log('⚠️ Backend health check returned status:', healthCheck.status);
          console.log('📊 Running in fallback mode - using default election data');
        }
      } catch (error) {
        // Silent handling of timeout errors - this is expected when backend is not deployed
        if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
          console.log('📊 Backend not responding - using fallback mode with default data');
        } else {
          console.log('📊 Backend connection issue - using fallback mode');
        }
      }
    };

    initBackend();
  }, []);

  // Fetch list of states with data on mount
  useEffect(() => {
    const fetchStatesWithData = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/states`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.states && Array.isArray(data.states)) {
            setStatesWithData(data.states.map((s: any) => s.name));
          } else {
            // Use default states if no data
            setStatesWithData(['Ondo', 'Anambra']);
          }
        } else {
          // Use default states if backend fails
          setStatesWithData(['Ondo', 'Anambra']);
        }
      } catch (error) {
        // Use default states if backend is not available
        console.log('Backend not available - using default states: Ondo, Anambra');
        setStatesWithData(['Ondo', 'Anambra']);
      }
    };

    // Wait a bit for backend initialization before fetching
    setTimeout(fetchStatesWithData, 2000);
  }, []);

  // Fetch election data and highlights when state is selected
  useEffect(() => {
    const fetchStateData = async () => {
      if (!selectedState) {
        setHighlights([]);
        setElectionData(null);
        setLoadingHighlights(false);
        setLoadingElectionData(false);
        return;
      }

      try {
        setLoadingElectionData(true);
        setLoadingHighlights(true);

        // Fetch main election data
        const dataResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/${selectedState}`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        );

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          if (data.success && data.data) {
            setElectionData(data.data);
          } else {
            setElectionData(null);
          }
        } else {
          setElectionData(null);
        }

        // Fetch highlights
        const highlightsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/${selectedState}/highlights`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        );

        if (highlightsResponse.ok) {
          const highlightsData = await highlightsResponse.json();
          if (highlightsData.success && highlightsData.highlights && highlightsData.highlights.length > 0) {
            setHighlights(highlightsData.highlights);
          } else {
            setHighlights([]);
          }
        } else {
          setHighlights([]);
        }
      } catch (error) {
        // Silently handle fetch errors
        console.log('Error fetching state data:', error);
        setElectionData(null);
        setHighlights([]);
      } finally {
        setLoadingElectionData(false);
        setLoadingHighlights(false);
      }
    };

    fetchStateData();
  }, [selectedState]);

  // Dynamic section collapse management
  useEffect(() => {
    const sections = document.querySelectorAll('[data-dynamic-section]');
    sections.forEach(section => {
      const hasData = section.getAttribute('data-has-data') === 'true';
      if (!hasData) {
        section.setAttribute('data-state', 'no-data');
      }
    });
  }, [selectedState, activeTab]);

  // Handle URL path changes for navigation
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (path === '/aeo/cameroon-election-update') {
        setActiveTab('electoral-integrity');
        setSelectedState(null);
      } else if (path === '/aeo/cameroon-pre-election-analysis') {
        setActiveTab('pre-election');
        setSelectedState(null);
      } else if (path === '/aeo/cote-ivoire-election-insight') {
        setActiveTab('cote-ivoire');
        setSelectedState(null);
      } else if (path === '/aeo/ondo-state-election-insight') {
        setActiveTab('ondo-state');
        setSelectedState(null);
      } else if (path === '/aeo/ondo-lga-breakdown') {
        setActiveTab('ondo-lga');
        setSelectedState(null);
      } else if (path.startsWith('/aeo/lga-breakdown/')) {
        // Handle generic LGA breakdown for any state
        const stateName = decodeURIComponent(path.replace('/aeo/lga-breakdown/', ''))
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setLgaBreakdownState(stateName);
        setActiveTab('generic-lga');
        setSelectedState(null);
      } else {
        setActiveTab('dashboard');
        setSelectedState(null);
        
        // Handle tab navigation from URL
        if (path === '/aeo/about') {
          setActiveTab('about');
        } else if (path === '/aeo/dashboard' || path === '/aeo' || path === '/') {
          setActiveTab('dashboard');
          setSelectedState(null);
        } else if (path === '/aeo/diary-of-election') {
          setActiveTab('diary');
        } else if (path === '/aeo/aeo-updates') {
          setActiveTab('aeo-updates');
          
          // Handle scroll to latest insights if hash is present
          if (hash === '#latest-insights') {
            setTimeout(() => {
              const element = document.getElementById('latest-insights');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }
        
        // Handle state selection from URL pattern: /aeo/dashboard/state-name
        const dashboardStateMatch = path.match(/^\/aeo\/dashboard\/(.+)/);
        if (dashboardStateMatch) {
          const stateName = decodeURIComponent(dashboardStateMatch[1])
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setSelectedState(stateName);
          setActiveTab('dashboard');
        }
        
        // Handle dynamic blog landing from URL pattern: /aeo/blog/blog-slug
        const dynamicBlogMatch = path.match(/^\/aeo\/blog\/(.+)/);
        if (dynamicBlogMatch) {
          const blogSlug = decodeURIComponent(dynamicBlogMatch[1]);
          setDynamicBlogSlug(blogSlug);
          setActiveTab('dynamic-blog');
        }
      }
    };

    // Handle initial load
    handleNavigation();

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Handle blog navigation
  const handleBlogNavigation = (blogId: string) => {
    if (blogId === '1') {
      // Côte d'Ivoire 2025 Election Insight - dedicated landing page
      window.history.pushState({}, '', '/aeo/cote-ivoire-election-insight');
      setActiveTab('cote-ivoire');
      setSelectedState(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (blogId === '2') {
      // October 2025 Post-Election Update - Cameroon
      window.history.pushState({}, '', '/aeo/cameroon-election-update');
      setActiveTab('electoral-integrity');
      setSelectedState(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (blogId === '3') {
      // October 2025 Pre-Election Analysis - Cameroon
      window.history.pushState({}, '', '/aeo/cameroon-pre-election-analysis');
      setActiveTab('pre-election');
      setSelectedState(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (blogId === '4') {
      // Ondo State 2024 Election Insight - dedicated landing page
      window.history.pushState({}, '', '/aeo/ondo-state-election-insight');
      setActiveTab('ondo-state');
      setSelectedState(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (blogId === '5') {
      // Ondo State 2024 LGA Breakdown - dedicated landing page
      window.history.pushState({}, '', '/aeo/ondo-lga-breakdown');
      setActiveTab('ondo-lga');
      setSelectedState(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle dynamic blog navigation by slug
  const handleDynamicBlogNavigation = (slug: string) => {
    window.history.pushState({}, '', `/aeo/blog/${slug}`);
    setDynamicBlogSlug(slug);
    setActiveTab('dynamic-blog');
    setSelectedState(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL based on tab
    const tabUrls: Record<string, string> = {
      'about': '/aeo/about',
      'dashboard': '/aeo/dashboard',
      'diary': '/aeo/diary-of-election',
      'aeo-updates': '/aeo/aeo-updates',
      'admin': '/aeo/admin'
    };
    
    window.history.pushState({}, '', tabUrls[tab] || '/aeo/dashboard');
    
    // Scroll to top after a brief delay to ensure tab content is rendered
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle state selection with URL update
  const handleStateSelect = (state: string | null) => {
    setSelectedState(state);
    if (state) {
      const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
      window.history.pushState({}, '', `/aeo/dashboard/${stateSlug}`);
    } else {
      window.history.pushState({}, '', '/aeo/dashboard');
    }
  };

  // Handle LGA breakdown navigation for any state
  const handleLGABreakdownNavigation = (stateName: string) => {
    const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
    window.history.pushState({}, '', `/aeo/lga-breakdown/${stateSlug}`);
    setLgaBreakdownState(stateName);
    setActiveTab('generic-lga');
    setSelectedState(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If showing the Post-Election landing page, render it with navigation
  if (activeTab === 'electoral-integrity') {
    return (
      <>
        <VisitorTracker />
        <ElectoralIntegrityLanding activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing the Pre-Election landing page, render it with navigation
  if (activeTab === 'pre-election') {
    return (
      <>
        <VisitorTracker />
        <PreElectionLanding activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing the Côte d'Ivoire landing page, render it with navigation
  if (activeTab === 'cote-ivoire') {
    return (
      <>
        <VisitorTracker />
        <CoteIvoireLanding activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing the Ondo State landing page, render it with navigation
  if (activeTab === 'ondo-state') {
    return (
      <>
        <VisitorTracker />
        <OndoStateLanding activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing a generic LGA breakdown page for any state, render it with navigation
  if (activeTab === 'generic-lga' && lgaBreakdownState) {
    return (
      <>
        <VisitorTracker />
        <GenericLGABreakdown stateName={lgaBreakdownState} activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing the Ondo State LGA Breakdown landing page, render it with navigation
  if (activeTab === 'ondo-lga') {
    return (
      <>
        <VisitorTracker />
        <OndoLGABreakdown activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing a dynamic blog landing page, render it with navigation
  if (activeTab === 'dynamic-blog' && dynamicBlogSlug) {
    return (
      <>
        <VisitorTracker />
        <DynamicBlogLanding slug={dynamicBlogSlug} activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  // If showing the About landing page, render it with navigation
  if (activeTab === 'about') {
    return (
      <>
        <VisitorTracker />
        <AboutLanding activeTab={activeTab} onTabChange={handleTabChange} isAdminDomain={isAdminDomain} />
        <CookieConsent />
      </>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen flex flex-col">
      <Toaster />
      <VisitorTracker />
      
      {/* Hero Header - ACLED Style */}
      <header className="bg-[#1e3a5f] border-b border-white/10 flex-shrink-0">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4 lg:py-5 gap-2 md:gap-4">
            {/* Logo/Brand */}
            <div className="flex-shrink min-w-0">
              <h1 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-black uppercase tracking-tight truncate">
                Athena Election Observatory
              </h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-shrink-0">
              <button
                onClick={() => handleTabChange('about')}
                className={`px-3 md:px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`px-3 md:px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabChange('diary')}
                className={`px-2 md:px-3 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-[10px] md:text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'diary'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Diary of Election
              </button>
              <button
                onClick={() => handleTabChange('aeo-updates')}
                className={`px-2 md:px-3 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-[10px] md:text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'aeo-updates'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                AEO Updates
              </button>
              {isAdminDomain && (
                <button
                  onClick={() => handleTabChange('admin')}
                  className={`px-3 md:px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'admin'
                      ? 'bg-red-600/90'
                      : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  <Settings className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1" />
                  Admin
                </button>
              )}
            </nav>

            {/* Mobile Navigation - Hamburger Menu */}
            <div className="md:hidden flex-shrink-0">
              <MobileNav 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                isAdminDomain={isAdminDomain}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto px-3 md:px-4 pt-2 md:pt-8 pb-0 flex-grow" style={{marginBottom: 0}}>
        {/* Backend Status Alert */}
        <BackendStatus />
        
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3 md:space-y-8 pb-0" style={{marginBottom: 0}}>
            {/* Showcase Section */}
            <ShowcaseSection 
              onLearnMore={() => handleBlogNavigation('1')} 
              onViewMoreInsights={() => {
                window.history.pushState({}, '', '/aeo/aeo-updates#latest-insights');
                setActiveTab('aeo-updates');
                // Scroll to Latest Insights section after tab renders
                setTimeout(() => {
                  const element = document.getElementById('latest-insights');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              onNavigateToBlog={handleDynamicBlogNavigation}
              onViewAnambraAnalysis={() => {
                // Select Anambra State and navigate to dashboard filter section
                handleStateSelect('Anambra');
                setActiveTab('dashboard');
                // Scroll to the state analysis content after state is selected and rendered
                setTimeout(() => {
                  // First try to scroll to the analysis start (where content appears)
                  const analysisElement = document.getElementById('state-analysis-start');
                  if (analysisElement) {
                    analysisElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback to filter section
                    const filterElement = document.getElementById('state-filter-section');
                    if (filterElement) {
                      filterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }, 300);
              }}
            />

            <Separator />

            {/* Map Section */}
            <section className="space-y-6 md:space-y-8">
              <div className="text-center px-2">
                <h2 className="mb-2 text-2xl md:text-3xl lg:text-[32px] font-bold">Nigeria Election Coverage Map</h2>
                <p className="text-muted-foreground max-w-4xl mx-auto text-base md:text-lg lg:text-[20px]">
                  Interactive map of Nigeria's 36 states: Green highlights upcoming elections under active monitoring, while blue indicates past elections with completed oversight and archived results.
                </p>
              </div>
              <div className="w-full">
                <NigeriaMapWithOndo 
                  onOndoClick={() => {
                    // For desktop: Navigate to Ondo State landing page
                    handleBlogNavigation('4');
                  }}
                />
              </div>
            </section>

            <Separator />

            {/* Summary Table */}
            <section>
              <div className="w-full">
                <StatesSummaryTable 
                  onStateClick={(state) => {
                    const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
                    window.history.pushState({}, '', `/aeo/dashboard/${stateSlug}`);
                    setSelectedState(state);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  onOndoNavigate={() => handleBlogNavigation('4')}
                  onOndoLGANavigate={() => handleBlogNavigation('5')}
                  onStateLGANavigate={handleLGABreakdownNavigation}
                />
              </div>
            </section>

            <Separator />

            {/* States Filter Section */}
            <section id="state-filter-section">
              <StatesFilter 
                selectedState={selectedState}
                onStateSelect={handleStateSelect}
              />
            </section>

            {/* Conditional Content Based on Selected State */}
            {selectedState && (
              <>
                <Separator id="state-analysis-start" />
                
                {electionData ? (
                  <>
                    {/* Live Tracker Stats - Dynamic for any state with data */}
                    <section data-dynamic-section data-has-data="true">
                      <div className="mb-6 text-center">
                        <h2 className="mb-2 text-[32px] font-bold">Live Tracker Snapshot - {selectedState} State Focus</h2>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-[20px]">
                          {selectedState === 'Ondo' 
                            ? 'Real-time monitoring of 2024 Ondo State Governorship Off-Cycle Election with 99.97% upload completion and all 18 LGAs reporting'
                            : `Real-time monitoring of ${selectedState} State election with ${electionData.polling?.totalPollingUnits && electionData.polling?.uploadedResults ? ((electionData.polling.uploadedResults / electionData.polling.totalPollingUnits) * 100).toFixed(2) : '0.00'}% upload completion and ${electionData.polling?.reportingLGAs || 0} of ${electionData.polling?.totalLGAs || 0} LGAs reporting`
                          }
                        </p>
                      </div>
                      {selectedState === 'Ondo' ? (
                        <OndoStatsCards />
                      ) : (
                        <DynamicStatsCards 
                          stateName={selectedState}
                          stats={electionData.stats}
                          polling={electionData.polling}
                          candidates={electionData.candidates}
                        />
                      )}
                    </section>

                    <Separator />

                    {/* Key Highlights Section - Dynamic for any state */}
                    {highlights.length > 0 && (
                      <section data-dynamic-section data-has-data="true">
                        <div className="mb-6 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Key Highlights - {selectedState} Election Monitoring</h3>
                          <p className="text-sm text-gray-600">Critical developments and key metrics from the election</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                          {highlights.map((highlight, index) => {
                            const colorMap = {
                              blue: { from: 'from-blue-50', to: 'to-blue-100', border: 'border-blue-200', dot: 'bg-blue-600', title: 'text-blue-900', text: 'text-blue-800' },
                              green: { from: 'from-green-50', to: 'to-green-100', border: 'border-green-200', dot: 'bg-green-600', title: 'text-green-900', text: 'text-green-800' },
                              purple: { from: 'from-purple-50', to: 'to-purple-100', border: 'border-purple-200', dot: 'bg-purple-600', title: 'text-purple-900', text: 'text-purple-800' },
                              red: { from: 'from-red-50', to: 'to-red-100', border: 'border-red-200', dot: 'bg-red-600', title: 'text-red-900', text: 'text-red-800' },
                              orange: { from: 'from-orange-50', to: 'to-orange-100', border: 'border-orange-200', dot: 'bg-orange-600', title: 'text-orange-900', text: 'text-orange-800' },
                              teal: { from: 'from-teal-50', to: 'to-teal-100', border: 'border-teal-200', dot: 'bg-teal-600', title: 'text-teal-900', text: 'text-teal-800' }
                            };
                            const colors = colorMap[highlight.colorTheme as keyof typeof colorMap] || colorMap.blue;
                            
                            return (
                              <div key={index} className={`bg-gradient-to-br ${colors.from} ${colors.to} rounded-xl p-6 shadow-sm border ${colors.border}`}>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
                                  <h4 className={`font-bold text-lg ${colors.title}`}>{highlight.title}</h4>
                                </div>
                                <p className={colors.text}>
                                  <span className="font-bold text-2xl">{highlight.mainStatistic}</span> {highlight.description}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  /* No Records Message for States Without Data */
                  <section className="mb-0 pb-0" data-dynamic-section data-has-data="true">
                    <NoRecordsMessage stateName={selectedState} statesWithData={statesWithData} />
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* Diary Tab Content */}
        {activeTab === 'diary' && (
          <div className="pb-0" style={{marginBottom: 0}}>
            <div className="mb-2 md:mb-6 text-center px-2">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl lg:text-3xl font-bold">Diary of Election</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base">
                Your one-stop resource for election timelines in Nigeria, Africa, and beyond. The calendar highlights upcoming polls as well as past elections, offering easy access to key dates, contexts, and details—all in one place, at your fingertips.
              </p>
            </div>
            <DiaryOfElection />
          </div>
        )}

        {/* AEO Updates Tab Content */}
        {activeTab === 'aeo-updates' && (
          <div className="pb-0" style={{marginBottom: 0}}>
            <div className="w-full space-y-6 md:space-y-8" style={{marginBottom: 0}}>
              {/* Blog Updates Section */}
              <section id="latest-insights" className="bg-white rounded-lg shadow-sm p-4 md:p-6 scroll-mt-4">
                <BlogUpdates onNavigateToLanding={handleDynamicBlogNavigation} />
              </section>

              <Separator />

              {/* PDF Resource Library Section */}
              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-0 pb-4 md:pb-6">
                <PDFResourceLibrary />
              </section>
            </div>
          </div>
        )}

        {/* Admin Center Tab Content - Only visible on localhost and .figma.site */}
        {isAdminDomain && activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-red-900">Admin Center</h2>
              </div>
              <p className="text-red-700">
                ⚠️ <strong>Security Notice:</strong> This admin panel is only visible on localhost and .figma.site domains. It will be automatically hidden on athenacenter.ng
              </p>
            </div>

            {/* Backend Status Alert */}
            <BackendStatus />

            <div className="w-full space-y-12">
              {/* Newsletter Management Section */}
              <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Newsletter Management</h2>
                  <p className="text-gray-600 mt-2">Manage subscribers and send newsletters about new election analysis</p>
                </div>
                <NewsletterAdmin />
              </section>

              <Separator />

              {/* Future Admin Sections - Placeholder */}
              <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <BlogPostAdmin />
              </section>

              <Separator />

              <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-500">
                <PDFResourceAdmin />
              </section>

              <Separator />

              <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Election Data Management</h2>
                  <p className="text-gray-600 mt-2">Update election results, statistics, and map data for all states</p>
                </div>
                <ElectionDataAdmin />
              </section>

              <Separator />

              <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Website Visitors Dashboard</h2>
                  <p className="text-gray-600 mt-2">Track and analyze visitor traffic, device usage, and page views</p>
                </div>
                <VisitorsAnalytics />
              </section>


            </div>
          </div>
        )}
      </div>

      {/* Footer - Appears on all tabs */}
      <Footer activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Cookie Consent Popup */}
      <CookieConsent />
    </div>
  );
}