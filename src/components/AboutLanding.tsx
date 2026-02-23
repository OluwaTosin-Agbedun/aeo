import React from 'react';
import { Target, Users, FileBarChart, Lightbulb, Mail, MapPin, Shield, Eye, TrendingUp, Globe, Award, Database, BookOpen, MessageCircle, BarChart3, Briefcase, GraduationCap, FileCheck, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import heroImage from 'figma:asset/458baee4b588f524bba4f85be07600b1d9c6b3d6.png';

interface AboutLandingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

export function AboutLanding({ activeTab, onTabChange, isAdminDomain = false }: AboutLandingProps) {
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

      <div className="max-w-7xl mx-auto space-y-8 md:space-y-16 px-4 py-8 md:py-12">
      {/* Full-Width Hero Section */}
      <section 
        className="relative text-center space-y-6 py-12 md:py-16 bg-cover bg-center overflow-hidden -mx-4 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 95, 0.93), rgba(15, 29, 48, 0.95)), url(${heroImage})`
        }}
      >
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            The Athena Election Observatory
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Advancing Trust, Transparency, and Reform through Data and Research
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Executive Summary */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-3xl md:text-4xl text-white">Executive Summary</h2>
        </div>
        <div className="p-8 md:p-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The Athena Election Observatory (AEO) institutionalises the Athena Centre for Policy and Leadership's evidence-based approach to electoral governance. Conceived as Africa's first permanent, non-partisan platform for post-election research, the Observatory will advance electoral integrity through rigorous data analysis, policy innovation, and stakeholder dialogue.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Building on Athena's widely recognised post-election audits in Kogi, Imo, Bayelsa, and Edo States—acknowledged by the media and civil society for their transparency and methodological discipline—the AEO establishes a model for continuous, fact-based electoral evaluation. These audits, derived from verifiable data from the Independent National Electoral Commission (INEC) accessed via the IReV portal and Freedom of Information requests, have set a new benchmark in evidence-led electoral research in Nigeria.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            The AEO transforms these episodic reviews into a sustained institutional framework for monitoring, analysis, and reform. Through flagship reports, dialogues, and benchmarking tools, the Observatory will promote accountability, strengthen electoral systems, and support data-driven decision-making among policymakers, election administrators, and civic actors.
          </p>
        </div>
      </section>

      {/* Background & Rationale */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Background */}
        <Card className="p-8 border-t-4 border-blue-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl text-gray-900">Background</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Democracy in Africa stands at a defining juncture. Over the past three decades, the continent has made measurable progress in conducting regular elections, expanding civic participation, and establishing electoral institutions. Yet concerns about the credibility, transparency, and inclusiveness of these elections persist.
            </p>
            <p>
              Electoral management bodies, civil society organisations, and international observers have contributed to improving standards. However, the absence of sustained, data-driven, and independent post-election research continues to limit the impact of reform efforts.
            </p>
            <p>
              The Athena Election Observatory builds on this foundation. It provides an enduring institutional mechanism for rigorous, evidence-based evaluation of elections and democratic processes, anchoring electoral integrity as a central pillar of democratic development in Africa.
            </p>
          </div>
        </Card>

        {/* Rationale */}
        <Card className="p-8 border-t-4 border-green-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl text-gray-900">Rationale</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Across Africa, elections remain the cornerstone of democratic legitimacy; yet, they are frequently approached as isolated events rather than as integral elements of an ongoing democratic cycle. This event-driven perspective obscures structural weaknesses—ranging from institutional capacity and technology deployment to legal frameworks and dispute resolution mechanisms.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <p className="text-blue-900 italic">
                "There is therefore a pressing need for a sustained, independent, and empirically grounded mechanism to evaluate electoral performance, identify systemic vulnerabilities, and guide reform."
              </p>
            </div>
            <p>
              The Athena Election Observatory fills this gap. It offers a permanent platform for rigorous post-election analysis, comparative research, and strategic learning, serving as a trusted, non-partisan resource for policymakers, electoral commissions, and civil society.
            </p>
          </div>
        </Card>
      </section>

      {/* Objectives */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">Our Objectives</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Seven strategic objectives guide our work to strengthen electoral integrity across Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Objective 1 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-600 bg-gradient-to-br from-blue-50 to-white">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Independent Post-Election Reviews</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Generate verifiable, non-partisan analyses of election outcomes using transparent methodologies grounded in publicly accessible data.
            </p>
          </Card>

          {/* Objective 2 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-green-600 bg-gradient-to-br from-green-50 to-white">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Benchmarking & Evaluation Tools</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Create standardised metrics—such as the Electoral Health Scorecard—to assess the credibility and performance of electoral processes.
            </p>
          </Card>

          {/* Objective 3 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-purple-600 bg-gradient-to-br from-purple-50 to-white">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <FileBarChart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Policy & Legal Reforms</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Produce actionable recommendations that strengthen electoral frameworks, legal regimes, and institutional capacity.
            </p>
          </Card>

          {/* Objective 4 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-orange-600 bg-gradient-to-br from-orange-50 to-white">
            <div className="mx-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Dialogue & Knowledge Exchange</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Convene high-level dialogues, conferences, and technical workshops among electoral bodies and civic actors.
            </p>
          </Card>

          {/* Objective 5 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-indigo-600 bg-gradient-to-br from-indigo-50 to-white">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Comparative & Global Learning</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Build partnerships with leading global research institutions to enable comparative studies and cross-country learning.
            </p>
          </Card>

          {/* Objective 6 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-600 bg-gradient-to-br from-teal-50 to-white">
            <div className="mx-auto w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Capacity Building</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Provide training and resources for election administrators, civic organisations, and journalists to enhance data literacy.
            </p>
          </Card>

          {/* Objective 7 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-pink-600 bg-gradient-to-br from-pink-50 to-white md:col-span-2 lg:col-span-1 mx-auto lg:mx-0 max-w-md lg:max-w-none">
            <div className="mx-auto w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900 text-center">Continuous Improvement</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Encourage the view of elections as iterative processes of democratic strengthening rather than isolated events.
            </p>
          </Card>
        </div>
      </section>

      {/* Scope of Work */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">Scope of Work</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The AEO operates across the whole electoral cycle—before, during, and after elections—combining rigorous research with policy engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Scope 1 */}
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-gray-900">Post-Election Analysis</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Evaluation of election management, technology, dispute resolution, inclusivity, and transparency.
                </p>
              </div>
            </div>
          </Card>

          {/* Scope 2 */}
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-gray-900">Electoral Systems Research</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Comparative studies on representation models, constituency delimitation, electronic voting, and diaspora participation.
                </p>
              </div>
            </div>
          </Card>

          {/* Scope 3 */}
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-gray-900">Democracy Monitoring</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tracking governance indicators and freedoms linked to electoral integrity.
                </p>
              </div>
            </div>
          </Card>

          {/* Scope 4 */}
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-gray-900">Capacity Building</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Building analytical skills of officials, civil society, and media actors to interpret and use data.
                </p>
              </div>
            </div>
          </Card>

          {/* Scope 5 */}
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200 md:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-gray-900">Knowledge Dissemination</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Publishing outputs via Athena Perspectives, Policy Pulse, and Governance Insights, complemented by multimedia engagement.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Flagship Initiatives */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">Flagship Initiatives</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Three core initiatives that define our approach to electoral integrity research
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Initiative 1 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600 bg-gradient-to-br from-white to-blue-50">
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-2" />
              <h3 className="text-xl">Electoral Health Scorecard</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              A benchmarking tool assessing election quality, transparency, and inclusiveness across African states.
            </p>
          </Card>

          {/* Initiative 2 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-green-600 bg-gradient-to-br from-white to-green-50">
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-2" />
              <h3 className="text-xl">Post-Election Dialogue Series</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              A platform for stakeholders to examine findings from post-election audits and co-create reform strategies.
            </p>
          </Card>

          {/* Initiative 3 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-600 bg-gradient-to-br from-white to-purple-50">
            <div className="bg-purple-600 text-white p-4 rounded-lg mb-6 text-center">
              <Globe className="w-10 h-10 mx-auto mb-2" />
              <h3 className="text-xl">Annual State of Elections Report</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              A continental publication offering data-driven analysis of electoral trends, innovations, and challenges across Africa.
            </p>
          </Card>
        </div>
      </section>

      {/* Operational Model & Expected Outputs */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Operational Model */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-lg">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-3xl">Operational Model</h2>
          </div>
          <p className="text-blue-50 leading-relaxed mb-6">
            The AEO functions as a specialised research unit within the Athena Centre for Policy and Leadership, ensuring independence while enabling growth and regional expansion.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-200 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-white">Core Research Team</p>
                <p className="text-blue-100 text-sm">Analysts and data scientists focused on electoral systems and governance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-200 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-white">Visiting Fellows</p>
                <p className="text-blue-100 text-sm">Experts in law, statistics, and technology contributing to thematic studies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-200 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-white">Partnership Networks</p>
                <p className="text-blue-100 text-sm">Collaborations with local and international institutions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-200 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-white">Integrated Communication Platforms</p>
                <p className="text-blue-100 text-sm">Dissemination through Athena's publications and digital outlets</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Expected Outputs */}
        <Card className="p-8 bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-lg">
              <FileBarChart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl">Expected Outputs</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-50">At least three research publications annually</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-50">Post-election audit reports for general, off-cycle, and by-elections</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-50">Policy toolkits and reform briefs</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-50">Publicly accessible scorecards and benchmarking datasets</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-50">High-profile dialogues and media engagement events</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Vision Statement */}
      <section className="bg-white rounded-2xl p-8 md:p-12 border-2 border-blue-200 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
            <Target className="w-12 h-12 text-blue-600" />
          </div>
          <blockquote className="text-2xl md:text-3xl text-gray-900 leading-relaxed italic mb-6">
            "Grounded in data, driven by insight, and committed to reform, the Athena Election Observatory seeks not merely to observe elections—but to strengthen democracy itself, one insight, one reform, and one election at a time."
          </blockquote>
        </div>
      </section>

      {/* Funding Model */}
      <section className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">Funding Model</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A blended sustainability model ensuring independence and long-term impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Database className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Research Grants</h3>
            <p className="text-sm text-gray-600">
              From international development partners supporting governance and democracy initiatives
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileBarChart className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Commissioned Studies</h3>
            <p className="text-sm text-gray-600">
              Analytical and advisory projects for public institutions, NGOs, and private foundations
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="mx-auto w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Event Sponsorships</h3>
            <p className="text-sm text-gray-600">
              Support for dialogues, scorecard releases, and reports
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="mx-auto w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Institutional Support</h3>
            <p className="text-sm text-gray-600">
              From the Athena Centre's own endowment and aligned strategic programmes
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-lg">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl">Get in Touch</h2>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            For inquiries, partnerships, or more information about our work, please reach out to the 
            Athena Centre for Policy and Leadership. We welcome collaboration with researchers, civil 
            society organizations, media partners, and democratic institutions.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 text-gray-300">
              <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium mb-1">Email</p>
                <a href="mailto:info.centre@athenacentre.org" className="text-blue-300 hover:text-blue-200 transition-colors">
                  info.centre@athenacentre.org
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-300">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium mb-1">Address</p>
                <p>Block A10, Phase 2, Sani Zangon Daura estate, Kado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Footer */}
      <Footer activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}