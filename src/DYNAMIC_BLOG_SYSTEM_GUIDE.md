# Dynamic Blog System Guide

## ✅ Your Blog System is Already Fully Dynamic!

The Athena Election Observatory dashboard now has a **complete dynamic blog post system**. Whenever you create a new blog post through the Admin Center, it will automatically use the beautiful template structure inspired by the Côte d'Ivoire landing page.

---

## 🎯 How It Works

### 1. **Creating a Blog Post**

When you create a blog post in the **Admin Center → Blog Post Management**, the system:

- Stores it in the database with a unique ID and slug
- Automatically generates a URL: `/aeo/blog/{your-slug}`
- Uses the **DynamicBlogLanding** template which features:
  - Color-coded sections (orange, blue, green, purple, red, teal)
  - Icon badges for each section
  - Key Takeaway boxes
  - Professional card layouts
  - Mobile-responsive design
  - Executive Summary section
  - "Back to Latest Insights" navigation button

### 2. **Displaying Blog Posts**

All blog posts appear in **AEO Updates → Latest Insights & Analysis** section:

- Automatically grouped by month and year
- Displayed in reverse chronological order (newest first)
- Each post shows: title, summary, and "Read More" link
- Clicking "Read More" navigates to the full blog post landing page

### 3. **Blog Post Structure**

Your blog posts use the **DynamicBlogLanding** template which:

- **Auto-detects H2 headings** in your content to create colored sections
- **If no H2 headings exist**, it automatically divides content into 3-5 balanced sections
- **Extracts blockquotes** (`<blockquote>`) as "Key Takeaway" boxes
- Supports rich formatting: paragraphs, lists, tables, images, links
- Shows Executive Summary from your `summary` field
- Displays hero image with title overlay

---

## 📝 Content Formatting Best Practices

### Using H2 Headings (Recommended)

```html
<h2>Background Context</h2>
<p>Your content here...</p>

<h2>Key Findings</h2>
<p>Your findings here...</p>

<h2>Implications</h2>
<p>Your analysis here...</p>
```

Each H2 creates a new colored section with an icon.

### Adding Key Takeaways

```html
<blockquote>
  <p>This is an important insight that will be highlighted in a colored box.</p>
</blockquote>
```

Blockquotes automatically become styled "Key Takeaway" cards.

### Rich Content Support

```html
<!-- Paragraphs -->
<p>Regular paragraph text with <strong>bold</strong> and <em>italics</em>.</p>

<!-- Lists -->
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<!-- Tables -->
<table>
  <thead>
    <tr><th>Column 1</th><th>Column 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data 1</td><td>Data 2</td></tr>
  </tbody>
</table>
```

---

## 🎨 Template Color Scheme

Sections automatically rotate through these color themes:

1. **Orange** - Introduction/Executive Summary
2. **Blue** - Background/Context
3. **Green** - Findings/Results
4. **Purple** - Analysis/Implications
5. **Red** - Challenges/Concerns
6. **Teal** - Recommendations/Outlook

---

## 🔄 Legacy Blog Posts

The following blog posts still use **dedicated landing pages** (created before the dynamic system):

1. **Côte d'Ivoire 2025 Election Insight** → CoteIvoireLanding.tsx
2. **Cameroon Post-Election Update** → ElectoralIntegrityLanding.tsx
3. **Cameroon Pre-Election Analysis** → PreElectionLanding.tsx
4. **Ondo State Election Insight** → OndoStateLanding.tsx
5. **Ondo LGA Breakdown** → OndoLGABreakdown.tsx

These are kept for backwards compatibility and custom features. **All NEW blog posts** will use the dynamic template.

---

## ✨ Key Features

### Automatic Navigation
- ✅ Back button returns to "Latest Insights" section in AEO Updates tab
- ✅ Smooth scrolling to the section
- ✅ URL state management (`/aeo/blog/{slug}`)

### Mobile Responsive
- ✅ Hamburger menu on mobile devices
- ✅ Responsive typography
- ✅ Touch-friendly navigation

### SEO Friendly
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Clean URL slugs

### Professional Design
- ✅ Consistent color scheme
- ✅ Icon-based section headers
- ✅ Card-based layouts
- ✅ Gradient backgrounds
- ✅ Smooth transitions

---

## 🚀 Quick Start: Creating Your First Dynamic Blog Post

1. Navigate to **Admin Center** (visible on localhost/.figma.site)
2. Go to **Blog Post Management** section
3. Click **"Create New Blog Post"**
4. Fill in:
   - **Title**: Your blog post title
   - **Slug**: URL-friendly version (e.g., "kenya-2025-election-analysis")
   - **Summary**: Brief overview (appears in card and Executive Summary)
   - **Content**: Your HTML content with H2 headings
   - **Category**: Type of content (e.g., "Election Analysis")
   - **Author**: Your name
   - **Publish Date**: Display date
5. Click **"Save Blog Post"**
6. View it in **AEO Updates → Latest Insights**

---

## 📚 Example Blog Post

```json
{
  "title": "Kenya 2025: Electoral Technology and Transparency",
  "slug": "kenya-2025-electoral-technology",
  "summary": "An analysis of Kenya's implementation of electoral technology and its impact on transparency and voter confidence in the 2025 general elections.",
  "category": "Election Analysis",
  "author": "AEO Research Team",
  "publishDate": "October 28, 2025",
  "content": "<h2>Introduction</h2><p>Kenya's 2025 general elections marked a significant milestone...</p><blockquote><p>Technology alone cannot guarantee electoral integrity without strong institutional oversight.</p></blockquote><h2>Technology Deployment</h2><p>The Independent Electoral and Boundaries Commission (IEBC) deployed...</p><h2>Key Findings</h2><p>Our observation revealed several critical insights...</p>"
}
```

---

## 🎯 Result

When published, your blog post will automatically:

1. Appear in the Latest Insights section
2. Be accessible at `/aeo/blog/kenya-2025-electoral-technology`
3. Use the beautiful color-coded template
4. Work perfectly on all devices
5. Include professional navigation and layout

**Your blog system is ready to use!** 🎉
