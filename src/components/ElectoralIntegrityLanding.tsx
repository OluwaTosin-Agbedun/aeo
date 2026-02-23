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
  Info,
  Vote,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface ElectoralIntegrityLandingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

export function ElectoralIntegrityLanding({ activeTab, onTabChange, isAdminDomain = false }: ElectoralIntegrityLandingProps) {
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
          backgroundImage: `linear-gradient(rgba(30, 58, 95, 0.88), rgba(30, 58, 95, 0.88)), url(https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/f621/live/d6e3de20-a752-11f0-8269-d390add37b5e.png.webp)`
        }}
      >
        <div className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Cameroon 2025: When Citizens Can't See the Process - A Test of Democratic Resilience and Electoral Transparency
            </h1>
            <div className="flex items-center justify-center gap-4 text-blue-100 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>October 2025</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-blue-100 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Post-Election Update</span>
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
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Latest Insights
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
                Cameroon's 2025 presidential election has entered a tense post-voting phase marked by claims of victory, institutional silence, and mounting uncertainty.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                On 14 October 2025, opposition leader Issa Tchiroma Bakary announced that he had won the 12 October polls, urging President Paul Biya to concede. In a video widely circulated online, Tchiroma pledged to release regional results reportedly drawn from polling-station tallies, positioning himself as the legitimate winner.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                As of this update, Elections Cameroon (ELECAM) and the Constitutional Council have not announced any official results. Tchiroma's declaration has sparked widespread debate across traditional and social media, drawing both support and skepticism.
              </p>
            </div>
          </section>

          <Separator />

          {/* Background Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl">1. Background Context</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Cameroon's 2025 presidential election took place under the weight of a four-decade political order. President Paul Biya, in power since 1982, remains one of Africa's longest-serving leaders.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Over the years, limited alternation of power, weak opposition structures, and deep public skepticism toward electoral institutions have shaped the political environment. This year's vote followed similar patterns — a dominant ruling party, divided opposition, and persistent concerns over voter registration and electoral transparency.
              </p>
              
              <Card className="bg-blue-50 border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      Cameroon's electoral environment remains highly constrained, with limited checks on executive power and weak institutional independence.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Post-Election Situation */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl">2. Post-Election Situation</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Voting took place on 12 October 2025 in a largely calm atmosphere, with only isolated reports of disturbances away from polling stations. Seventy-two hours after polls closed, opposition candidate Issa Tchiroma Bakary declared himself winner, citing his campaign's internal collation of polling-station results.
              </p>
              <p className="text-gray-700 leading-relaxed">
                As of now, neither ELECAM nor the Constitutional Council has made an official statement. Under Cameroonian law, only the Constitutional Council is empowered to proclaim final results, which must be announced within 15 days of the close of polls.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Minister of Territorial Administration, Paul Atanga Nji, has warned that premature declarations of victory or publication of parallel results are violations of electoral law and constitute acts of high treason.
              </p>
              
              <Card className="bg-green-50 border-green-200 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Key Takeaway</p>
                    <p className="text-gray-700">
                      The 15-day result window, though legal, appears excessively long when political parties claim to have tabulated results within 48 hours. The government's strong stance against parallel collation highlights a restrictive democratic environment where transparency is tightly controlled.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Transparency and Public Trust */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl">3. Transparency and Public Trust</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The post-election scenario illustrates Cameroon's ongoing struggle between procedural legality and public trust — the core test of genuine democracy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Across Africa, several countries have demonstrated how transparent collation and early access to results can strengthen legitimacy:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-semibold text-gray-900">Kenya (2022)</h3>
                </div>
                <p className="text-gray-700">
                  Parallel tabulations revealed trends before official announcements, without undermining the process.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-semibold text-gray-900">Ghana (2024)</h3>
                </div>
                <p className="text-gray-700">
                  Vice President conceded defeat before official declaration, based on internal tallies.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-semibold text-gray-900">Nigeria</h3>
                </div>
                <p className="text-gray-700">
                  IReV portal publishes scanned polling-unit results in real time, enabling public verification.
                </p>
              </Card>
            </div>

            <Card className="bg-purple-50 border-purple-200 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900 mb-2">Key Takeaway</p>
                  <p className="text-gray-700">
                    Cameroon continues to lag behind in citizen engagement and independent election monitoring. The absence of public-facing result portals reinforces the perception of opacity.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <Separator />

          {/* Technology and Electoral Systems */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl">4. Technology and Electoral Systems</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Compared with other African democracies, Cameroon's electoral system remains highly centralized and paper-based, reducing transparency and public confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Nigeria</h3>
                </div>
                <p className="text-gray-700">
                  Results uploaded to INEC's IReV portal for public access
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Ghana</h3>
                </div>
                <p className="text-gray-700">
                  Pink sheets photographed and posted online for verification
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Cameroon</h3>
                </div>
                <p className="text-gray-700">
                  Manual collation with no public portal; results remain opaque
                </p>
              </Card>
            </div>

            <Card className="bg-red-50 border-red-200 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-red-900 mb-2">Key Takeaway</p>
                  <p className="text-gray-700">
                    Cameroon's resistance to adopting digital result transmission systems perpetuates opacity and limits citizens' ability to independently verify outcomes.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <Separator />

          {/* Conclusion */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-3xl">5. Conclusion</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Cameroon's 2025 presidential election exemplifies the tension between procedural stability and democratic legitimacy. While voting was largely peaceful, the post-election period has been marked by institutional silence, contested claims, and growing public frustration.
              </p>
              
              <Card className="bg-gradient-to-br from-orange-50 to-blue-50 border-blue-200 p-8">
                <h3 className="font-semibold text-xl text-gray-900 mb-4">Recommendations for Electoral Reform:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Implement Digital Result Transmission:</span>
                      <span className="text-gray-700"> Adopt real-time result portals similar to Nigeria's IReV system.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Strengthen ELECAM Independence:</span>
                      <span className="text-gray-700"> Reform appointment processes to ensure balanced representation.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Allow Citizen Observation:</span>
                      <span className="text-gray-700"> Permit civil society organizations to conduct parallel vote tabulation.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold">Reduce Result Declaration Timeline:</span>
                      <span className="text-gray-700"> Shorten the 15-day window to improve public confidence.</span>
                    </div>
                  </li>
                </ul>
              </Card>

              <p className="text-xl text-gray-900 leading-relaxed italic text-center py-6">
                Democracy thrives not only on the right to vote, but on the right to see and verify the outcome.
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
        </div>
      </div>

      {/* Footer */}
      <Footer activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
