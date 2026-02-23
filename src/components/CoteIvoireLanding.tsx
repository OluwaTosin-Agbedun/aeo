import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { 
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Shield,
  FileText,
  Users,
  Globe,
  TrendingUp,
  Eye,
  CheckCircle2,
  XCircle,
  Vote,
  Scale,
  Info,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface CoteIvoireLandingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

export function CoteIvoireLanding({ activeTab, onTabChange, isAdminDomain = false }: CoteIvoireLandingProps) {
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
        className="relative bg-gradient-to-br from-orange-600 via-green-600 to-orange-700 text-white bg-cover bg-center w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(242, 109, 33, 0.88), rgba(0, 153, 80, 0.88)), url(https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/366c/live/73a618e0-8da9-11f0-a306-c7044329a9c6.jpg.webp)`
        }}
      >
        <div className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Côte d'Ivoire 2025: Stability Without Renewal - How continuity and control define the Ivorian electoral landscape
            </h1>
            <div className="flex items-center justify-center gap-4 text-orange-100 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>25 October 2025</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-orange-100 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Presidential Election</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-12">
          {/* Back Button */}
          <Button
            onClick={() => onTabChange('dashboard')}
            variant="ghost"
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>

          {/* Executive Summary */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-3xl">Executive Summary</h2>
            </div>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg space-y-4">
              <p className="text-lg leading-relaxed text-gray-800">
                Côte d'Ivoire's presidential election on 25 October 2025 will test whether stability built over a decade can coexist with genuine democratic renewal.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                President Alassane Ouattara of the Rassemblement des Houphouëtistes pour la Démocratie et la Paix (RHDP) seeks a fourth term, claiming the 2016 constitutional reform reset term limits.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                Only five candidates were cleared by the Constitutional Council, which disqualified leading opposition figures Laurent Gbagbo and Tidjane Thiam on legal and nationality grounds. The outcome will likely extend RHDP dominance, reinforcing procedural stability but deepening perceptions of democratic fatigue.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <div className="text-3xl text-orange-600 mb-2">8.73M</div>
                <div className="text-sm text-gray-600">Registered Voters</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="text-3xl text-green-600 mb-2">5</div>
                <div className="text-sm text-gray-600">Qualified Candidates</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <div className="text-3xl text-blue-600 mb-2">52.86%</div>
                <div className="text-sm text-gray-600">2015 Voter Turnout</div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Political Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl">1. Political Context: Continuity and Fatigue</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Côte d'Ivoire's political landscape in 2025 reflects a nation seeking stability after decades of turbulence yet still burdened by the weight of its past. Since the return to multi-party democracy in 1990, elections have been frequent but rarely free from tension or controversy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Independent Electoral Commission (Commission Électorale Indépendante, CEI) manages the process, while the Constitutional Council validates results and candidate eligibility. In practice, however, both institutions operate within a political environment shaped by strong executive influence and limited checks on presidential power.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In the year 2000, Laurent Gbagbo won the presidential election after Alassane Ouattara of the Rally of the Republicans (RDR) and former president Henri Konan Bédié of the Democratic Party of Côte d'Ivoire (PDCI) were disqualified on grounds of ineligibility. By 2005, a coalition of the main opposition parties, known as the Rally of Houphouëtists for Democracy and Peace (RHDP), was formed to challenge President Gbagbo in the presidential election.
              </p>
              <p className="text-gray-700 leading-relaxed">
                However, in 2018, tensions emerged within the alliance when President Ouattara sought to transform the RHDP into a single unified political party. Bédié rejected the idea of dissolving the PDCI into the RHDP, leading to the party's formal withdrawal and reestablishment as a major opposition force, effectively ending a decade-long alliance.
              </p>
              
              <Card className="bg-orange-50 border-orange-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-orange-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      Procedural stability coexists with democratic fatigue; the system sustains continuity while constraining renewal.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Institutional Framework */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl">2. Institutional Framework</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Côte d'Ivoire's electoral institutions remain stable but not fully independent. The country's core electoral institutions, notably the Commission Électorale Indépendante (CEI) and the Conseil Constitutionnel, are designed to ensure transparency, order, and legal oversight during elections.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The CEI manages operations, and the Constitutional Council validates candidacies, results and resolving electoral dispute. In September 2025, the Council approved five of over 60 applications, citing constitutional compliance but fuelling perceptions of selective inclusion.
              </p>
              <p className="text-gray-700 leading-relaxed">
                While these institutions maintain order and predictability that reassure investors, they remain institutionally dependent on the presidency and RHDP networks.
              </p>
              
              <Card className="bg-green-50 border-green-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      Côte d'Ivoire's institutions provide stability and order, yet limited autonomy continues to weaken democratic depth.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Voter Registration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Vote className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl">3. Voter Registration and Technology</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The final voter roll (June 2025) lists 8.73 million voters, up from 7.9 million in 2020. A nationwide biometric update (Oct–Nov 2024) improved accuracy but suffered regional disparities. The CEI extended voter-card collection to 22 October due to logistics in rural zones.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Côte d'Ivoire's process remains partly manual. Unlike Nigeria's BVAS & IReV systems, results are still collated on paper and transmitted physically, limiting transparency.
              </p>
              
              <Card className="bg-purple-50 border-purple-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-purple-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      Biometric registration has improved inclusion, but manual result management continues to undermine confidence.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Election Day Operations */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl">4. Election Day Operations</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Date</span>
                </div>
                <p className="text-2xl">25 October 2025</p>
              </Card>
              
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Polling Stations</span>
                </div>
                <p className="text-2xl">11,835 units</p>
              </Card>
              
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Hours</span>
                </div>
                <p className="text-2xl">08:00 – 18:00 GMT</p>
              </Card>
              
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">Result Forms</span>
                </div>
                <p className="text-2xl">Manual collation</p>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Candidates */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-3xl">5. Candidates and Political Parties</h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Ruling Party</h3>
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-lg text-gray-900">Alassane Ouattara (RHDP)</p>
                    <p className="text-gray-600">Incumbent; campaigns on stability and infrastructure gains</p>
                  </div>
                </div>
              </Card>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">Opposition / Independent</h3>
              <div className="space-y-3">
                <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Jean-Louis Billon</p>
                      <p className="text-gray-600">Businessman; focuses on private-sector dynamism</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Simone Ehivet Gbagbo (MGC)</p>
                      <p className="text-gray-600">Former First Lady; advocates reconciliation and social justice</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Ahoua Don Mello</p>
                      <p className="text-gray-600">Former minister under Gbagbo; calls for resource nationalism</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Henriette Lagou Adjoua</p>
                      <p className="text-gray-600">Veteran female politician; emphasises women's leadership</p>
                    </div>
                  </div>
                </Card>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">Disqualified</h3>
              <div className="space-y-3">
                <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-200">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Laurent Gbagbo (PPA-CI)</p>
                      <p className="text-gray-600">Barred for unresolved 2011 conviction</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-200">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Tidjane Thiam (PDCI-RDA)</p>
                      <p className="text-gray-600">Excluded for alleged dual nationality</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="bg-orange-50 border-orange-200 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-orange-900 mb-2">Key Takeaway</p>
                  <p className="text-gray-700">
                    Political diversity without genuine balance of power; RHDP dominance and fragmented opposition restrict meaningful choice.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <Separator />

          {/* Key Risks */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl">6. Key Risks and Challenges</h2>
            </div>
            
            <div className="space-y-3">
              <Card className="p-6 border-l-4 border-red-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Institutional Dependence</h3>
                    <p className="text-gray-600">CEI & Council perceived as pro-executive</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium whitespace-nowrap">
                    High
                  </span>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-red-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Opposition Fragmentation</h3>
                    <p className="text-gray-600">Divisions weaken joint strategy</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium whitespace-nowrap">
                    High
                  </span>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Voter Apathy</h3>
                    <p className="text-gray-600">Youth disengagement; 52% under 35 express "little interest"</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap">
                    Medium–High
                  </span>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-yellow-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Disinformation</h3>
                    <p className="text-gray-600">Online rumours on dual nationality, ethnic bias</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium whitespace-nowrap">
                    Medium
                  </span>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Collation</h3>
                    <p className="text-gray-600">Paper results prone to delay/dispute</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap">
                    Medium–High
                  </span>
                </div>
              </Card>
            </div>

            <Card className="bg-red-50 border-red-200 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-red-900 mb-2">Key Takeaway</p>
                  <p className="text-gray-700">
                    Credibility risks arise less from insecurity than from institutional imbalance, apathy, and limited transparency.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <Separator />

          {/* Regional Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl">7. Regional Context and Observers</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Observer missions from AU, ECOWAS, EU, WANEP-CI, and the Platform for Civil Society Elections Watch will monitor the vote.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In a region shaken by coups in Mali, Burkina Faso, and Niger, Côte d'Ivoire's election carries symbolic weight: a peaceful, constitutional process could reaffirm democratic continuity on the West African coast.
              </p>
              
              <Card className="bg-blue-50 border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      Côte d'Ivoire's conduct of the 2025 election will signal whether democratic stability can coexist with entrenched incumbency.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Outlook and Scenarios */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl">8. Outlook and Scenarios</h2>
            </div>
            
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-xl text-gray-900">Scenario 1: Managed Continuity</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                    70%
                  </span>
                </div>
                <p className="text-gray-700">
                  Ouattara wins comfortably; stability preserved but renewal stalled.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-xl text-gray-900">Scenario 2: Disputed Transition</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium whitespace-nowrap">
                    20%
                  </span>
                </div>
                <p className="text-gray-700">
                  Opposition challenges results; isolated unrest contained by security forces.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-xl text-gray-900">Scenario 3: Controlled Renewal</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                    10%
                  </span>
                </div>
                <p className="text-gray-700">
                  RHDP reshuffle introduces technocrats and modest reforms.
                </p>
              </Card>
            </div>

            <Card className="bg-purple-50 border-purple-200 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900 mb-2">Key Takeaway</p>
                  <p className="text-gray-700">
                    Post-election stability is likely, but without structural reform, political fatigue will deepen.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <Separator />

          {/* Conclusion */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Scale className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl">9. Conclusion</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Côte d'Ivoire's 2025 presidential poll showcases both administrative progress and democratic limits. The CEI's logistical improvements have enhanced voter inclusion, yet credibility hinges on transparent result management and institutional autonomy.
              </p>
              
              <Card className="bg-gradient-to-br from-orange-50 to-green-50 border-orange-200 p-8">
                <h3 className="font-semibold text-xl text-gray-900 mb-4">To consolidate democratic gains, Côte d'Ivoire should:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Digitise Result Transmission:</span>
                      <span className="text-gray-700"> pilot electronic collation to reduce disputes.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Strengthen CEI Autonomy:</span>
                      <span className="text-gray-700"> revise appointment process for balanced representation.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Audit the Voter Register:</span>
                      <span className="text-gray-700"> independent verification before 2030 cycle.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Expand Youth Engagement:</span>
                      <span className="text-gray-700"> civic education and digital fact-checking initiatives.</span>
                    </div>
                  </li>
                </ul>
              </Card>

              <p className="text-xl text-gray-900 leading-relaxed italic text-center py-6">
                Côte d'Ivoire has mastered electoral management; its next challenge is to master electoral trust.
              </p>
            </div>
          </section>

          {/* About AEO */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-xl text-gray-900 mb-2">About the Athena Election Observatory (AEO)</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Athena Election Observatory, an initiative of the Athena Centre for Policy and Leadership (Nigeria), monitors and analyses elections across Africa to promote data-driven insights, institutional accountability, and credible democratic processes.
                </p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          {/* Buttons removed as requested */}
        </div>
      </div>

      {/* Footer */}
      <Footer activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}