import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Vote,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  BarChart3,
  Search,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface OndoStateLandingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

// LGA Data - same as in OndoStateDetailPanel
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

// Helper functions
const formatNumber = (numStr: string) => {
  const num = numStr.replace(/,/g, '');
  return new Intl.NumberFormat('en-US').format(parseInt(num));
};

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

const getPartyColor = (party: string) => {
  switch (party) {
    case 'APC': return 'bg-green-100 text-green-800 border-green-300';
    case 'PDP': return 'bg-red-100 text-red-800 border-red-300';
    case 'LP': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'ADC': return 'bg-blue-100 text-blue-800 border-blue-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Calculate overall statistics
const calculateOverallStats = () => {
  let totalAccredited = 0;
  let totalBVAS = 0;
  let totalValid = 0;
  let totalCast = 0;
  const partyTotals: Record<string, { votes: number; candidate: string }> = {};

  lgaData.forEach(lga => {
    totalAccredited += parseInt(lga.ec8aAccreditedVoters.replace(/,/g, ''));
    totalBVAS += parseInt(lga.totalBVAS.replace(/,/g, ''));
    totalValid += parseInt(lga.validVotes.replace(/,/g, ''));
    totalCast += parseInt(lga.votesCast.replace(/,/g, ''));

    const parties = parseLeadingParties(lga.leadingParties);
    parties.forEach(party => {
      if (party) {
        if (!partyTotals[party.party]) {
          partyTotals[party.party] = { votes: 0, candidate: party.name };
        }
        partyTotals[party.party].votes += parseInt(party.votes.replace(/,/g, ''));
      }
    });
  });

  const sortedParties = Object.entries(partyTotals)
    .map(([party, data]) => ({
      party,
      candidate: data.candidate,
      votes: data.votes,
      percentage: ((data.votes / totalValid) * 100).toFixed(2)
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    totalAccredited,
    totalBVAS,
    totalValid,
    totalCast,
    turnoutRate: ((totalCast / totalAccredited) * 100).toFixed(2),
    parties: sortedParties,
    totalLGAs: lgaData.length
  };
};

export function OndoStateLanding({ activeTab, onTabChange, isAdminDomain = false }: OndoStateLandingProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const stats = calculateOverallStats();

  const filteredData = lgaData.filter(item =>
    item.lga.toLowerCase().includes(searchFilter.toLowerCase())
  );

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

      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white bg-cover bg-center w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 95, 0.92), rgba(30, 58, 95, 0.92)), url(https://images.unsplash.com/photo-1495580847835-bd0c3fd5a33f?w=1200)`
        }}
      >
        <div className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-sm">Ondo State Governorship Election 2024</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Ondo State: Complete Election Breakdown
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Comprehensive LGA-by-LGA analysis of the 2024 governorship election results
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => {
              window.history.pushState({}, '', '/aeo/aeo-updates#latest-insights');
              onTabChange('aeo-updates');
              // Scroll to Latest Insights section after tab renders
              setTimeout(() => {
                const element = document.getElementById('latest-insights');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
            }}
            variant="ghost"
            className="group mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Latest Insights
          </Button>

          {/* Executive Summary */}
          <Card className="p-8 md:p-12 shadow-lg border-l-4 border-blue-600 mb-12">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-6">Election Overview</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                The Ondo State Governorship Election 2024 was conducted across {stats.totalLGAs} Local Government Areas, with comprehensive tracking of voter accreditation, BVAS deployment, and vote tallying processes.
              </p>
              <p>
                The election recorded a total of <strong>{formatNumber(String(stats.totalCast))}</strong> votes cast from <strong>{formatNumber(String(stats.totalAccredited))}</strong> accredited voters, representing a turnout rate of <strong>{stats.turnoutRate}%</strong>.
              </p>
              <p>
                Results show a clear victory for {stats.parties[0].candidate} ({stats.parties[0].party}) with {stats.parties[0].percentage}% of valid votes, demonstrating strong electoral support across the state.
              </p>
            </div>
          </Card>

          {/* Key State Statistics */}
          <div className="mb-12">
            <h2 className="text-3xl text-gray-900 mb-8 text-center">Ondo State Election at a Glance</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <Vote className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl text-gray-900 mb-2">{formatNumber(String(stats.totalAccredited))}</div>
                <div className="text-sm text-gray-600">Accredited Voters</div>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-l-4 border-green-500">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-3xl text-gray-900 mb-2">{formatNumber(String(stats.totalCast))}</div>
                <div className="text-sm text-gray-600">Total Votes Cast</div>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl text-gray-900 mb-2">{stats.turnoutRate}%</div>
                <div className="text-sm text-gray-600">Voter Turnout</div>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl text-gray-900 mb-2">{stats.totalLGAs}</div>
                <div className="text-sm text-gray-600">Local Governments</div>
              </Card>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Final Results by Party */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Final Results by Party</h2>
            </div>
            <div className="space-y-4">
              {stats.parties.map((party, idx) => (
                <Card key={idx} className={`p-6 border-l-4 ${
                  idx === 0 ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                        <span className="text-xl">{idx + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl text-gray-900">{party.candidate}</h3>
                          <Badge className={getPartyColor(party.party)}>
                            {party.party}
                          </Badge>
                          {idx === 0 && (
                            <Badge className="bg-green-600 text-white">
                              WINNER
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{formatNumber(String(party.votes))} votes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl text-gray-900">{party.percentage}%</div>
                      <div className="text-sm text-gray-600">of valid votes</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-12" />

          {/* LGA-by-LGA Breakdown */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-3xl text-gray-900">LGA-by-LGA Detailed Results</h2>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by LGA name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

            {/* LGA Cards */}
            <div className="space-y-6">
              {filteredData.map((lga, index) => {
                const parties = parseLeadingParties(lga.leadingParties);
                const voterTurnout = ((parseInt(lga.votesCast.replace(/,/g, '')) / parseInt(lga.ec8aAccreditedVoters.replace(/,/g, ''))) * 100);
                const marginOfVictory = parties[0] && parties[1] ? 
                  (parseFloat(parties[0].percentage) - parseFloat(parties[1].percentage)) : 
                  parseFloat(parties[0]?.percentage || '0');

                return (
                  <Card key={lga.lga} className="overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl text-gray-900">{lga.lga}</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          LGA #{index + 1}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block text-xs uppercase">Votes Cast</span>
                          <span className="text-blue-700 text-base">{formatNumber(lga.votesCast)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block text-xs uppercase">Valid Votes</span>
                          <span className="text-green-700 text-base">{formatNumber(lga.validVotes)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block text-xs uppercase">Turnout</span>
                          <span className="text-purple-700 text-base">{voterTurnout.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block text-xs uppercase">Victory Margin</span>
                          <span className="text-orange-700 text-base">{marginOfVictory.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column - Metrics */}
                        <div>
                          <h4 className="text-sm text-gray-600 uppercase mb-3">Election Metrics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">EC8A Accredited Voters:</span>
                              <span className="text-gray-900">{formatNumber(lga.ec8aAccreditedVoters)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm text-gray-700">Total BVAS:</span>
                              <span className="text-gray-900">{formatNumber(lga.totalBVAS)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-sm text-gray-700">Valid Votes:</span>
                              <span className="text-gray-900">{formatNumber(lga.validVotes)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                              <span className="text-sm text-gray-700">Votes Cast:</span>
                              <span className="text-gray-900">{formatNumber(lga.votesCast)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Results */}
                        <div>
                          <h4 className="text-sm text-gray-600 uppercase mb-3">Candidate Results</h4>
                          <div className="space-y-3">
                            {parties.map((party, idx) => (
                              <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                                idx === 0 ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-white px-2 py-1 rounded-full">{idx + 1}</span>
                                    <Badge className={`${getPartyColor(party.party)} text-xs`}>
                                      {party.party}
                                    </Badge>
                                  </div>
                                  <span className="text-lg text-gray-900">{party.percentage}%</span>
                                </div>
                                <div className="text-sm text-gray-700">{party.name}</div>
                                <div className="text-xs text-gray-600 mt-1">{formatNumber(party.votes)} votes</div>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Notes */}
                          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs text-yellow-700 uppercase mb-1">Tracking Note</div>
                                <div className="text-sm text-yellow-900">{lga.trackingNotes}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredData.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No LGAs found matching "{searchFilter}"</p>
              </Card>
            )}
          </div>

          {/* About Section */}
          <Card className="p-8 md:p-12 bg-blue-50 border-blue-200">
            <h3 className="text-2xl text-blue-900 mb-4">About the Athena Election Observatory (AEO)</h3>
            <p className="text-lg text-blue-800 leading-relaxed">
              The Athena Election Observatory, an initiative of the Athena Centre for Policy and Leadership (Nigeria), 
              monitors and analyses elections across Nigeria and Africa to promote data-driven insights, institutional accountability, 
              and credible democratic processes. This Ondo State election breakdown represents our commitment to transparency 
              and comprehensive electoral monitoring.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}