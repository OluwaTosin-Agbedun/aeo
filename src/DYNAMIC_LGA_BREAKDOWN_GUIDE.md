# Dynamic LGA Breakdown System Guide

## Overview
The Athena Election Observatory now supports dynamic LGA (Local Government Area) breakdown pages for **all states**, not just Ondo. Each active state in the States Overview table is clickable and will navigate to a dedicated LGA breakdown page showing detailed election results by LGA.

## How It Works

### 1. User Experience
- When a user clicks on any **active state** in the States Overview table, they are navigated to that state's LGA breakdown page
- The URL structure is: `/aeo/lga-breakdown/{state-name}` (e.g., `/aeo/lga-breakdown/lagos`, `/aeo/lga-breakdown/kano`)
- The LGA breakdown page displays:
  - State name in the title
  - Search functionality to filter LGAs
  - Expandable cards for each LGA showing:
    - EC8A Accredited Voters
    - Total BVAS
    - Valid Votes
    - Votes Cast
    - Leading Parties (with color-coded badges)
    - Tracking Notes

### 2. Data Flow
1. User clicks on an active state in the States Overview table
2. `App.tsx` navigation handler triggers and sets:
   - `lgaBreakdownState` to the selected state name
   - `activeTab` to 'generic-lga'
3. `GenericLGABreakdown` component renders with the state name as a prop
4. Component fetches LGA data from the backend endpoint:
   ```
   GET /election/state/{stateName}/lgas
   ```
5. If LGA data exists, it displays the breakdown
6. If no LGA data exists, it shows a user-friendly message suggesting to add data via Admin Centre

### 3. Components Involved

#### GenericLGABreakdown.tsx
- **Location**: `/components/GenericLGABreakdown.tsx`
- **Props**: 
  - `stateName: string` - The name of the state to display LGA data for
  - `activeTab: string` - Current active tab
  - `onTabChange: (tab: string) => void` - Tab change handler
  - `isAdminDomain?: boolean` - Whether to show Admin button
- **Features**:
  - Fetches LGA data dynamically based on state name
  - Search/filter functionality
  - Expandable card UI
  - Graceful error handling (shows message if no data available)
  - Back button to return to dashboard

#### StatesSummaryTable.tsx
- **Updated Props**:
  - Added `onStateLGANavigate?: (stateName: string) => void` - Handler for navigating to any state's LGA breakdown
- **Behavior**:
  - All **active states** are now clickable
  - Ondo state still uses the original `onOndoLGANavigate` handler (for backward compatibility)
  - All other active states use `onStateLGANavigate` handler

#### App.tsx
- **New State**:
  - Added `lgaBreakdownState: string | null` - Tracks which state's LGA breakdown is being viewed
- **New Handler**:
  ```typescript
  const handleLGABreakdownNavigation = (stateName: string) => {
    const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
    window.history.pushState({}, '', `/aeo/lga-breakdown/${stateSlug}`);
    setLgaBreakdownState(stateName);
    setActiveTab('generic-lga');
    setSelectedState(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  ```
- **URL Routing**:
  - Added pattern matching for `/aeo/lga-breakdown/{state-name}`
  - Automatically extracts state name from URL and renders the appropriate component

### 4. Backend Integration

The system uses the existing LGA management endpoints that were created for Ondo state. No backend changes are required because the endpoints already support any state name:

- **Fetch LGAs**: `GET /election/state/{stateName}/lgas`
  - Returns all LGA data for the specified state
  - Returns empty array if no data exists

The Admin Centre's "LGA Breakdown Management" section allows admins to add LGA data for any state.

## Adding LGA Data for a New State

### Via Admin Centre:
1. Navigate to **Admin Centre** (only visible on localhost or .figma.site domains)
2. Go to the **"LGA Breakdown Management"** section
3. Select the state you want to add LGA data for
4. Fill in the LGA breakdown form:
   - LGA name
   - EC8A Accredited Voters
   - Total BVAS
   - Valid Votes
   - Votes Cast
   - Leading Parties (formatted as: `1. Name (PARTY): votes (%) 2. Name (PARTY): votes (%)`)
   - Tracking Notes
5. Click "Add LGA"
6. Repeat for all LGAs in that state

Once LGA data is added for a state, it will automatically appear when users click on that state in the States Overview table.

## URL Structure

- Dashboard: `/aeo/dashboard`
- States Overview: Shows in dashboard
- Ondo LGA Breakdown (legacy): `/aeo/ondo-lga-breakdown`
- Dynamic LGA Breakdown: `/aeo/lga-breakdown/{state-name}`
  - Examples:
    - `/aeo/lga-breakdown/lagos`
    - `/aeo/lga-breakdown/kano`
    - `/aeo/lga-breakdown/rivers`
    - `/aeo/lga-breakdown/plateau`

## Mobile vs Desktop Behavior

- **Both mobile and desktop** now navigate to the LGA breakdown page when clicking an active state
- The previous distinction between mobile/desktop for Ondo has been preserved for backward compatibility
- Navigation header remains consistent across all breakpoints

## Error Handling

The system gracefully handles cases where:
1. **No LGA data exists**: Shows a friendly message suggesting to add data via Admin Centre
2. **Backend is unavailable**: Shows an error message
3. **State not found**: Falls back to empty state with appropriate messaging

## Testing

To test the dynamic LGA breakdown system:

1. **Add a new state** in Admin Centre → Election Data Management → States Overview
2. **Set the state as "active"** with an election type
3. **Add LGA data** for that state in Admin Centre → LGA Breakdown Management
4. **Navigate to dashboard** and click on the active state in the States Overview table
5. **Verify** the LGA breakdown page loads with the correct data

## Backward Compatibility

- The original `OndoLGABreakdown.tsx` component is preserved for the `/aeo/ondo-lga-breakdown` route
- All Ondo-specific navigation handlers continue to work as before
- The new generic system works alongside the existing Ondo-specific implementation
