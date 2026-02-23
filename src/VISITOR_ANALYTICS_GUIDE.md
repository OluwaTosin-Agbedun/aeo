# Website Visitor Analytics System

## Overview
The Athena Election Observatory now includes a comprehensive visitor analytics system that automatically tracks website traffic, device usage, and user behavior.

## Features

### Automatic Tracking
- **Page Views**: Every page visit is automatically recorded
- **Unique Visitors**: Uses localStorage to identify returning visitors
- **Device Detection**: Automatically detects desktop, mobile, or tablet
- **Browser Detection**: Identifies Chrome, Firefox, Safari, Edge, Opera, and others
- **Screen Resolution**: Records visitor screen sizes
- **Referrer Tracking**: Tracks where visitors come from
- **Timestamp**: Records exact time of each visit

### Analytics Dashboard
Access the analytics dashboard through: **Admin Center Tab → Website Visitors Dashboard**

#### Key Metrics Displayed:
1. **Total Visits**: All-time page views
2. **Unique Visitors**: Number of distinct users
3. **Today's Visits**: Page views from today
4. **Weekly Visits**: Page views from last 7 days

#### Detailed Analytics:
- **Device Breakdown**: Percentage of desktop, mobile, and tablet users
- **Browser Breakdown**: Distribution of browsers (Chrome, Firefox, Safari, etc.)
- **Top Pages**: Most visited pages on your website
- **Recent Visits**: Real-time feed of the last 20 page views
- **Traffic Sources**: Shows where visitors are coming from (referrers)

## How It Works

### 1. Visitor Tracking Component
The `VisitorTracker` component runs automatically on every page:
- Creates a unique visitor ID on first visit (stored in browser localStorage)
- Detects device type, browser, and screen resolution
- Sends data to backend API
- Silent operation - doesn't affect user experience

### 2. Data Storage
All visitor data is stored in the Supabase key-value database:
- `visit:{timestamp}:{visitorId}` - Individual visit records
- `visitor:{visitorId}` - Visitor profiles with visit count and history
- **Data Retention**: 24-hour rolling window (older records can be deleted via cleanup)

### 3. Privacy & Security
- **No Personal Data**: Only anonymous visitor IDs are stored
- **Local Storage**: Visitor ID stored locally in browser
- **Admin Only**: Analytics dashboard only visible on localhost/.figma.site
- **No Cookies**: Uses localStorage instead of tracking cookies

## Using the Analytics Dashboard

### Viewing Analytics
1. Navigate to the **Admin** tab (only visible on localhost and .figma.site)
2. Scroll to **Website Visitors Dashboard** section
3. View real-time statistics and charts

### Refreshing Data
- Click the **Refresh** button to reload latest analytics
- Dashboard shows "Last updated" timestamp

### Cleaning Up Old Data
- Click **Delete Records (24h+)** button to remove records older than 24 hours
- Keeps only the last 24 hours of visitor data
- Helps keep database optimized and maintains recent data only
- Requires confirmation before permanent deletion

## Data Tracked

### For Each Visit:
```javascript
{
  visitorId: "visitor_1234567890_abc123",
  page: "/aeo/dashboard",
  deviceType: "desktop",
  browser: "Chrome",
  screenSize: "1920x1080",
  referrer: "https://google.com",
  timestamp: "2025-10-17T10:30:00.000Z"
}
```

### For Each Visitor:
```javascript
{
  visitorId: "visitor_1234567890_abc123",
  firstVisit: "2025-10-17T10:00:00.000Z",
  lastVisit: "2025-10-17T10:30:00.000Z",
  visitCount: 5,
  pages: ["/", "/aeo/dashboard", "/aeo/about"],
  deviceType: "desktop",
  browser: "Chrome"
}
```

## API Endpoints

### Track Visit
```
POST /make-server-c35202b6/analytics/track
```
**Body:**
```json
{
  "visitorId": "string",
  "page": "string",
  "deviceType": "desktop|mobile|tablet",
  "browser": "string",
  "screenSize": "string",
  "referrer": "string",
  "timestamp": "ISO date string"
}
```

### Get Analytics
```
GET /make-server-c35202b6/analytics/stats
```
**Response:** Full analytics object with all metrics

### Cleanup Old Data
```
POST /make-server-c35202b6/analytics/cleanup
```
**Body:**
```json
{
  "hoursToKeep": 24
}
```
**Note:** Data retention is now set to 24 hours instead of 90 days for recent-only analytics.

## Device Type Detection

The system automatically classifies devices:
- **Desktop**: Traditional computers and laptops
- **Mobile**: Smartphones
- **Tablet**: iPads and Android tablets
- **Unknown**: Unrecognized devices

## Browser Detection

Supported browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera
- Other (for unrecognized browsers)

## Use Cases

### 1. Understanding Your Audience
- See which devices your visitors use most
- Optimize your site for the most common screen sizes
- Understand browser compatibility needs

### 2. Content Strategy
- Identify most popular pages
- Find underperforming content
- Track engagement trends over time

### 3. Traffic Analysis
- Monitor daily, weekly, and monthly trends
- Identify traffic sources
- Track marketing campaign effectiveness

### 4. Performance Monitoring
- See if recent updates affect traffic
- Monitor real-time visitor activity
- Track unique vs. returning visitors

## Best Practices

### 1. Regular Monitoring
- Check analytics weekly to understand trends
- Look for unusual spikes or drops in traffic

### 2. Data Cleanup
- Run cleanup every 3-6 months to remove old data
- Keep last 90 days for meaningful analytics

### 3. Privacy Compliance
- System uses anonymous visitor IDs only
- No personal information is collected
- Compliant with basic privacy standards

### 4. Performance
- Tracking runs asynchronously and doesn't slow down page loads
- Failed tracking attempts don't affect user experience
- Minimal database storage impact

## Troubleshooting

### Problem: No analytics data showing
**Solutions:**
- Ensure visitors are actually visiting the site
- Check browser console for tracking errors
- Verify backend endpoints are working
- Wait a few minutes for data to populate

### Problem: Inaccurate visitor counts
**Solutions:**
- Clear localStorage to reset your own visitor ID
- Remember that private/incognito mode creates new visitor IDs
- Multiple devices = multiple unique visitors

### Problem: Dashboard not loading
**Solutions:**
- Check that you're on localhost or .figma.site domain
- Verify Supabase connection
- Check browser console for errors
- Try refreshing the page

## Future Enhancements

Potential additions:
- Geographic location tracking (country/city)
- Visit duration tracking
- Heatmap of page interactions
- Conversion funnel tracking
- Custom event tracking
- Export analytics to CSV
- Email reports
- Real-time visitor counter

## Technical Details

### Storage Format
- **Prefix System**: Uses `visit:` and `visitor:` prefixes for easy querying
- **Time-based Keys**: Allows for efficient time-range queries
- **Denormalized Data**: Optimized for fast reads

### Performance
- **Async Tracking**: Non-blocking API calls
- **Client-side Detection**: Device/browser detection happens in browser
- **Batch-safe**: Can handle multiple simultaneous visits

### Scalability
- **Efficient Storage**: ~500 bytes per visit record
- **Fast Queries**: Prefix-based queries are optimized
- **Cleanup Tool**: Prevents unlimited data growth

## Summary

The visitor analytics system provides comprehensive insights into your website traffic with:
- ✅ Automatic tracking on every page
- ✅ Real-time analytics dashboard
- ✅ Device and browser breakdown
- ✅ Privacy-focused design
- ✅ Easy data cleanup
- ✅ Admin-only visibility

The system runs silently in the background and requires no maintenance, giving you valuable insights into how users interact with the Athena Election Observatory website.
