import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';

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

interface OndoStateDetailPanelProps {
  children: React.ReactNode;
}

// Helper function to format numbers with thousands separators
const formatNumber = (numStr: string) => {
  const num = numStr.replace(/,/g, '');
  return new Intl.NumberFormat('en-US').format(parseInt(num));
};

// Helper function to parse leading parties into structured data
const parseLeadingParties = (partiesStr: string) => {
  return partiesStr.split(/\s+\d+\.\s/).filter(party => party.trim()).map(party => {
    const match = party.match(/^(.+?)\s\((\w+)\):\s([\d,]+)\s\(([\d.]+)%\)/);
    if (match) {
      const [, name, party, votes, percentage] = match;
      return { name: name.trim(), party: party.trim(), votes, percentage };
    }
    return null;
  }).filter(Boolean);
};

// Helper function to get party color
const getPartyColor = (party: string) => {
  switch (party) {
    case 'APC': return 'bg-green-100 text-green-800 border-green-300';
    case 'PDP': return 'bg-red-100 text-red-800 border-red-300';
    case 'LP': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'ADC': return 'bg-blue-100 text-blue-800 border-blue-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export function OndoStateDetailPanel({ children }: OndoStateDetailPanelProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});



  const filteredData = lgaData.filter(item =>
    item.lga.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const toggleCard = (lga: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [lga]: !prev[lga]
    }));
  };



  return (
    <>
      <div 
        className="relative inline-block cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="w-full max-w-[100vw] md:max-w-[95vw] h-[90vh] md:h-[95vh] p-0 overflow-hidden"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            borderRadius: '12px'
          }}
        >
          {/* Sticky Header */}
          <DialogHeader className="sticky top-0 z-50 bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Ondo State Detailed Election Breakdown
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Comprehensive LGA-level election results and tracking data
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Sticky Search Bar */}
          <div className="sticky top-[73px] z-40 bg-white px-5 py-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by LGA name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Content Area - Responsive Layout */}
          <div className="flex-1 overflow-auto px-6 pb-6">
            
            {/* Mobile Layout (≤767px) - Accordion Cards */}
            <div className="block md:hidden space-y-2 pt-4">
              {filteredData.map((item, index) => (
                <div 
                  key={item.lga} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                  style={{ 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    marginBottom: '8px'
                  }}
                >
                  <button
                    onClick={() => toggleCard(item.lga)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-gray-900 text-sm leading-tight" style={{ fontSize: '13px', fontFamily: 'Inter' }}>
                        {item.lga}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatNumber(item.votesCast)} votes cast
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedCards[item.lga] ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedCards[item.lga] && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="space-y-3 pt-3">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs" style={{ fontSize: '13px' }}>
                          <div>
                            <span className="text-gray-600 block">EC8A Accredited:</span>
                            <span className="font-medium text-gray-900">{formatNumber(item.ec8aAccreditedVoters)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Total BVAS:</span>
                            <span className="font-medium text-gray-900">{formatNumber(item.totalBVAS)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Valid Votes:</span>
                            <span className="font-medium text-gray-900">{formatNumber(item.validVotes)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Votes Cast:</span>
                            <span className="font-medium text-gray-900">{formatNumber(item.votesCast)}</span>
                          </div>
                        </div>
                        
                        {/* Leading Parties */}
                        <div>
                          <span className="text-gray-600 text-xs block mb-2">Leading Parties:</span>
                          <div className="space-y-1">
                            {parseLeadingParties(item.leadingParties).map((party, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs px-1.5 py-0.5 ${getPartyColor(party.party)}`}>
                                    {party.party}
                                  </Badge>
                                  <span className="text-gray-700 text-xs">{party.name}</span>
                                </div>
                                <span className="font-medium text-gray-900 text-xs">{party.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Tracking Notes */}
                        <div>
                          <span className="text-gray-600 text-xs block mb-1">Tracking Notes:</span>
                          <Badge variant="outline" className="text-xs px-2 py-1 break-words">
                            {item.trackingNotes}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tablet Layout (768-1023px) - Semi-stacked 2-column */}
            <div className="hidden md:block lg:hidden pt-4">
              <div className="space-y-3">
                {filteredData.map((item, index) => (
                  <div 
                    key={item.lga}
                    className={`grid grid-cols-2 gap-6 p-4 rounded-lg border border-gray-200 hover:bg-[#F1F5FF] transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                    }`}
                  >
                    {/* First Column: LGA + Metrics */}
                    <div className="space-y-3">
                      <div className="font-bold text-gray-900 text-sm">{item.lga}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600 block">EC8A Accredited:</span>
                          <span className="font-medium text-right">{formatNumber(item.ec8aAccreditedVoters)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Total BVAS:</span>
                          <span className="font-medium text-right">{formatNumber(item.totalBVAS)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Valid Votes:</span>
                          <span className="font-medium text-right">{formatNumber(item.validVotes)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Votes Cast:</span>
                          <span className="font-medium text-right">{formatNumber(item.votesCast)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Second Column: Leading Parties + Tracking Notes */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-xs block mb-2">Leading Parties:</span>
                        <div className="space-y-1">
                          {parseLeadingParties(item.leadingParties).map((party, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs px-1.5 py-0.5 ${getPartyColor(party.party)}`}>
                                  {party.party}
                                </Badge>
                                <span className="text-gray-700">{party.name}</span>
                              </div>
                              <span className="font-medium text-gray-900">{party.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-600 text-xs block mb-1">Tracking Notes:</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-1 break-words whitespace-normal"
                          title={item.trackingNotes}
                        >
                          {item.trackingNotes}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Layout (≥1024px) - Ultra-Wide Comprehensive Dashboard */}
            <div className="hidden lg:block pt-6">
              {/* Enhanced LGA Cards Grid */}
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                {filteredData.map((item, index) => {
                  const leadingParties = parseLeadingParties(item.leadingParties);
                  const voterTurnout = ((parseInt(item.votesCast.replace(/,/g, '')) / parseInt(item.ec8aAccreditedVoters.replace(/,/g, ''))) * 100);
                  const marginOfVictory = leadingParties[0] && leadingParties[1] ? 
                    (parseFloat(leadingParties[0].percentage) - parseFloat(leadingParties[1].percentage)) : 
                    parseFloat(leadingParties[0]?.percentage || '0');
                  
                  return (
                    <div 
                      key={item.lga}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      style={{ 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {/* Enhanced Header with Status Indicators */}
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-green-50 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-xl text-gray-900">{item.lga}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-1">
                              COMPLETED
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs px-2 py-1">
                              LGA #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Votes Cast</span>
                            <span className="font-bold text-blue-700 text-lg">{formatNumber(item.votesCast)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Valid Votes</span>
                            <span className="font-bold text-green-700 text-lg">{formatNumber(item.validVotes)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Turnout Rate</span>
                            <span className="font-bold text-purple-700 text-lg">{voterTurnout.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Victory Margin</span>
                            <span className="font-bold text-orange-700 text-lg">{marginOfVictory.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Comprehensive Content */}
                      <div className="p-8">
                        {/* Core Metrics Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">EC8A Accredited</div>
                            <div className="text-xl font-bold text-gray-900">{formatNumber(item.ec8aAccreditedVoters)}</div>
                            <div className="text-xs text-gray-600 mt-1">Registered voters</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Total BVAS</div>
                            <div className="text-xl font-bold text-blue-900">{formatNumber(item.totalBVAS)}</div>
                            <div className="text-xs text-blue-700 mt-1">BVAS machines</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                            <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Valid Votes</div>
                            <div className="text-xl font-bold text-green-900">{formatNumber(item.validVotes)}</div>
                            <div className="text-xs text-green-700 mt-1">Accepted ballots</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Total Cast</div>
                            <div className="text-xl font-bold text-purple-900">{formatNumber(item.votesCast)}</div>
                            <div className="text-xs text-purple-700 mt-1">All submissions</div>
                          </div>
                        </div>

                        {/* Leading Candidate Spotlight */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-green-900">Leading Candidate</h4>
                            <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-bold">
                              WINNER
                            </Badge>
                          </div>
                          {leadingParties[0] && (
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <div className="text-sm font-medium text-green-700 mb-1">Candidate</div>
                                <div className="font-bold text-green-900 text-lg">{leadingParties[0].name}</div>
                                <Badge className={`mt-2 ${getPartyColor(leadingParties[0].party)}`}>
                                  {leadingParties[0].party}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-green-700 mb-1">Vote Share</div>
                                <div className="font-bold text-green-900 text-2xl">{leadingParties[0].percentage}%</div>
                                <div className="text-sm text-green-700">{formatNumber(leadingParties[0].votes)} votes</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-green-700 mb-1">Margin Status</div>
                                <div className="font-bold text-green-900 text-lg">
                                  {marginOfVictory > 50 ? 'Landslide' : marginOfVictory > 20 ? 'Decisive' : marginOfVictory > 10 ? 'Clear' : 'Narrow'}
                                </div>
                                <div className="text-sm text-green-700">+{marginOfVictory.toFixed(1)}% lead</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Complete Party Results */}
                        <div className="mb-8">
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            Complete Results Breakdown
                          </h4>
                          <div className="space-y-4">
                            {leadingParties.map((party, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                                    {idx + 1}
                                  </div>
                                  <Badge className={`font-bold px-3 py-1 ${getPartyColor(party.party)}`}>
                                    {party.party}
                                  </Badge>
                                  <span className="font-medium text-gray-900">{party.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900 text-lg">{party.percentage}%</div>
                                  <div className="text-sm text-gray-600">{formatNumber(party.votes)} votes</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Data Quality & Tracking Analysis */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                            <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              Data Quality Metrics
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">BVAS Coverage:</span>
                                <span className="font-bold text-blue-900">
                                  {((parseInt(item.totalBVAS.replace(/,/g, '')) / parseInt(item.ec8aAccreditedVoters.replace(/,/g, ''))) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Vote Validity Rate:</span>
                                <span className="font-bold text-blue-900">
                                  {((parseInt(item.validVotes.replace(/,/g, '')) / parseInt(item.votesCast.replace(/,/g, ''))) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Invalid Votes:</span>
                                <span className="font-bold text-blue-900">
                                  {formatNumber((parseInt(item.votesCast.replace(/,/g, '')) - parseInt(item.validVotes.replace(/,/g, ''))).toString())}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                            <h5 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                              Election Monitoring Notes
                            </h5>
                            <p className="text-sm text-orange-800 leading-relaxed bg-white rounded-lg p-3 border border-orange-200">
                              {item.trackingNotes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Summary Footer */}
              <div className="mt-12 bg-gradient-to-r from-slate-800 via-blue-900 to-green-800 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Ondo State Election Summary</h3>
                  <p className="text-blue-100 max-w-3xl mx-auto">
                    Complete analysis of the 2024 Governorship Off-Cycle Election with comprehensive data verification and real-time monitoring across all 18 Local Government Areas.
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-6 text-center">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">18</div>
                    <div className="text-blue-100 text-sm mt-1">Local Governments</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">3,619</div>
                    <div className="text-blue-100 text-sm mt-1">Polling Units</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">555,941</div>
                    <div className="text-blue-100 text-sm mt-1">Accredited Voters</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">551,130</div>
                    <div className="text-blue-100 text-sm mt-1">Total Votes Cast</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">27.36%</div>
                    <div className="text-blue-100 text-sm mt-1">State Turnout</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">99.97%</div>
                    <div className="text-blue-100 text-sm mt-1">Upload Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Results Message */}
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No LGAs found matching "{searchFilter}"
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}