# Blog Post Image Upload Guide

## Overview
The Blog Post Management system now supports **direct image upload** to Supabase Storage, eliminating the need to host images externally. You can upload images directly from your computer or continue using manual URL input if preferred.

---

## Features

### ✅ Direct Image Upload
- **Drag & Drop Alternative**: Click "Upload Image" button to select files
- **Automatic Storage**: Images uploaded to secure Supabase Storage bucket
- **Public Access**: Uploaded images get public URLs automatically
- **5MB Limit**: Maximum file size of 5MB per image
- **Supported Formats**: JPEG, JPG, PNG, WebP, GIF

### ✅ Image Preview
- **Live Preview**: See uploaded image immediately before saving
- **Remove Button**: Red X button to remove and re-upload
- **Fallback Handling**: Auto-replaces broken images with default

### ✅ Hybrid Approach
- **Upload Option**: Use the upload button for local files
- **Manual URL**: Paste external URLs (Unsplash, Dropbox, etc.)
- **Flexibility**: Choose either method based on your needs

---

## How to Use

### Uploading an Image

1. **Open Blog Post Form**
   - Click "New Blog Post" or "Edit" on existing post
   - Scroll to "Blog Post Image" section

2. **Select Upload Method**
   
   **Option A: Upload from Computer**
   - Click the "Upload Image" button
   - Select an image file (JPEG, PNG, WebP, or GIF)
   - Wait for upload to complete (progress indicator shows)
   - Image preview appears automatically
   
   **Option B: Paste External URL**
   - Scroll to "Or paste image URL manually"
   - Paste image URL from Unsplash, Dropbox, etc.
   - Image preview appears if URL is valid

3. **Remove/Replace Image**
   - Click the red **X button** in top-right corner of preview
   - Upload a new image or paste different URL

4. **Save Blog Post**
   - Fill in other required fields
   - Click "Publish Post" or "Update Post"

---

## File Requirements

### Supported Image Formats
- ✅ JPEG / JPG
- ✅ PNG
- ✅ WebP
- ✅ GIF (including animated)

### File Size Limit
- **Maximum**: 5MB per image
- **Recommended**: 1-2MB for optimal loading
- **Compression**: Consider compressing large images before upload

### Image Dimensions
- **Recommended**: 1200x630px (social media optimal)
- **Minimum**: 800x400px for quality display
- **Aspect Ratio**: 16:9 or 2:1 works best

---

## Storage Details

### Supabase Storage Bucket
- **Bucket Name**: `make-c35202b6-blog-images`
- **Access**: Public (read-only)
- **Location**: Managed by Supabase
- **Auto-Created**: Bucket initializes on first server start

### File Naming Convention
```
blog_[timestamp]_[random-string].[extension]

Example: blog_1730123456789_abc123def456.jpg
```

### Image URLs
Uploaded images get public URLs like:
```
https://[project-id].supabase.co/storage/v1/object/public/make-c35202b6-blog-images/blog_1730123456789_abc123def456.jpg
```

---

## Best Practices

### Image Optimization
1. **Compress Before Upload**
   - Use tools like TinyPNG, Squoosh, or ImageOptim
   - Target 100-200KB for web images
   - Maintain quality while reducing size

2. **Choose Right Format**
   - **JPEG**: Photos and complex images
   - **PNG**: Logos, text, transparency needed
   - **WebP**: Best compression, modern browsers
   - **GIF**: Simple animations only

3. **Resize Appropriately**
   - Don't upload 5000px images for 1200px display
   - Use image editing tools to resize first
   - Saves storage and improves load times

### Image Selection
1. **Relevance**: Choose images related to election content
2. **Quality**: Use high-resolution, professional images
3. **Rights**: Ensure you have permission to use the image
4. **Accessibility**: Images should enhance, not distract

### When to Use Upload vs. URL
- **Upload**: For custom images, photos, graphics you own
- **URL**: For Unsplash, stock photos, already-hosted images
- **Upload Benefit**: Full control, no external dependencies
- **URL Benefit**: Saves storage space, uses CDN

---

## Troubleshooting

### Upload Fails
**Error: "Invalid file type"**
- Solution: Only use JPEG, PNG, WebP, or GIF formats
- Check file extension matches actual file type

**Error: "File size exceeds 5MB limit"**
- Solution: Compress image before uploading
- Use online tools or image editing software

**Error: "Failed to upload image"**
- Check internet connection
- Refresh page and try again
- Verify Supabase Storage is configured

### Image Not Displaying
**Preview shows broken image icon**
- Wait a few seconds for upload to complete
- Check if URL is correct and accessible
- Try removing and re-uploading

**Image disappears after saving**
- Check if imageUrl field is properly saved
- Verify storage bucket permissions are public
- Look at browser console for errors

### Upload Button Disabled
- Upload in progress (wait for completion)
- Check if form dialog is properly opened
- Refresh page if button stays disabled

---

## Technical Details

### API Endpoints

**Upload Image**
```
POST /make-server-c35202b6/blog-images/upload
Content-Type: multipart/form-data
Body: file (FormData)

Response:
{
  "success": true,
  "url": "https://...",
  "fileName": "blog_123456_abc.jpg"
}
```

**Delete Image**
```
DELETE /make-server-c35202b6/blog-images/:fileName
Authorization: Bearer [token]

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Frontend Implementation
- **Component**: `BlogPostAdmin.tsx`
- **State Management**: React `useState` hooks
- **Upload Handler**: `handleImageUpload()`
- **File Input**: Hidden input triggered by button click
- **Preview**: Conditional rendering based on `imageUrl`

### Backend Implementation
- **Server File**: `/supabase/functions/server/index.tsx`
- **Storage Client**: Supabase Storage JS client
- **Bucket Init**: Automatic on server startup
- **File Validation**: Server-side type and size checks
- **Error Handling**: Detailed error messages returned

---

## Security Considerations

### File Validation
- ✅ File type checked on server
- ✅ File size limited to 5MB
- ✅ Only image MIME types allowed
- ✅ Random filename prevents overwrites

### Storage Permissions
- ✅ Public read access (images viewable)
- ✅ Write access via authenticated endpoint only
- ✅ No direct upload from unauthenticated users
- ✅ Service role key protected in server environment

### Best Practices
- Don't upload sensitive information in images
- Use appropriate image names (no personal data)
- Regularly review and clean up unused images
- Monitor storage usage via Supabase dashboard

---

## Future Enhancements

Potential improvements:
- Image cropping/editing before upload
- Multiple image upload for galleries
- Automatic image optimization on upload
- Drag-and-drop file upload
- Image library/media manager
- Bulk delete unused images
- Image metadata (alt text, captions)
- CDN integration for faster delivery

---

## Related Documentation
- [Blog Content Formatting Guide](./BLOG_CONTENT_FORMATTING_GUIDE.md)
- [Dynamic Blog System Guide](./DYNAMIC_BLOG_SYSTEM_GUIDE.md)
- [PDF Resource Management Guide](./PDF_RESOURCE_MANAGEMENT_GUIDE.md)

---

## Quick Reference

### Upload Checklist
- [ ] Image is JPEG, PNG, WebP, or GIF
- [ ] File size is under 5MB
- [ ] Image is relevant to blog content
- [ ] Image is properly compressed
- [ ] You have rights to use the image

### Common File Sizes
| Resolution | JPEG | PNG | WebP |
|-----------|------|-----|------|
| 1200x630 | ~200KB | ~400KB | ~150KB |
| 1920x1080 | ~350KB | ~800KB | ~250KB |
| 2560x1440 | ~500KB | ~1.2MB | ~400KB |

### Keyboard Shortcuts
- **Click Upload Button**: Opens file picker
- **Esc**: Closes image preview (if focus)
- **Tab**: Navigate between form fields

---

**Last Updated:** October 28, 2025
**Version:** 1.0
