import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Loader2,
  Globe,
  Shield,
  Users,
  AlertTriangle,
  TrendingUp,
  Vote,
  Scale,
  Eye,
  CheckCircle2,
  XCircle,
  Info,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  executiveSummary?: string;
  content: string;
  imageUrl: string;
  backgroundImageUrl?: string;
  publishDate: string;
  month: string;
  year: string;
  slug: string;
  category: string;
  author: string;
  createdAt: string;
}

interface DynamicBlogLandingProps {
  slug: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain?: boolean;
}

// Section theme configuration
const SECTION_THEMES = [
  { color: 'orange', icon: FileText, bgClass: 'bg-orange-100', iconClass: 'text-orange-600', borderClass: 'border-orange-500', cardBgClass: 'bg-orange-50 border-orange-200', textClass: 'text-orange-900' },
  { color: 'blue', icon: Users, bgClass: 'bg-blue-100', iconClass: 'text-blue-600', borderClass: 'border-blue-500', cardBgClass: 'bg-blue-50 border-blue-200', textClass: 'text-blue-900' },
  { color: 'green', icon: Shield, bgClass: 'bg-green-100', iconClass: 'text-green-600', borderClass: 'border-green-500', cardBgClass: 'bg-green-50 border-green-200', textClass: 'text-green-900' },
  { color: 'purple', icon: Vote, bgClass: 'bg-purple-100', iconClass: 'text-purple-600', borderClass: 'border-purple-500', cardBgClass: 'bg-purple-50 border-purple-200', textClass: 'text-purple-900' },
  { color: 'red', icon: AlertTriangle, bgClass: 'bg-red-100', iconClass: 'text-red-600', borderClass: 'border-red-500', cardBgClass: 'bg-red-50 border-red-200', textClass: 'text-red-900' },
  { color: 'teal', icon: TrendingUp, bgClass: 'bg-teal-100', iconClass: 'text-teal-600', borderClass: 'border-teal-500', cardBgClass: 'bg-teal-50 border-teal-200', textClass: 'text-teal-900' },
];

interface Section {
  heading: string;
  content: string;
  theme: typeof SECTION_THEMES[0];
}

// Smart auto-generation from plain content - creates beautiful sections like Côte d'Ivoire
function autoGenerateSections(html: string): Section[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: Section[] = [];
  
  // Get all elements (not just paragraphs - includes lists, blockquotes, etc.)
  const allElements = Array.from(doc.body.children);
  
  if (allElements.length === 0) {
    // Try getting all nodes including text nodes
    const textContent = doc.body.textContent?.trim();
    if (textContent) {
      // Create single section from plain text
      sections.push({
        heading: 'Article Content',
        content: `<div class="prose prose-lg max-w-none space-y-4">${textContent.split('\n\n').map(p => `<p class="text-gray-700 leading-relaxed">${p.trim()}</p>`).join('')}</div>`,
        theme: SECTION_THEMES[0]
      });
    }
    return sections;
  }
  
  // Calculate optimal section size - aim for 3-6 sections based on content length
  const targetSections = Math.min(6, Math.max(3, Math.ceil(allElements.length / 5)));
  const elementsPerSection = Math.ceil(allElements.length / targetSections);
  
  let sectionIndex = 0;
  for (let i = 0; i < allElements.length; i += elementsPerSection) {
    const sectionElements = allElements.slice(i, i + elementsPerSection);
    const theme = SECTION_THEMES[sectionIndex % SECTION_THEMES.length];
    
    // Generate smart heading from first paragraph or element
    const firstPara = sectionElements.find(el => el.textContent && el.textContent.trim().length > 20);
    const heading = firstPara 
      ? firstPara.textContent!.trim().split(/[.!?]/)[0].slice(0, 60).trim() + (firstPara.textContent!.length > 60 ? '...' : '')
      : `Section ${sectionIndex + 1}`;
    
    // Combine section content
    const content = sectionElements.map(el => el.outerHTML).join('');
    
    sections.push({
      heading,
      content,
      theme
    });
    
    sectionIndex++;
  }
  
  return sections;
}

// Parse structured content with H2 headings
function parseStructuredContent(html: string): Section[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: Section[] = [];
  
  const h2Elements = doc.querySelectorAll('h2');
  
  if (h2Elements.length === 0) {
    // No H2 headings found, use auto-generation
    return autoGenerateSections(html);
  }
  
  h2Elements.forEach((h2, index) => {
    const theme = SECTION_THEMES[index % SECTION_THEMES.length];
    const heading = h2.textContent || `Section ${index + 1}`;
    
    // Get all content until next H2
    let content = '';
    let currentElement = h2.nextElementSibling;
    
    while (currentElement && currentElement.tagName !== 'H2') {
      content += currentElement.outerHTML;
      currentElement = currentElement.nextElementSibling;
    }
    
    if (content) {
      sections.push({ heading, content, theme });
    }
  });
  
  return sections;
}

// Section Content Component - handles special formatting
function SectionContent({ content, theme }: { content: string; theme: typeof SECTION_THEMES[0] }) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const elements = Array.from(doc.body.children);
  
  return (
    <div className="space-y-6">
      {elements.map((element, index) => {
        // Special handling for blockquotes - make them stand out
        if (element.tagName === 'BLOCKQUOTE') {
          return (
            <Card key={index} className={`${theme.cardBgClass} border-l-4 ${theme.borderClass} p-6 shadow-sm`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 ${theme.bgClass} rounded-lg flex-shrink-0`}>
                  <Info className={`w-5 h-5 ${theme.iconClass}`} />
                </div>
                <div>
                  <p className={`font-semibold ${theme.textClass} mb-2`}>Key Takeaway</p>
                  <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
                </div>
              </div>
            </Card>
          );
        }
        
        // Regular content
        return (
          <div 
            key={index}
            className="prose prose-lg max-w-none
              [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
              [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:text-gray-700
              [&>ol]:space-y-2 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:text-gray-700
              [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3
              [&>strong]:text-gray-900 [&>strong]:font-semibold
              [&_a]:text-blue-600 [&_a]:no-underline hover:[&_a]:underline
              [&>table]:w-full [&>table]:border-collapse
              [&>table_th]:bg-gray-50 [&>table_th]:p-3 [&>table_th]:border [&>table_th]:border-gray-200
              [&>table_td]:p-3 [&>table_td]:border [&>table_td]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: element.outerHTML }}
          />
        );
      })}
    </div>
  );
}

export function DynamicBlogLanding({
  slug,
  activeTab,
  onTabChange,
  isAdminDomain = false
}: DynamicBlogLandingProps) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/blog-posts/by-slug/${slug}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        setBlogPost(data.post);
        
        // Parse content into sections
        if (data.post?.content) {
          const parsedSections = parseStructuredContent(data.post.content);
          setSections(parsedSections);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Blog post not found</p>
          <Button 
            onClick={() => onTabChange('aeo-updates')}
            className="mt-4"
          >
            Back to Updates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
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
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white bg-cover bg-center"
        style={{
          backgroundImage: blogPost.backgroundImageUrl 
            ? `linear-gradient(rgba(30, 58, 95, 0.88), rgba(30, 58, 95, 0.88)), url(${blogPost.backgroundImageUrl})`
            : undefined
        }}
      >
        <div 
          className="w-full py-6 md:py-8 relative bg-cover bg-center min-h-[200px] md:min-h-[240px] flex items-center"
          style={{
            backgroundImage: blogPost.imageUrl 
              ? `linear-gradient(rgba(30, 58, 95, 0.85), rgba(44, 82, 130, 0.85)), url(${blogPost.imageUrl})`
              : undefined
          }}
        >
          {/* Dark overlay for better text readability */}
          {blogPost.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
          )}
          
          <div className="max-w-4xl mx-auto text-center space-y-3 md:space-y-4 relative z-10 w-full px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg">
              {blogPost.title}
            </h1>
            
            {/* Description/Summary */}
            {blogPost.summary && (
              <p className="text-base md:text-lg lg:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                {blogPost.summary}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-4 text-blue-100 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{blogPost.publishDate}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-blue-100 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>{blogPost.category}</span>
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

          {/* Executive Summary Section */}
          {blogPost.executiveSummary && (
            <>
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl">Executive Summary</h2>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-lg leading-relaxed text-gray-800">
                    {blogPost.executiveSummary}
                  </p>
                </div>
              </section>
              
              <Separator />
            </>
          )}

          {/* Dynamic Sections */}
          {sections.length > 0 ? (
            sections.map((section, index) => {
              const IconComponent = section.theme.icon;
              
              return (
                <React.Fragment key={index}>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 ${section.theme.bgClass} rounded-lg`}>
                        <IconComponent className={`w-6 h-6 ${section.theme.iconClass}`} />
                      </div>
                      <h2 className="text-3xl">{section.heading}</h2>
                    </div>
                    
                    <SectionContent content={section.content} theme={section.theme} />
                  </section>
                  
                  {index < sections.length - 1 && <Separator />}
                </React.Fragment>
              );
            })
          ) : (
            /* Fallback: Display full content as-is if no sections generated */
            blogPost.content && (
              <>
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl">Article Content</h2>
                  </div>
                  
                  <div 
                    className="prose prose-lg max-w-none
                      [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
                      [&>ul]:space-y-3 [&>ul]:list-disc [&>ul]:ml-6
                      [&>ol]:space-y-3 [&>ol]:list-decimal [&>ol]:ml-6
                      [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4
                      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3
                      [&>strong]:text-gray-900 [&>strong]:font-bold
                      [&_a]:text-blue-600 [&_a]:no-underline hover:[&_a]:underline
                      [&>blockquote]:bg-blue-50 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:p-6 [&>blockquote]:my-6 [&>blockquote]:rounded-r-lg
                      [&>table]:w-full [&>table]:border-collapse
                      [&>table_th]:bg-gray-50 [&>table_th]:p-3 [&>table_th]:border [&>table_th]:border-gray-200
                      [&>table_td]:p-3 [&>table_td]:border [&>table_td]:border-gray-200"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  />
                </section>
                
                <Separator />
              </>
            )
          )}

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
