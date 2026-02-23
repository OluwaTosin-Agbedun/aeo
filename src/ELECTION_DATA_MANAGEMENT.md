# Election Data Management System

## Overview
The Athena Election Observatory now has a fully functional, dynamic election data management system. All election data across the website is now editable through the Admin Center.

## How It Works

### 1. **Admin Center Access**
- **Visible on:** localhost and .figma.site domains only
- **Hidden on:** athenacenter.ng (production)
- **Location:** Navigate to the "Admin" tab in the header

### 2. **Data Storage**
All election data is stored in the Supabase key-value database with these keys:
- `election:states` - List of all states with monitoring status
- `election:candidates:{state}` - Candidate data for each state
- `election:stats:{state}` - Voter statistics for each state
- `election:polling:{state}` - Polling unit data for each state

### 3. **What You Can Edit**

#### **States Overview Tab**
- Add/remove states from the monitoring overview table
- Set state names
- Set monitoring status (Active Monitoring, No Records, etc.)
- Set records count

#### **State Details Tab**
For each individual state, you can edit:

**Candidates Section:**
- Candidate names
- Party affiliations
- Vote counts
- Vote percentages
- Party colors (hex codes for visual display)

**Voter Statistics Section:**
- Registered voters
- Accredited voters
- Total votes
- Valid votes
- Rejected votes

**Polling Data Section:**
- Total polling units
- Uploaded results count
- Upload percentage
- Total LGAs
- Reporting LGAs count

### 4. **Where Changes Appear**

When you update data in the Admin Center, changes are reflected in:

1. **Live Tracker Snapshot (Dashboard Tab)**
   - Vote statistics cards
   - Upload percentage
   - Voter turnout
   - Leading candidate information

2. **Nigerian States Election Monitoring Overview Table**
   - State names and statuses
   - Monitoring levels
   - Records count

3. **State Details View**
   - When users click on a state, they see updated data
   - Candidate information
   - Vote counts and percentages

### 5. **Getting Started**

**First Time Setup:**
1. Go to Admin Center tab
2. The system will automatically initialize with default Ondo State data if no data exists
3. You can modify this default data or add new states

**Adding a New State:**
1. Go to "States Overview" tab
2. Click "Add State"
3. Fill in state name, status, and records count
4. Click "Save States"
5. Switch to "State Details" tab
6. Select the new state
7. Add candidates, statistics, and polling data
8. Click "Save {State} Data"

**Editing Existing Data:**
1. Go to "State Details" tab
2. Select the state you want to edit
3. Modify candidates, statistics, or polling data
4. Click "Save {State} Data"

### 6. **Data Flow**

```
Admin Center (Edit Data)
    ↓
Backend API (Save to Database)
    ↓
Database (Supabase KV Store)
    ↓
Frontend Components (Load & Display)
    ↓
Users See Updated Data
```

### 7. **API Endpoints**

The following endpoints are available (all prefixed with `/make-server-c35202b6`):

- `GET /election/states` - Get all states
- `POST /election/states` - Update states list
- `GET /election/state/:stateName` - Get data for specific state
- `POST /election/state/:stateName` - Update data for specific state
- `POST /election/initialize` - Initialize default data

### 8. **Security**

- Admin Center is only visible on development domains (localhost, .figma.site)
- Production domain (athenacenter.ng) automatically hides all admin functionality
- All API calls require proper authentication headers

### 9. **Tips**

- **Percentages:** The system doesn't auto-calculate percentages. Make sure to update both votes and percentages when editing candidates.
- **Colors:** Use hex color codes (e.g., #22c55e for green, #ef4444 for red) for candidate party colors.
- **Reload Data:** If something looks wrong, use the "Reload Data" button to refresh from the database.
- **Save Frequently:** Changes are only saved when you click the "Save" buttons.

### 10. **Troubleshooting**

**Problem:** Admin tab not showing
- **Solution:** Make sure you're on localhost or a .figma.site domain

**Problem:** Data not updating on dashboard
- **Solution:** Refresh the page after saving data in the Admin Center

**Problem:** "Failed to load states data" error
- **Solution:** Click the "Initialize" button to create default data structure

**Problem:** Changes not saving
- **Solution:** Check browser console for errors. Make sure you're connected to the internet.

## Default Data Structure

The system initializes with Ondo State data:

**State:** Ondo
- Status: Active Monitoring
- Records: 3245

**Candidates:**
1. Lucky Aiyedatiwa (APC) - 392,882 votes (72.74%)
2. Agboola Ajayi (PDP) - 147,753 votes (27.36%)

**Statistics:**
- Registered Voters: 2,053,061
- Accredited Voters: 560,392
- Total Votes: 540,035
- Valid Votes: 527,942
- Rejected Votes: 12,093

**Polling:**
- Total Polling Units: 3,933
- Uploaded Results: 3,932
- Upload Percentage: 99.97%
- Total LGAs: 18
- Reporting LGAs: 18

## Next Steps

You can now:
1. Add more Nigerian states to monitor
2. Update election results in real-time as they come in
3. Manage multiple elections across different states
4. Keep all data synchronized across your dashboard

The system is fully dynamic and production-ready!
