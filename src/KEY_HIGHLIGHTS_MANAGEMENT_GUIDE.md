# Key Highlights Management Guide

## Overview
The **Key Highlights Management** system allows administrators to create and edit the three prominent highlight cards displayed on the dashboard for each state. These cards showcase critical election metrics and developments in a visually appealing format.

---

## Features

### 1. **Backend Storage**
- Highlights data is stored in the Supabase KV store using the key pattern: `election:highlights:{state_key}`
- Each state can have up to 3 highlight cards (recommended) but supports any number
- Data persists across sessions and updates in real-time

### 2. **Admin Management Interface**
Located in the **Admin Centre → Election Data → Key Highlights** tab:

- **State Selection**: Choose which state's highlights to manage
- **Add Highlights**: Create new highlight cards with customizable content
- **Edit Highlights**: Modify existing highlight information
- **Delete Highlights**: Remove highlight cards as needed
- **Live Preview**: See how your highlight will look before saving
- **Color Themes**: Choose from 6 color schemes (Blue, Green, Purple, Red, Orange, Teal)

### 3. **Public Display**
- Highlights are automatically fetched and displayed on the dashboard when a state is selected
- Only shown if highlights exist for that state
- Fully responsive design matching the existing dashboard style
- Dynamic color theming based on admin settings

---

## Data Structure

Each Highlight card contains the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Highlight card title | "Election Upload Complete" |
| `mainStatistic` | string | The prominent statistic/number | "99.97%" |
| `description` | string | Additional context text | "of Polling Units Tallied across all 18 LGAs in Ondo State with comprehensive data coverage" |
| `colorTheme` | string | Visual color scheme | "blue" (options: blue, green, purple, red, orange, teal) |

---

## How to Use

### **Step 1: Access the Admin Centre**
1. Navigate to the **Admin Centre** tab (only visible on localhost or .figma.site domains)
2. Click on **Election Data**
3. Select the **Key Highlights** tab

### **Step 2: Select a State**
- Click on the state button for which you want to manage highlights
- Example: Click "Ondo" to manage Ondo State highlights

### **Step 3: Add Highlight Cards**
1. Click the **"Add Highlight"** button
2. Fill in the form fields for each highlight:

#### **Highlight Title**
- Enter a concise, descriptive title
- Examples: 
  - "Election Upload Complete"
  - "Leading Candidate"
  - "Victory Margin"
  - "Voter Turnout"

#### **Main Statistic**
- The primary number or text to emphasize
- This appears in large, bold text
- Examples:
  - "99.97%"
  - "Lucky Aiyedatiwa"
  - "45.4%"
  - "540,035"

#### **Color Theme**
Choose from the dropdown:
- **Blue**: Professional, trust-building (default)
- **Green**: Success, positive metrics
- **Purple**: Important, premium information
- **Red**: Urgent, critical data
- **Orange**: Warning, attention-needed
- **Teal**: Neutral, informational

#### **Description**
- Supporting text that provides context
- Appears after the main statistic in normal text
- Examples:
  - "of Polling Units Tallied across all 18 LGAs in Ondo State with comprehensive data coverage"
  - "(APC) leads with **392,882 votes** representing **72.74%**"
  - "margin over second place with a decisive **240,000+** vote difference"

### **Step 4: Preview Your Highlight**
- After filling in the fields, a live preview appears below the form
- Check that colors, text, and formatting look correct
- Adjust as needed

### **Step 5: Add More Highlights**
- Click "Add Highlight" again to create additional cards
- Recommended: Create exactly 3 highlights for best visual layout
- The dashboard displays highlights in a 3-column grid on desktop

### **Step 6: Save Changes**
1. After adding/editing all highlights, click **"Save Highlights"**
2. Wait for the success confirmation message
3. The data is now live on the public dashboard

### **Step 7: Verify on Public Page**
1. Navigate back to the Dashboard tab
2. Select your state from the States Filter
3. Scroll down to see the "Key Highlights" section
4. Your custom highlights will be displayed

---

## Example: Complete Highlight Setup (Ondo State)

### Highlight 1 - Election Completion
```json
{
  "title": "Election Upload Complete",
  "mainStatistic": "99.97%",
  "description": "of Polling Units Tallied across all 18 LGAs in Ondo State with comprehensive data coverage",
  "colorTheme": "blue"
}
```

### Highlight 2 - Leading Candidate
```json
{
  "title": "Leading Candidate",
  "mainStatistic": "Lucky Aiyedatiwa",
  "description": "(APC) leads with 392,882 votes representing 72.74%",
  "colorTheme": "green"
}
```

### Highlight 3 - Victory Margin
```json
{
  "title": "Victory Margin",
  "mainStatistic": "45.4%",
  "description": "margin over second place with a decisive 240,000+ vote difference",
  "colorTheme": "purple"
}
```

**Display Result:**
These three highlights will appear in a responsive 3-column grid with their respective color schemes, creating a visually striking summary of key election metrics.

---

## Backend API Endpoints

### **Get Highlights Data**
```
GET /make-server-c35202b6/election/state/{stateName}/highlights
```

**Response:**
```json
{
  "success": true,
  "state": "Ondo",
  "highlights": [
    {
      "title": "Election Upload Complete",
      "mainStatistic": "99.97%",
      "description": "of Polling Units Tallied across all 18 LGAs in Ondo State",
      "colorTheme": "blue"
    }
  ]
}
```

### **Update Highlights Data**
```
POST /make-server-c35202b6/election/state/{stateName}/highlights
Content-Type: application/json

{
  "highlights": [
    { /* Highlight object */ }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Highlights updated for Ondo"
}
```

---

## Color Theme Reference

### Visual Guide

| Theme | Use Case | Background | Text Color | Best For |
|-------|----------|------------|------------|----------|
| **Blue** | Default, professional | Light blue gradient | Dark blue | Completion rates, official data |
| **Green** | Positive metrics | Light green gradient | Dark green | Leading candidates, success stories |
| **Purple** | Important stats | Light purple gradient | Dark purple | Victory margins, premium data |
| **Red** | Critical data | Light red gradient | Dark red | Urgent updates, alerts |
| **Orange** | Attention needed | Light orange gradient | Dark orange | Warnings, disputed results |
| **Teal** | Informational | Light teal gradient | Dark teal | Neutral statistics, turnout |

---

## Tips and Best Practices

### ✅ **Do's**
- Create exactly 3 highlights for optimal visual layout
- Use contrasting color themes (e.g., Blue, Green, Purple)
- Keep titles short and descriptive (2-4 words)
- Make main statistics bold and impactful
- Provide context in descriptions
- Test on both desktop and mobile before finalizing
- Update highlights as election data changes

### ❌ **Don'ts**
- Don't create more than 5 highlights (grid layout breaks)
- Don't use the same color theme for all cards
- Don't write overly long titles (they may wrap awkwardly)
- Don't forget to click "Save Highlights" after editing
- Don't use complex formatting in description text
- Don't create highlights without a main statistic

---

## Common Use Cases

### **1. Election Results Summary**
- **Highlight 1**: Upload completion percentage (Blue)
- **Highlight 2**: Leading candidate and votes (Green)
- **Highlight 3**: Victory margin (Purple)

### **2. Ongoing Election Monitoring**
- **Highlight 1**: Current reporting status (Blue)
- **Highlight 2**: Voter turnout (Teal)
- **Highlight 3**: Polling units online (Green)

### **3. Pre-Election Setup**
- **Highlight 1**: Registered voters (Blue)
- **Highlight 2**: Polling units ready (Green)
- **Highlight 3**: Days until election (Orange)

### **4. Post-Election Analysis**
- **Highlight 1**: Final results certified (Green)
- **Highlight 2**: Total votes cast (Blue)
- **Highlight 3**: Disputed results (Red)

---

## Troubleshooting

### **Issue: Highlights not showing on dashboard**
**Solution:**
1. Verify you clicked "Save Highlights" in the admin panel
2. Check that the state is selected in the States Filter
3. Ensure at least one highlight exists for that state
4. Reload the dashboard page
5. Check browser console for any error messages

### **Issue: Colors not displaying correctly**
**Solution:**
1. Verify the colorTheme value is one of: blue, green, purple, red, orange, teal
2. Check for typos in the color theme dropdown
3. Clear browser cache and reload

### **Issue: Text overflowing or wrapping strangely**
**Solution:**
1. Shorten the title (keep to 2-4 words)
2. Break up long descriptions with natural word breaks
3. Avoid special characters or excessive formatting
4. Test on different screen sizes

### **Issue: Changes not persisting**
**Solution:**
1. Check your internet connection
2. Verify you're on an admin domain (localhost or .figma.site)
3. Look for error messages in the browser console
4. Try reloading the admin page and checking if data was saved

---

## Integration with Other Features

### **Works With:**
- **States Filter**: Highlights load automatically when a state is selected
- **Election Data Admin**: Shares state selection with other election data tabs
- **Dynamic Sections**: Highlights section collapses if no data exists

### **Complements:**
- **Live Tracker Stats**: Displays below the stats cards
- **LGA Breakdown**: Provides summary before detailed data
- **State Details**: Highlights key metrics from detailed statistics

---

## Best Practices for Different States

### **States with Active Elections**
1. Focus on real-time metrics (upload %, turnout)
2. Update highlights as data comes in
3. Use green for positive progress, blue for status
4. Highlight leading candidates when results are clear

### **States with No Recent Elections**
1. Consider not adding highlights (section will hide)
2. Or use generic placeholder data
3. Focus on registration statistics
4. Prepare highlights for upcoming elections

### **States with Historical Data**
1. Showcase final certified results
2. Use past tense in descriptions
3. Highlight voter participation metrics
4. Include victory margins and notable stats

---

## Future Enhancements

Potential features for future development:
- Icon selection for each highlight card
- Animation effects on hover
- Link capability to detailed pages
- Automatic metric calculation from other data
- Templates for common highlight types
- Bulk import/export functionality
- Version history for highlights

---

## Related Documentation
- [Election Data Management Guide](./ELECTION_DATA_MANAGEMENT.md) - For managing state-level data
- [LGA Breakdown Management Guide](./LGA_BREAKDOWN_MANAGEMENT_GUIDE.md) - For LGA-level details
- [Admin Centre Overview](./guidelines/Guidelines.md) - General admin features

---

**Last Updated**: October 28, 2025
