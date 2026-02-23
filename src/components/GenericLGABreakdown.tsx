import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MobileNav } from './MobileNav';
import { Search, ChevronDown, ChevronUp, ArrowLeft, Settings } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LGAData {
  lga: string;
  ec8aAccreditedVoters: string;
  totalBVAS: string;
  validVotes: string;
  votesCast: string;
  leadingParties: string;
  trackingNotes: string;
}

interface GenericLGABreakdownProps {
  stateName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

const formatNumber = (numStr: string) => {
  const num = numStr.replace(/,/g, '');
  return new Intl.NumberFormat('en-US').format(parseInt(num));
};

const parseLeadingParties = (partiesStr: string) => {
  return partiesStr.split(/\s+\d+\.\s/).filter(party => party.trim()).map(party => {
    const match = party.match(/^(.+?)\s\((\w+)\):\s([\d,]+)\s\(([\d.]+)%\)/);
    if (match) {
      const [, name, partyAbbr, votes, percentage] = match;
      return { name: name.trim(), party: partyAbbr.trim(), votes, percentage };
    }
    return null;
  }).filter(Boolean);
};

const getPartyColor = (party: string) => {
  switch (party) {
    case 'APC': return 'bg-green-100 text-green-800 border-green-300';
    case 'PDP': return 'bg-red-100 text-red-800 border-red-300';
    case 'LP': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'ADC': return 'bg-blue-100 text-blue-800 border-blue-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export function GenericLGABreakdown({ stateName, activeTab, onTabChange, isAdminDomain = false }: GenericLGABreakdownProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [lgaDataState, setLgaDataState] = useState<LGAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLGAData();
  }, [stateName]);

  const loadLGAData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/${stateName}/lgas`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.lgas && data.lgas.length > 0) {
          setLgaDataState(data.lgas);
        } else {
          // No data available for this state
          setLgaDataState([]);
          setError(`No LGA data available for ${stateName} yet.`);
        }
      } else {
        setLgaDataState([]);
        setError(`No LGA data available for ${stateName} yet.`);
      }
    } catch (error) {
      console.error('Error loading LGA data:', error);
      setLgaDataState([]);
      setError(`Unable to load LGA data for ${stateName}.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = lgaDataState.filter(item =>
    item.lga.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const toggleCard = (lga: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [lga]: !prev[lga]
    }));
  };

  const handleGoBack = () => {
    onTabChange('dashboard');
  };

  return (
    <div className="bg-white">
      {/* Navigation Header */}
      <header className="bg-[#1e3a5f] border-b border-white/10">
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
                onClick={() => onTabChange('about')}
                className={`px-3 md:px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                About
              </button>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 md:px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onTabChange('diary')}
                className={`px-2 md:px-3 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 text-white text-[10px] md:text-xs lg:text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'diary'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Diary of Election
              </button>
              <button
                onClick={() => onTabChange('aeo-updates')}
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
                  onClick={() => onTabChange('admin')}
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
                onTabChange={onTabChange}
                isAdminDomain={isAdminDomain}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Page Title & Search Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-gray-900 font-bold text-lg">{stateName} State LGA Breakdown</h1>
              <p className="text-gray-600 text-xs">Detailed election results by Local Government Area</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by LGA name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10 bg-white/90"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading LGA data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No LGAs found matching "{searchFilter}"</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const parties = parseLeadingParties(item.leadingParties);
            
            return (
              <div 
                key={item.lga} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleCard(item.lga)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm mb-1">
                      {item.lga}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatNumber(item.votesCast)} votes cast
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {expandedCards[item.lga] ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {expandedCards[item.lga] && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-3 pt-3">
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block mb-1">EC8A Accredited:</span>
                          <span className="font-bold text-gray-900">{formatNumber(item.ec8aAccreditedVoters)}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block mb-1">Total BVAS:</span>
                          <span className="font-bold text-gray-900">{formatNumber(item.totalBVAS)}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block mb-1">Valid Votes:</span>
                          <span className="font-bold text-gray-900">{formatNumber(item.validVotes)}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block mb-1">Votes Cast:</span>
                          <span className="font-bold text-gray-900">{formatNumber(item.votesCast)}</span>
                        </div>
                      </div>
                      
                      {/* Leading Parties */}
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-gray-600 text-xs font-medium block mb-2">Leading Parties:</span>
                        <div className="space-y-2">
                          {parties.map((party, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs px-2 py-0.5 ${getPartyColor(party.party)}`}>
                                  {party.party}
                                </Badge>
                                <span className="text-gray-700">{party.name}</span>
                              </div>
                              <span className="font-bold text-gray-900">{party.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tracking Notes */}
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <span className="text-blue-900 text-xs font-medium block mb-1">Tracking Notes:</span>
                        <p className="text-blue-800 text-xs">{item.trackingNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
