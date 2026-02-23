# LGA Breakdown Management Guide

## Overview
The **LGA (Local Government Area) Breakdown Management** system allows administrators to create, edit, and manage detailed election data at the Local Government Area level for each state. This data is displayed on the public-facing LGA breakdown pages.

---

## Features

### 1. **Backend Storage**
- LGA data is stored in the Supabase KV store using the key pattern: `election:lgas:{state_key}`
- Each state can have multiple LGAs with detailed election metrics
- Data persists across sessions and updates in real-time

### 2. **Admin Management Interface**
Located in the **Admin Centre → Election Data → LGA Breakdown** tab:

- **State Selection**: Choose which state's LGAs to manage
- **Add LGAs**: Create new LGA entries with detailed data
- **Edit LGAs**: Modify existing LGA information
- **Delete LGAs**: Remove LGA entries as needed
- **Save Changes**: Persist all changes to the database

### 3. **Public Display**
- LGA data is automatically fetched and displayed on public LGA breakdown pages
- Falls back to hardcoded data if no database entries exist
- Fully responsive design with search and expand/collapse functionality

---

## Data Structure

Each LGA entry contains the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `lga` | string | LGA name | "AKOKO NORTH EAST" |
| `ec8aAccreditedVoters` | string | EC8A accredited voters count | "31,600" |
| `totalBVAS` | string | Total BVAS (Bimodal Voter Accreditation System) count | "31,187" |
| `validVotes` | string | Valid votes count | "30,970" |
| `votesCast` | string | Total votes cast | "31,441" |
| `leadingParties` | string | Formatted list of leading parties with results | "1. Lucky Aiyedatiwa (APC): 24,914 (80.45%)  2. Agboola Ajayi (PDP): 4,950 (15.98%)" |
| `trackingNotes` | string | Administrative notes for tracking | "High APC dominance; track PU completion." |

---

## How to Use

### **Step 1: Access the Admin Centre**
1. Navigate to the **Admin Centre** tab (only visible on localhost or .figma.site domains)
2. Click on **Election Data**
3. Select the **LGA Breakdown** tab

### **Step 2: Select a State**
- Click on the state button for which you want to manage LGA data
- Example: Click "Ondo" to manage Ondo State LGAs

### **Step 3: Add LGA Entries**
1. Click the **"Add LGA"** button
2. Fill in all the required fields:
   - **LGA Name**: Enter the full LGA name in UPPERCASE (e.g., "AKOKO NORTH EAST")
   - **EC8A Accredited Voters**: Enter the number with commas (e.g., "31,600")
   - **Total BVAS**: Enter the BVAS count with commas (e.g., "31,187")
   - **Valid Votes**: Enter valid votes count with commas (e.g., "30,970")
   - **Votes Cast**: Enter total votes cast with commas (e.g., "31,441")
   - **Leading Parties**: Format as shown below
   - **Tracking Notes**: Add any administrative notes

### **Step 4: Format Leading Parties**
Use this exact format for the Leading Parties field:
```
1. Candidate Name (PARTY): 24,914 (80.45%)  2. Candidate Name (PARTY): 4,950 (15.98%)  3. Candidate Name (PARTY): 717 (2.32%)
```

**Important formatting rules:**
- Start each party with a number and period (1., 2., 3.)
- Include two spaces between each party entry
- Format: `Name (PARTY_ABBR): votes (percentage%)`
- Use commas in vote numbers
- Include percentage with decimal points

### **Step 5: Save Changes**
1. After adding or editing LGA entries, click **"Save LGA Data"**
2. Wait for the success confirmation message
3. The data is now live on the public LGA breakdown page

### **Step 6: Verify on Public Page**
1. Navigate back to the Dashboard tab
2. Click on the state (e.g., Ondo State) in the States Summary Table
3. The LGA breakdown page will now display your updated data

---

## Backend API Endpoints

### **Get LGA Data**
```
GET /make-server-c35202b6/election/state/{stateName}/lgas
```

**Response:**
```json
{
  "success": true,
  "state": "Ondo",
  "lgas": [
    {
      "lga": "AKOKO NORTH EAST",
      "ec8aAccreditedVoters": "31,600",
      "totalBVAS": "31,187",
      "validVotes": "30,970",
      "votesCast": "31,441",
      "leadingParties": "1. Lucky Aiyedatiwa (APC): 24,914 (80.45%)  2. Agboola Ajayi (PDP): 4,950 (15.98%)",
      "trackingNotes": "High APC dominance; track PU completion."
    }
  ]
}
```

### **Update LGA Data**
```
POST /make-server-c35202b6/election/state/{stateName}/lgas
Content-Type: application/json

{
  "lgas": [
    { /* LGA object */ }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "LGA data updated for Ondo"
}
```

---

## Component Integration

### **Admin Component**
File: `/components/ElectionDataAdmin.tsx`

The admin interface includes:
- State selection buttons
- LGA entry forms with validation
- Add/Remove LGA functionality
- Save and Reload buttons
- Loading states

### **Public Display Component**
File: `/components/OndoLGABreakdown.tsx`

The public display:
- Fetches LGA data from backend on load
- Falls back to hardcoded data if backend is empty
- Includes search functionality
- Expandable cards for each LGA
- Formatted party results with color coding

---

## Tips and Best Practices

### ✅ **Do's**
- Always use UPPERCASE for LGA names for consistency
- Include commas in all number fields (e.g., "31,600" not "31600")
- Double-check the Leading Parties format before saving
- Use descriptive tracking notes for administrative purposes
- Test data on the public page after saving

### ❌ **Don'ts**
- Don't forget to click "Save LGA Data" after making changes
- Don't use inconsistent formatting in the Leading Parties field
- Don't delete all LGAs without a backup (the system will fall back to hardcoded data)
- Don't mix lowercase and uppercase in LGA names

---

## Troubleshooting

### **Issue: LGA data not showing on public page**
**Solution:**
1. Verify you clicked "Save LGA Data" in the admin panel
2. Check browser console for any error messages
3. Reload the public LGA breakdown page
4. Ensure the state name matches exactly (case-sensitive in URLs)

### **Issue: Leading Parties not displaying correctly**
**Solution:**
1. Check the format matches the example exactly
2. Ensure there are two spaces between party entries
3. Verify percentage format includes the % symbol
4. Use commas in vote numbers

### **Issue: Changes not persisting**
**Solution:**
1. Check your internet connection
2. Verify you're on an admin domain (localhost or .figma.site)
3. Look for error messages in the browser console
4. Try reloading the admin page and checking if data was saved

---

## Example: Complete LGA Entry

```json
{
  "lga": "AKOKO NORTH EAST",
  "ec8aAccreditedVoters": "31,600",
  "totalBVAS": "31,187",
  "validVotes": "30,970",
  "votesCast": "31,441",
  "leadingParties": "1. Lucky Aiyedatiwa (APC): 24,914 (80.45%)  2. Agboola Ajayi (PDP): 4,950 (15.98%)  3. Olorunfemi Ayodele (LP): 717 (2.32%)",
  "trackingNotes": "High APC dominance; track PU completion."
}
```

This will display on the public page as:
- **LGA Card Header**: AKOKO NORTH EAST - 31,441 votes cast
- **Expandable Section** showing:
  - EC8A Accredited: 31,600
  - Total BVAS: 31,187
  - Valid Votes: 30,970
  - Votes Cast: 31,441
  - Three party results with colored badges
  - Tracking notes at the bottom

---

## Related Documentation
- [Election Data Management Guide](./ELECTION_DATA_MANAGEMENT.md) - For managing state-level data
- [Admin Centre Overview](./guidelines/Guidelines.md) - General admin features

---

**Last Updated**: October 28, 2025
