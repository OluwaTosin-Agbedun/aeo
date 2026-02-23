import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Vote,
  Shield,
  AlertTriangle,
  Globe,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface PreElectionLandingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

export function PreElectionLanding({ activeTab, onTabChange, isAdminDomain = false }: PreElectionLandingProps) {
  return (
    <div className="min-h-screen bg-white">
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
          backgroundImage: `linear-gradient(rgba(30, 58, 95, 0.92), rgba(30, 58, 95, 0.92)), url(https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/f621/live/d6e3de20-a752-11f0-8269-d390add37b5e.png.webp)`
        }}
      >
        <div className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              2025 Presidential Election: A Test of Continuity and Democratic Credibility
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Comprehensive analysis of a pivotal presidential election
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="max-w-5xl mx-auto">
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

          <Card className="p-8 md:p-12 shadow-lg border-l-4 border-blue-600">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-6">Executive Summary</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Cameroon's 2025 presidential election, scheduled for 12 October 2025, marks a pivotal test of continuity and legitimacy for one of Africa's most enduring political systems. Under President Paul Biya's 43-year rule, the country has achieved relative stability but faces mounting questions about institutional renewal, generational change, and democratic credibility.
              </p>
              <p>
                The election unfolds amid rising public scepticism, continued insecurity in the Anglophone regions, and growing calls for reform. The Cameroon People's Democratic Movement (CPDM) retains structural dominance, while the opposition remains fragmented.
              </p>
              <p>
                If the process is managed transparently, the 2025 vote could strengthen Cameroon's regional reputation for order. If not, it risks deepening fatigue, alienation, and regional instability in Central Africa.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl text-center text-gray-900 mb-12">Election at a Glance</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Vote className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl text-gray-900 mb-2">8.01M</div>
              <div className="text-sm text-gray-600">Registered Voters</div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MapPin className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl text-gray-900 mb-2">31,653</div>
              <div className="text-sm text-gray-600">Polling Units</div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl text-gray-900 mb-2">12</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Globe className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl text-gray-900 mb-2">10</div>
              <div className="text-sm text-gray-600">Regions</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Political Context */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Political Context: Continuity and Fatigue</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                At 92 years old, President Biya remains the world's oldest sitting head of state. Since assuming power in 1982, his leadership has produced a paradox of stability and stagnation. Cameroon's introduction of multiparty politics in the 1990s did little to dilute CPDM dominance.
              </p>
              <p>
                The Anglophone conflict in the North-West and South-West regions has further strained national cohesion, with intermittent violence and voter intimidation posing persistent challenges.
              </p>
            </div>
            <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Key Takeaway:</strong> Cameroon's 2025 election is less a contest for power than a referendum on continuity. Its outcome will shape the country's political trajectory for the next decade.
              </p>
            </Card>
          </section>

          <Separator />

          {/* Institutional Framework */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Institutional Framework</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Cameroon's elections are governed by the 1996 Constitution (amended in 2008) and the Electoral Code of 2012. Elections Cameroon (ELECAM) oversees the conduct of elections, while the Constitutional Council validates results and adjudicates disputes.
              </p>
              <p>
                However, both institutions' members are appointed by the president, creating a perceived conflict of interest. Nigeria's INEC, by contrast, operates under constitutional autonomy with a two-tiered appointment process.
              </p>
            </div>
            <Card className="mt-6 p-6 bg-green-50 border-green-200">
              <p className="text-sm text-green-900">
                <strong>Key Takeaway:</strong> Cameroon's institutions emphasise stability over independence—efficient in continuity but constrained in credibility.
              </p>
            </Card>
          </section>

          <Separator />

          {/* Voter Registration */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Voter Registration and Technology</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                According to ELECAM's final roll (10 October 2025), 8,010,464 voters are registered—an increase from 7.36 million in 2023. Men represent 53.6%, women 46.4%, and youths aged 18–35 constitute 32.2% of voters.
              </p>
              <p>
                ELECAM deployed 1,000 biometric enrolment kits in 2024 to enhance accuracy. These tools improve voter verification but operate offline. Nigeria's 2023 election introduced BVAS and IReV, representing a more advanced integration of technology.
              </p>
            </div>
            <Card className="mt-6 p-6 bg-purple-50 border-purple-200">
              <p className="text-sm text-purple-900">
                <strong>Key Takeaway:</strong> Technology can enhance efficiency, but without institutional independence, it cannot guarantee credibility.
              </p>
            </Card>
          </section>

          <Separator />

          {/* Election Day Operations */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Election Day Operations</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Polling will run from 08:00 to 18:00 (GMT+1) across 31,653 polling units in ten regions. Procedures mandate voter verification, secret balloting, and public counting at polling stations.
              </p>
              <p>
                The Constitutional Council has 15 days to validate results and address petitions filed within 72 hours of the vote. While the legal framework appears robust, critics argue that administrative and judicial independence remain weak.
              </p>
            </div>
          </section>

          <Separator />

          {/* Candidates */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Candidates and Political Parties</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ELECAM has published the final list of 12 qualified candidates for the 2025 presidential election, demonstrating Cameroon's political diversity but also its chronic opposition fragmentation.
            </p>

            <div className="space-y-4">
              <Card className="p-6 border-l-4 border-blue-600">
                <h4 className="mb-2 text-gray-900">The Incumbent</h4>
                <p className="text-gray-700">
                  <strong>Paul Biya (CPDM)</strong> – President since 1982 and the world's oldest sitting head of state. His campaign centres on stability, continuity, and experience.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-green-600">
                <h4 className="mb-2 text-gray-900">Legacy Opposition</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Joshua Osih Nambangi (SDF)</strong> – Representing the Anglophone and reformist constituency.
                </p>
                <p className="text-gray-700">
                  <strong>Bello Bouba Maigari (UNDP)</strong> – Former Prime Minister and veteran politician.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-purple-600">
                <h4 className="mb-2 text-gray-900">Emerging Reformists</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Libii Li Ngue Ngue Cabral (CPNR)</strong> – Youthful candidate appealing to urban middle-class voters seeking generational change.
                </p>
                <p className="text-gray-700">
                  <strong>Matomba Serge Espoir (UPSR)</strong> – Focuses on social justice, employment, and anti-corruption.
                </p>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Key Risks */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Key Risks and Challenges</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 bg-red-50 border-red-200">
                <h4 className="mb-2 text-red-900">Security Threats</h4>
                <p className="text-sm text-red-800">
                  Persistent violence in Anglophone regions risks low turnout and disenfranchisement.
                </p>
              </Card>
              <Card className="p-6 bg-orange-50 border-orange-200">
                <h4 className="mb-2 text-orange-900">Institutional Bias</h4>
                <p className="text-sm text-orange-800">
                  Presidential appointment of ELECAM and judicial officials fuels distrust.
                </p>
              </Card>
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h4 className="mb-2 text-yellow-900">Opposition Fragmentation</h4>
                <p className="text-sm text-yellow-800">
                  Divided opposition undermines credible competition.
                </p>
              </Card>
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="mb-2 text-blue-900">Voter Apathy</h4>
                <p className="text-sm text-blue-800">
                  Particularly among youth, digital activism may not translate into turnout.
                </p>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Regional Context */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Globe className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-3xl text-gray-900">Regional Context and Observers</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                International observers from the African Union, European Union, and ECCAS are expected to monitor the polls. Civil society groups are mobilising to promote peace and participation.
              </p>
              <p>
                In the Central African context, Cameroon's performance matters. Following turbulent transitions in Chad, Gabon, and Congo, a peaceful and credible election would signal regional democratic stability.
              </p>
            </div>
          </section>

          <Separator />

          {/* Outlook Scenarios */}
          <section>
            <h2 className="text-3xl text-gray-900 mb-8 text-center">Outlook and Scenarios</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h4 className="mb-3 text-gray-900">Scenario 1: Managed Continuity</h4>
                <p className="text-sm text-gray-600">
                  A peaceful but predictable outcome sustaining Biya's leadership or party dominance. Maintains stability but deepens generational frustration.
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h4 className="mb-3 text-gray-900">Scenario 2: Disputed Transition</h4>
                <p className="text-sm text-gray-600">
                  Localised unrest or opposition rejection of results, mitigated by limited international pressure.
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h4 className="mb-3 text-gray-900">Scenario 3: Gradual Reform</h4>
                <p className="text-sm text-gray-600">
                  Incremental shifts within the CPDM framework, opening space for younger technocrats and modest institutional reforms.
                </p>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 md:p-12 border border-green-200">
            <h2 className="text-3xl text-gray-900 mb-6">Conclusion</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Cameroon's 2025 presidential election encapsulates the broader challenge facing mature but stagnant African democracies: how to modernise without destabilising, and how to renew institutions without rupturing continuity.
              </p>
              <p>
                By comparing Cameroon's trajectory with Nigeria's evolving electoral system, a clear insight emerges: technology and legal frameworks matter, but institutional trust determines legitimacy.
              </p>
              <p>
                The 2025 polls will therefore test not just the machinery of Elections Cameroon, but the faith of citizens in a system long sustained by predictability.
              </p>
            </div>
          </section>

          {/* About AEO */}
          <Card className="p-8 md:p-12 bg-blue-50 border-blue-200">
            <h3 className="text-2xl text-blue-900 mb-4">About the Athena Election Observatory (AEO)</h3>
            <p className="text-lg text-blue-800 leading-relaxed">
              The Athena Election Observatory, an initiative of the Athena Centre for Policy and Leadership (Nigeria), 
              monitors and analyses elections across Africa to promote data-driven insights, institutional accountability, 
              and credible democratic processes.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}