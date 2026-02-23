# PDF Resource Management Guide

## Overview
The PDF Resource Management system allows you to dynamically manage election analysis reports and publications through the Admin Centre. All PDFs are stored as metadata in the database with links to hosted files (Dropbox, Google Drive, etc.).

## Features

### ✅ Dynamic PDF Library
- PDFs are fetched from the database (not hardcoded)
- Automatically appears in the **AEO Updates** tab under "Reports and Publications"
- Supports categories: Election Analysis, Technology Assessment, Comprehensive Report
- Each PDF has: title, summary, preview content, hosted URL, file size, publish date

### ✅ Admin Centre Management
Located in the **Admin Centre** tab (visible only on localhost and *.figma.site domains):
- **Add new PDF resources** with metadata
- **Edit existing resources** (title, summary, category, etc.)
- **Delete resources** from the library
- **Initialize default resources** (6 pre-configured PDFs)

---

## How to Use

### Accessing the PDF Management Section

1. Navigate to the **Admin Centre** tab
2. Scroll to the **PDF Resource Management** section (teal border)

### Adding a New PDF Resource

1. Click **"Add PDF Resource"** button
2. Fill in the required fields:
   - **Title*** (e.g., "Do Votes Count? Kogi 2023 Election")
   - **Summary*** (2-3 sentence brief description)
   - **Preview Content*** (5-10 sentences for the preview modal)
   - **Hosted PDF URL*** (Dropbox, Google Drive, or other hosting service link)
   - **Category*** (Election Analysis, Technology Assessment, or Comprehensive Report)
   - **File Name** (e.g., "document.pdf")
   - **File Size** (e.g., "2.8 MB")
   - **Publish Date** (e.g., "October 2025")

3. Click **"Add Resource"**

### Hosting Your PDF Files

**Option 1: Dropbox**
1. Upload PDF to Dropbox
2. Share the file and copy the link
3. Paste the link in "Hosted PDF URL" field
4. The system automatically converts it to a direct download link

**Option 2: Google Drive**
1. Upload PDF to Google Drive
2. Set sharing to "Anyone with the link can view"
3. Copy the shareable link
4. Paste the link in "Hosted PDF URL" field

**Option 3: Other Services**
- Any publicly accessible PDF URL works
- Make sure the link allows direct download or viewing

### Editing a Resource

1. Find the resource in the list
2. Click the **Edit** button (pencil icon)
3. Update any fields
4. Click **"Update Resource"**

### Deleting a Resource

1. Find the resource in the list
2. Click the **Delete** button (trash icon)
3. Confirm deletion

### Loading Default Resources

If you're starting fresh:
1. Click **"Load 6 Default Resources"** button (appears when library is empty)
2. Confirm the action
3. 6 pre-configured election analysis reports will be loaded

---

## Categories Explained

### Election Analysis (Blue Badge)
Reports analyzing specific elections, voter behavior, and electoral integrity

### Technology Assessment (Green Badge)
Technical evaluations of electoral technology (BVAS, IReV, etc.)

### Comprehensive Report (Purple Badge)
Broad summaries covering multiple elections or time periods

---

## Display Features

### On the Public Site (AEO Updates Tab)
- **Grid layout** with 3 columns (responsive)
- **Category badges** with color coding
- **Download buttons** for direct PDF access
- **Preview modals** with document summary and key findings
- **Empty state** when no resources exist

### In the Admin Centre
- **List view** with all metadata
- **Edit/Delete actions** on each resource
- **External link** to view the hosted file
- **Color-coded category badges**
- **Creation tracking** (stored but not displayed)

---

## Best Practices

### Writing Summaries
- Keep to 2-3 sentences
- Highlight the main finding or focus
- Make it compelling for readers

### Writing Preview Content
- Expand on the summary with 5-10 sentences
- Include key findings and methodology
- Mention specific data points or percentages
- Explain the report's significance

### File Naming
- Use descriptive names: "Do-votes-count-Kogi-2023.pdf"
- Avoid special characters
- Include state/topic/year when relevant

### Publish Dates
- Use format: "Month Year" (e.g., "October 2025")
- Or: "Day Month Year" (e.g., "15 October 2025")
- Keep consistent across all resources

---

## Technical Details

### Data Storage
- Metadata stored in KV store with prefix `pdf_resource:`
- Each resource has unique ID: `pdf_1`, `pdf_2`, etc.
- No actual PDF files stored in database (only links)

### API Endpoints
- **GET** `/make-server-c35202b6/pdf-resources` - Fetch all resources
- **POST** `/make-server-c35202b6/pdf-resources` - Create/update resource
- **DELETE** `/make-server-c35202b6/pdf-resources/:id` - Delete resource
- **POST** `/make-server-c35202b6/pdf-resources/initialize` - Load defaults

### Components
- **PDFResourceAdmin.tsx** - Admin management interface
- **PDFResourceLibrary.tsx** - Public display component
- Backend: `/supabase/functions/server/index.tsx`

---

## Troubleshooting

### PDF Won't Download
- Check if the hosted URL is publicly accessible
- Verify sharing permissions on Dropbox/Google Drive
- Try the direct download link in a browser

### Resources Not Showing
- Refresh the page
- Check browser console for errors
- Verify the API endpoints are working

### Initialization Failed
- Check server logs
- Ensure database connection is working
- Try again after refreshing

---

## Future Enhancements

Potential features to add:
- File upload directly to Supabase Storage
- Advanced filtering (by category, date, etc.)
- Search functionality
- Download statistics tracking
- PDF thumbnail generation
- Bulk import from CSV

---

## Related Documentation
- [Blog Content Formatting Guide](./BLOG_CONTENT_FORMATTING_GUIDE.md)
- [Dynamic Blog System Guide](./DYNAMIC_BLOG_SYSTEM_GUIDE.md)
- [Newsletter Setup Guide](./NEWSLETTER_SETUP_GUIDE.md)

---

**Last Updated:** October 28, 2025
