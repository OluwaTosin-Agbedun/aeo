import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishDate: string;
  slug: string;
  category: string;
  author: string;
  createdAt: string;
}

interface BlogUpdatesProps {
  onNavigateToLanding?: (slug: string) => void;
}

// Helper function to group blog posts by month and year
function groupPostsByMonth(posts: BlogPost[]): { [key: string]: BlogPost[] } {
  const grouped: { [key: string]: BlogPost[] } = {};
  
  posts.forEach(post => {
    // Parse the date string to get month and year
    const date = new Date(post.createdAt || post.publishDate);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(post);
  });
  
  return grouped;
}

export function BlogUpdates({ onNavigateToLanding }: BlogUpdatesProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog posts from database
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/blog-posts`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setBlogPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleReadMore = (slug: string) => {
    // Navigate to standalone landing page
    if (onNavigateToLanding) {
      onNavigateToLanding(slug);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="mb-3 text-2xl md:text-3xl lg:text-[36px] font-bold text-gray-900">Latest Insights & Analysis</h2>
          <p className="text-muted-foreground max-w-4xl mx-auto text-sm md:text-base lg:text-[18px] leading-relaxed px-2">
            Loading blog posts...
          </p>
        </div>
      </div>
    );
  }

  // Group posts by month and year
  const groupedPosts = groupPostsByMonth(blogPosts);
  const monthYears = Object.keys(groupedPosts).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="mb-3 text-2xl md:text-3xl lg:text-[36px] font-bold text-gray-900">Latest Insights & Analysis</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto text-sm md:text-base lg:text-[18px] leading-relaxed px-2">
          Stay informed with our latest articles on electoral integrity, democratic governance, and policy innovation. 
          Expert analysis from the Athena Centre for Policy and Leadership.
        </p>
      </div>

      {/* Blog Posts List */}
      {blogPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No blog posts available yet.</p>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {monthYears.map((monthYear) => (
            <div key={monthYear} className="space-y-4">
              {/* Month Header */}
              <div className="bg-[#2d5a6f] text-white px-4 py-2 rounded-md">
                <h3 className="text-base md:text-lg">{monthYear}</h3>
              </div>

              {/* Posts for this month */}
              <div className="space-y-4 md:space-y-5">
                {groupedPosts[monthYear].map((blog) => (
                  <div key={blog.id} className="flex gap-3 md:gap-4 items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="text-sm md:text-base leading-relaxed">
                        <span className="font-bold text-gray-900">{blog.title}</span>
                        <span className="text-gray-700">: {blog.summary}</span>
                      </div>
                      <button
                        onClick={() => handleReadMore(blog.slug)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-xs md:text-sm inline-block"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}