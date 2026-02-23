# Backend Deployment Guide

## Current Status

The Athena Election Observatory dashboard is experiencing backend connection issues because the **Supabase Edge Function is not deployed or not responding**.

### Error Messages You May See:
- `Error loading states: TypeError: Failed to fetch`
- `TimeoutError: signal timed out`
- `Backend Offline` alert in Admin Center

## What This Means

The dashboard has two modes:

### 🟡 Fallback Mode (Current)
When the backend is unavailable, the app automatically uses:
- **Default state data** for Ondo and Anambra
- **Hardcoded election results** for display
- **Local-only functionality**

**What Works:**
- ✅ Viewing default election data
- ✅ Browsing the dashboard
- ✅ Viewing blog posts (if added)
- ✅ Viewing PDF resources
- ✅ Map visualization
- ✅ All frontend features

**What Doesn't Work:**
- ❌ Admin Center data management
- ❌ Saving new states or election data
- ❌ Newsletter subscriptions
- ❌ Visitor analytics
- ❌ INEC scraper
- ❌ Real-time data updates

### 🟢 Full Mode (When Backend is Deployed)
When the Supabase Edge Function is deployed and running:
- ✅ All features work
- ✅ Admin Center fully functional
- ✅ Data persistence
- ✅ Real-time updates
- ✅ Newsletter system
- ✅ INEC scraper
- ✅ Visitor tracking

## How to Deploy the Backend

### In Figma Make Environment:

The backend Edge Function should deploy automatically when you publish your Figma Make project. However, you may need to:

1. **Check Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard/project/ppuwjtrsrhsctauasslq
   - Navigate to **Edge Functions** in the sidebar
   - Look for the function named `make-server-c35202b6`
   - Check if it's deployed and running

2. **Manual Deployment (If Available)**
   - In Figma Make, look for a "Deploy" or "Publish" button
   - This should deploy both frontend and backend
   - Wait 1-2 minutes for deployment to complete

3. **Verify Deployment**
   - Open browser console (F12)
   - Look for messages like:
     - `✅ Backend already initialized with X states`
     - `✅ PDF resources already initialized`
   - If you see these, the backend is working!

### Testing Backend Connection

You can test if the backend is working by:

1. **Check Health Endpoint**
   Open this URL in your browser:
   ```
   https://ppuwjtrsrhsctauasslq.supabase.co/functions/v1/make-server-c35202b6/health
   ```
   
   **Expected Response (Backend Working):**
   ```json
   {"status":"ok"}
   ```
   
   **Error Response (Backend Not Deployed):**
   - 404 Not Found
   - Connection error
   - Timeout

2. **Check Admin Center**
   - Go to Admin Center tab
   - Look for the status indicator at the top
   - **Green dot** = Backend Online
   - **Red dot** = Backend Offline

## Troubleshooting

### Issue: "Backend Offline" Alert

**Solution 1: Wait for Auto-Deployment**
- Figma Make may be deploying in the background
- Wait 2-3 minutes and refresh the page
- Click "Retry Connection" button

**Solution 2: Check Supabase Project**
- Ensure your Supabase project is active
- Check if you have any billing issues
- Verify Edge Functions are enabled

**Solution 3: Re-deploy**
- Re-publish your Figma Make project
- This should trigger a fresh deployment

### Issue: Backend Works Temporarily Then Stops

**Possible Causes:**
- Supabase free tier limits reached
- Edge Function cold start (first request may timeout)
- Network issues

**Solutions:**
- Click "Retry Connection" - this warms up the function
- Upgrade Supabase plan if hitting limits
- Check Supabase dashboard for error logs

### Issue: Some Features Work, Others Don't

**Diagnosis:**
- If you can view states but not save them → Backend partially deployed
- Check browser console for specific API endpoint errors
- Each feature uses different endpoints, so partial failures are possible

## Backend Features by Endpoint

Here's what each backend endpoint does:

| Endpoint | Feature | Required For |
|----------|---------|--------------|
| `/health` | Health check | Status indicator |
| `/election/states` | Get states list | States table |
| `/election/state/:name` | Get state data | State details, map |
| `/election/state/:name` (POST) | Save state data | Admin updates |
| `/election/scrape-inec` | INEC scraper | Importing INEC data |
| `/newsletter/subscribe` | Newsletter signup | Newsletter feature |
| `/newsletter/subscribers` | Get subscribers | Newsletter admin |
| `/blog-posts` | Get blog posts | Blog section |
| `/pdf-resources` | Get PDF resources | PDF library |
| `/analytics/track` | Track visitors | Analytics |
| `/analytics/stats` | Get analytics | Visitor dashboard |

## Working Without Backend

If you need to use the dashboard before backend deployment:

### ✅ What You Can Do:
1. **View Default Data** - Ondo and Anambra states are hardcoded
2. **Browse the UI** - All visual elements work
3. **Test Navigation** - Tabs, maps, and routing work
4. **Preview Design** - Everything displays correctly

### ❌ What You Cannot Do:
1. **Save New Data** - Admin Center won't persist changes
2. **Use Newsletter** - Subscription won't work
3. **Track Visitors** - Analytics won't record data
4. **Scrape INEC** - Scraper needs backend

### 🔧 Temporary Workaround:
To add new states temporarily, edit the default data in:
- `/components/StatesSummaryTable.tsx` - `getDefaultStates()` function

## Production Deployment Checklist

Before deploying to athenacenter.ng:

- [ ] Supabase Edge Function is deployed and responding
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Admin Center shows "Backend Online" (green dot)
- [ ] Test creating a new state in Admin Center
- [ ] Test newsletter subscription
- [ ] Test INEC scraper
- [ ] Verify visitor analytics are recording
- [ ] Check all API endpoints in browser console

## Support

If backend deployment issues persist:

1. **Check Supabase Logs**
   - Go to Supabase dashboard
   - Edge Functions → Logs
   - Look for deployment errors

2. **Check Browser Console**
   - Press F12
   - Go to Console tab
   - Look for red errors
   - Check Network tab for failed requests

3. **Environment Variables**
   - Ensure `SUPABASE_URL` is set
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
   - Check `/utils/supabase/info.tsx` has correct values

## Quick Reference

**Backend URL:**
```
https://ppuwjtrsrhsctauasslq.supabase.co/functions/v1/make-server-c35202b6
```

**Project ID:** `ppuwjtrsrhsctauasslq`

**Edge Function Name:** `make-server-c35202b6`

**Source Code:** `/supabase/functions/server/index.tsx`

---

**Status:** The app is designed to work gracefully with or without the backend. Features degrade smoothly, and all display/UI elements continue to function even when backend is unavailable.
