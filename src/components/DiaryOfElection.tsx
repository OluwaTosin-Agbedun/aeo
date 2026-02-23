import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, Calendar, FileText } from 'lucide-react';
import { ElectionDetailsModal } from './ElectionDetailsModal';

interface Candidate {
  name: string;
  party: string;
  deputy?: string;
  additionalInfo?: string;
}

interface StateOverview {
  geoPolicalZone?: string;
  capital?: string;
  landmass?: string;
  lgas?: number;
  wards?: number;
  pollingUnits?: number;
}

interface ElectionTimeline {
  electionDate?: string;
  swearingInDate?: string;
}

interface IncumbentGovernor {
  name?: string;
  age?: number;
  party?: string;
}

interface EconomyData {
  overview?: string;
  keyActivities?: string[];
}

interface Election {
  id: string;
  state?: string;
  country?: string;
  region: string;
  electionType: string;
  date: string;
  status: 'upcoming' | 'completed' | 'ongoing';
  details?: string;
  description?: string;
  // Extended data for detailed briefs
  stateOverview?: StateOverview;
  electionTimeline?: ElectionTimeline;
  incumbentGovernor?: IncumbentGovernor;
  candidates?: Candidate[];
  economy?: EconomyData;
}

type TabType = 'nigeria' | 'africa' | 'other';

export const DiaryOfElection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('nigeria');
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Comprehensive 2026 election data
  const nigeriaElections: Election[] = [
    {
      id: 'ng-1',
      state: 'Ekiti State',
      region: 'Southwest',
      electionType: 'Governorship',
      date: '25-Jun-2026',
      status: 'upcoming',
      description: 'Ekiti State Governorship election scheduled for June 25, 2026. Monitoring will include all 16 LGAs with comprehensive polling unit coverage.',
      stateOverview: {
        geoPolicalZone: 'South West',
        capital: 'Ado-Ekiti',
        landmass: 'Approximately 6,353 sq. km',
        lgas: 16,
        wards: 177,
        pollingUnits: 2445
      },
      electionTimeline: {
        electionDate: '25 June 2026',
        swearingInDate: '16 October 2026'
      },
      incumbentGovernor: {
        name: 'Biodun Abayomi Oyebanji',
        age: 58,
        party: 'All Progressives Congress (APC)'
      },
      candidates: [
        {
          name: 'Biodun Abayomi Oyebanji',
          party: 'All Progressives Congress (APC)',
          deputy: 'Monisade Afuye'
        },
        {
          name: 'Olajuyin Ikusayede Gbegbe Oyebanji',
          party: 'Labour Party (LP)',
          deputy: 'Okumade Ayokunle Odumayo',
          additionalInfo: 'Legal Practitioner'
        },
        {
          name: 'Abegunde Ayobami Blessing',
          party: 'New Nigeria Peoples Party (NNPP)'
        },
        {
          name: 'Akande Oluwasegun Samuel',
          party: 'African Action Congress (AAC)',
          deputy: 'John Fajuyigbe Oluwasanmi'
        },
        {
          name: 'Bejide Oluwadare Patrick',
          party: 'African Democratic Congress (ADC)'
        },
        {
          name: 'Ojo Ayodeji',
          party: 'Action Democratic Party (ADP)'
        },
        {
          name: 'Anifowose Joseph Olanrewaju',
          party: 'Allied Peoples Movement (APM)'
        },
        {
          name: 'Awogbemi Bidemi Olaiya',
          party: 'Action Peoples Party (APP)'
        },
        {
          name: 'Ayodele Olaniyi Olanrewaju Praise',
          party: 'Peoples Redemption Party (PRP)'
        },
        {
          name: 'Osinkolu Olusegun Ayodele',
          party: 'Young Progressive Party (YPP)'
        },
        {
          name: 'Adetunji Victor Damilola',
          party: 'Zenith Labour Party (ZLP)'
        }
      ],
      economy: {
        overview: "Ekiti State's economy is predominantly agrarian. Over 75% of the population is engaged in agriculture. Agriculture contributes over 60% of the state's GDP.",
        keyActivities: [
          'Cash crops: cocoa, cashew, oil palm',
          'Food crops: yam, cassava, rice',
          'Tourism',
          'Small-scale mining (kaolin, granite)'
        ]
      }
    },
    {
      id: 'ng-2',
      state: 'Osun State',
      region: 'Southwest',
      electionType: 'Governorship',
      date: '16-Jul-2026',
      status: 'upcoming',
      description: 'Osun State Governorship election scheduled for July 16, 2026. Full electoral monitoring across 30 LGAs.',
      stateOverview: {
        geoPolicalZone: 'Southwest',
        capital: 'Osogbo',
        landmass: '9,241 km²',
        lgas: 30,
        wards: 300,
        pollingUnits: 3000
      },
      electionTimeline: {
        electionDate: '16-Jul-2026',
        swearingInDate: '01-Aug-2026'
      },
      incumbentGovernor: {
        name: 'Gboyega Oyetola',
        age: 55,
        party: 'All Progressives Congress (APC)'
      },
      candidates: [
        {
          name: 'Gboyega Oyetola',
          party: 'All Progressives Congress (APC)'
        },
        {
          name: 'Oluwatosin Ajayi',
          party: 'People\'s Democratic Party (PDP)'
        }
      ],
      economy: {
        overview: 'Osun State is known for its rich cultural heritage and tourism industry.',
        keyActivities: ['Tourism', 'Manufacturing', 'Agriculture']
      }
    }
  ];

  const africaElections: Election[] = [
    {
      id: 'af-1',
      country: 'Ghana',
      region: 'West Africa',
      electionType: 'Presidential',
      date: '07-Dec-2026',
      status: 'upcoming',
      description: 'Ghana Presidential and Parliamentary elections. Critical democratic transition with major implications for West African stability.'
    },
    {
      id: 'af-2',
      country: 'Uganda',
      region: 'East Africa',
      electionType: 'Presidential',
      date: 'Jan-2026',
      status: 'upcoming',
      description: 'Uganda Presidential election expected in early 2026. Monitoring focus on electoral transparency and civil liberties.'
    },
    {
      id: 'af-3',
      country: 'Benin',
      region: 'West Africa',
      electionType: 'Presidential',
      date: 'Mar-2026',
      status: 'upcoming',
      description: 'Benin Presidential election scheduled for March 2026. Tracking democratic processes in francophone West Africa.'
    },
    {
      id: 'af-4',
      country: 'Gabon',
      region: 'Central Africa',
      electionType: 'Presidential',
      date: 'Aug-2026',
      status: 'upcoming',
      description: 'Gabon Presidential election following 2023 coup. Critical for understanding democratic restoration in Central Africa.'
    },
    {
      id: 'af-5',
      country: 'Djibouti',
      region: 'East Africa',
      electionType: 'Presidential',
      date: 'Apr-2026',
      status: 'upcoming',
      description: 'Djibouti Presidential election with geopolitical significance for Horn of Africa stability.'
    },
    {
      id: 'af-6',
      country: 'Comoros',
      region: 'East Africa',
      electionType: 'Presidential',
      date: 'Mar-2026',
      status: 'upcoming',
      description: 'Comoros Presidential election under unique rotating presidency system.'
    },
    {
      id: 'af-7',
      country: 'São Tomé and Príncipe',
      region: 'Central Africa',
      electionType: 'Presidential',
      date: 'Jul-2026',
      status: 'upcoming',
      description: 'São Tomé and Príncipe Presidential election in one of Africa\'s smallest democracies.'
    },
    {
      id: 'af-8',
      country: 'Chad',
      region: 'Central Africa',
      electionType: 'Parliamentary',
      date: 'Dec-2026',
      status: 'upcoming',
      description: 'Chad Parliamentary elections following democratic transition after military rule.'
    },
    {
      id: 'af-9',
      country: 'Mauritania',
      region: 'West Africa',
      electionType: 'Parliamentary',
      date: 'May-2026',
      status: 'upcoming',
      description: 'Mauritania Parliamentary elections monitoring democratic consolidation in the Sahel.'
    }
  ];

  const otherCountriesElections: Election[] = [
    {
      id: 'ot-1',
      country: 'United States',
      region: 'North America',
      electionType: 'Midterm Elections',
      date: '03-Nov-2026',
      status: 'upcoming',
      description: 'US Midterm elections for all 435 House seats, 34 Senate seats, and 36 governorships. Major implications for global democracy.'
    },
    {
      id: 'ot-2',
      country: 'Brazil',
      region: 'South America',
      electionType: 'State Elections',
      date: 'Oct-2026',
      status: 'upcoming',
      description: 'Brazil state-level gubernatorial and legislative elections across all 26 states and Federal District.'
    },
    {
      id: 'ot-3',
      country: 'Philippines',
      region: 'Southeast Asia',
      electionType: 'Midterm Elections',
      date: 'May-2026',
      status: 'upcoming',
      description: 'Philippines Midterm elections for Senate, House, and local positions. Key test of Marcos administration.'
    },
    {
      id: 'ot-4',
      country: 'Czech Republic',
      region: 'Europe',
      electionType: 'Parliamentary',
      date: 'Oct-2026',
      status: 'upcoming',
      description: 'Czech Republic Parliamentary elections with implications for EU dynamics and Central European politics.'
    },
    {
      id: 'ot-5',
      country: 'Taiwan',
      region: 'East Asia',
      electionType: 'Local Elections',
      date: 'Nov-2026',
      status: 'upcoming',
      description: 'Taiwan local elections with significant regional security implications amid cross-strait tensions.'
    }
  ];

  const allElections = [...nigeriaElections, ...africaElections, ...otherCountriesElections];
  const upcomingElections = allElections.filter(e => e.status === 'upcoming');
  const totalCountries = new Set([
    ...africaElections.map(e => e.country),
    ...otherCountriesElections.map(e => e.country),
    'Nigeria'
  ]).size;
  const electionsIn2026 = allElections.filter(e => e.date.includes('2026')).length;
  const electionTypes = new Set(allElections.map(e => e.electionType)).size;

  const handleElectionClick = (election: Election) => {
    setSelectedElection(election);
    setIsModalOpen(true);
  };

  const getCurrentElections = () => {
    switch (activeTab) {
      case 'nigeria':
        return nigeriaElections;
      case 'africa':
        return africaElections;
      case 'other':
        return otherCountriesElections;
      default:
        return nigeriaElections;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Stats Cards - Matching the uploaded image design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Countries Covered */}
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Countries Covered</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">{totalCountries}</p>
                <p className="text-xs text-blue-700">Africa + Other Countries</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elections in 2026 */}
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Elections in 2026</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{electionsIn2026}</p>
                <p className="text-xs text-green-700">Including Nigeria state election</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Election Types Covered */}
        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Election Types Covered</p>
                <p className="text-4xl font-bold text-purple-600 mb-1">{electionTypes}</p>
                <p className="text-xs text-purple-700">Different election categories</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Election Schedules Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">Election Schedules</h2>
        <p className="text-gray-600 text-base md:text-lg">
          Comprehensive election timelines across Nigeria, Africa, and other countries
        </p>
      </div>

      {/* Tabs Navigation - Matching uploaded image style */}
      <div className="flex justify-center mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('nigeria')}
          className={`px-6 md:px-12 py-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'nigeria'
              ? 'border-[#1e3a8a] text-[#1e3a8a]'
              : 'border-transparent text-gray-600 hover:text-[#1e3a8a]'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1e3a8a] rounded-full"></span>
            Nigeria Elections
          </span>
        </button>
        <button
          onClick={() => setActiveTab('africa')}
          className={`px-6 md:px-12 py-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'africa'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Africa Elections
          </span>
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={`px-6 md:px-12 py-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'other'
              ? 'border-cyan-500 text-cyan-600'
              : 'border-transparent text-gray-600 hover:text-cyan-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Other Countries
          </span>
        </button>
      </div>

      {/* Election Schedule Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {activeTab === 'nigeria' ? 'State/Level' : 'Country'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type of Election</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentElections().map((election, index) => (
                  <tr
                    key={election.id}
                    onClick={() => handleElectionClick(election)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${
                        election.status === 'upcoming' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {election.state || election.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{election.electionType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${
                        election.status === 'upcoming' ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>
                        {election.date}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          <strong>Note:</strong> Click on any election row to view detailed information about the electoral process, 
          monitoring coverage, and key dates. Data updated as of February 2026.
        </p>
      </div>

      {/* Election Details Modal */}
      <ElectionDetailsModal
        election={selectedElection}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};