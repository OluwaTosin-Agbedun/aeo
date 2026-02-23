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

const lgaData: LGAData[] = [
  {
    lga: "AKOKO NORTH EAST",
    ec8aAccreditedVoters: "31,600",
    totalBVAS: "31,187",
    validVotes: "30,970",
    votesCast: "31,441",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 24,914 (80.45%)  2. Agboola Ajayi (PDP): 4,950 (15.98%)  3. Olorunfemi Ayodele (LP): 717 (2.32%)",
    trackingNotes: "High APC dominance; track PU completion."
  },
  {
    lga: "AKOKO NORTH WEST",
    ec8aAccreditedVoters: "30,868",
    totalBVAS: "31,007",
    validVotes: "30,682",
    votesCast: "30,993",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 24,940 (81.29%)  2. Agboola Ajayi (PDP): 5,502 (17.93%)  3. Nejo Adeyemi (ADC): 133 (0.43%)",
    trackingNotes: "BVAS slightly higher; monitor discrepancies."
  },
  {
    lga: "AKOKO SOUTH EAST",
    ec8aAccreditedVoters: "15,399",
    totalBVAS: "14,139",
    validVotes: "15,011",
    votesCast: "15,171",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 12,139 (80.87%)  2. Agboola Ajayi (PDP): 2,692 (17.93%)  3. Nejo Adeyemi (ADC): 81 (0.54%)",
    trackingNotes: "Lower BVAS; potential data gaps."
  },
  {
    lga: "AKOKO SOUTH WEST",
    ec8aAccreditedVoters: "36,420",
    totalBVAS: "35,878",
    validVotes: "35,772",
    votesCast: "36,148",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 28,185 (78.79%)  2. Agboola Ajayi (PDP): 5,339 (14.93%)  3. Olorunfemi Ayodele (LP): 1,224 (3.42%)",
    trackingNotes: "Strong turnout; track LP growth."
  },
  {
    lga: "AKURE NORTH",
    ec8aAccreditedVoters: "21,631",
    totalBVAS: "21,468",
    validVotes: "20,937",
    votesCast: "21,582",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 14,545 (69.47%)  2. Agboola Ajayi (PDP): 5,835 (27.87%)  3. Olorunfemi Ayodele (LP): 238 (1.14%)",
    trackingNotes: "Urban area; monitor opposition."
  },
  {
    lga: "AKURE SOUTH",
    ec8aAccreditedVoters: "74,762",
    totalBVAS: "54,642",
    validVotes: "72,736",
    votesCast: "73,884",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 47,823 (65.75%)  2. Agboola Ajayi (PDP): 16,766 (23.05%)  3. Olorunfemi Ayodele (LP): 4,059 (5.58%)",
    trackingNotes: "High volume; track BVAS gaps."
  },
  {
    lga: "ESE-ODO",
    ec8aAccreditedVoters: "23,413",
    totalBVAS: "23,032",
    validVotes: "22,693",
    votesCast: "23,091",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 14,617 (64.41%)  2. Agboola Ajayi (PDP): 7,814 (34.43%)  3. Nejo Adeyemi (ADC): 85 (0.37%)",
    trackingNotes: "PDP stronger here; watch closely."
  },
  {
    lga: "IDANRE",
    ec8aAccreditedVoters: "20,042",
    totalBVAS: "20,021",
    validVotes: "18,247",
    votesCast: "19,417",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 9,140 (50.09%)  2. Agboola Ajayi (PDP): 8,968 (49.15%)  3. Nejo Adeyemi (ADC): 150 (0.82%)",
    trackingNotes: "Closest race; priority for updates."
  },
  {
    lga: "IFEDORE",
    ec8aAccreditedVoters: "20,843",
    totalBVAS: "20,682",
    validVotes: "20,290",
    votesCast: "20,849",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 14,172 (69.85%)  2. Agboola Ajayi (PDP): 5,892 (29.04%)  3. Nejo Adeyemi (ADC): 174 (0.86%)",
    trackingNotes: "Stable; track minor parties."
  },
  {
    lga: "ILAJE",
    ec8aAccreditedVoters: "29,485",
    totalBVAS: "28,232",
    validVotes: "28,472",
    votesCast: "28,960",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 24,566 (86.28%)  2. Agboola Ajayi (PDP): 3,677 (12.91%)  3. Nejo Adeyemi (ADC): 253 (0.89%)",
    trackingNotes: "APC stronghold; low opposition."
  },
  {
    lga: "ILEOLUJI/OKEIGBO",
    ec8aAccreditedVoters: "23,147",
    totalBVAS: "22,170",
    validVotes: "21,578",
    votesCast: "22,116",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 16,561 (76.75%)  2. Agboola Ajayi (PDP): 4,514 (20.92%)  3. Nejo Adeyemi (ADC): 187 (0.87%)",
    trackingNotes: "Consistent; monitor turnout."
  },
  {
    lga: "IRELE",
    ec8aAccreditedVoters: "25,344",
    totalBVAS: "24,618",
    validVotes: "24,529",
    votesCast: "25,060",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 17,084 (69.65%)  2. Agboola Ajayi (PDP): 6,155 (25.09%)  3. Olorunfemi Ayodele (LP): 607 (2.47%)",
    trackingNotes: "LP presence; track increases."
  },
  {
    lga: "ODIGBO",
    ec8aAccreditedVoters: "42,280",
    totalBVAS: "38,147",
    validVotes: "41,553",
    votesCast: "42,381",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 29,004 (69.80%)  2. Agboola Ajayi (PDP): 9,566 (23.02%)  3. Olorunfemi Ayodele (LP): 1,072 (2.58%)",
    trackingNotes: "Large LGA; focus on discrepancies."
  },
  {
    lga: "OKITIPUPA",
    ec8aAccreditedVoters: "37,674",
    totalBVAS: "37,698",
    validVotes: "36,774",
    votesCast: "37,732",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 26,584 (72.29%)  2. Agboola Ajayi (PDP): 10,186 (27.70%)  3. Nejo Adeyemi (ADC): 278 (0.76%)",
    trackingNotes: "BVAS close to accredited; stable."
  },
  {
    lga: "ONDO EAST",
    ec8aAccreditedVoters: "14,369",
    totalBVAS: "13,048",
    validVotes: "14,189",
    votesCast: "14,456",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 9,642 (67.95%)  2. Agboola Ajayi (PDP): 3,022 (21.30%)  3. Olorunfemi Ayodele (LP): 465 (3.28%)",
    trackingNotes: "Lower BVAS; investigate gaps."
  },
  {
    lga: "ONDO WEST",
    ec8aAccreditedVoters: "45,248",
    totalBVAS: "31,210",
    validVotes: "44,199",
    votesCast: "44,836",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 30,071 (68.04%)  2. Agboola Ajayi (PDP): 7,650 (17.31%)  3. Olorunfemi Ayodele (LP): 3,145 (7.12%)",
    trackingNotes: "Significant BVAS gap; priority."
  },
  {
    lga: "OSE",
    ec8aAccreditedVoters: "21,459",
    totalBVAS: "20,872",
    validVotes: "21,289",
    votesCast: "21,658",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 16,555 (77.76%)  2. Agboola Ajayi (PDP): 4,472 (21.01%)  3. Nejo Adeyemi (ADC): 145 (0.68%)",
    trackingNotes: "High APC; track minor changes."
  },
  {
    lga: "OWO",
    ec8aAccreditedVoters: "41,957",
    totalBVAS: "38,273",
    validVotes: "40,200",
    votesCast: "41,355",
    leadingParties: "1. Lucky Aiyedatiwa (APC): 32,340 (80.45%)  2. Agboola Ajayi (PDP): 5,857 (14.57%)  3. Olorunfemi Ayodele (LP): 1,666 (4.14%)",
    trackingNotes: "Strong results; monitor completion."
  }
];

interface OndoLGABreakdownProps {
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

export function OndoLGABreakdown({ activeTab, onTabChange, isAdminDomain = false }: OndoLGABreakdownProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [lgaDataState, setLgaDataState] = useState<LGAData[]>(lgaData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLGAData();
  }, []);

  const loadLGAData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/Ondo/lgas`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.lgas && data.lgas.length > 0) {
          // Use backend data if available
          setLgaDataState(data.lgas);
        } else {
          // Fall back to hardcoded data
          setLgaDataState(lgaData);
        }
      } else {
        // Fall back to hardcoded data on error
        setLgaDataState(lgaData);
      }
    } catch (error) {
      console.error('Error loading LGA data:', error);
      // Fall back to hardcoded data on error
      setLgaDataState(lgaData);
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
              <h1 className="text-gray-900 font-bold text-lg">Ondo State LGA Breakdown</h1>
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