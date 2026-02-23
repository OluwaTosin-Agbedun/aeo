import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { MapPin, Eye } from 'lucide-react';
import { OndoStateDetailPanel } from './OndoStateDetailPanel';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StateData {
  state: string;
  uploadPercentage: number;
  electionType: string;
  status: string;
  lastUpdate: string;
  region: string;
}

interface StatesSummaryTableProps {
  onStateClick?: (state: string) => void;
  onOndoNavigate?: () => void;
  onOndoLGANavigate?: () => void;
  onStateLGANavigate?: (stateName: string) => void;
}

export const StatesSummaryTable = React.memo(function StatesSummaryTable({ onStateClick, onOndoNavigate, onOndoLGANavigate, onStateLGANavigate }: StatesSummaryTableProps = {}) {
  const [statesData, setStatesData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);

  // Detect if device is mobile (screen width < 768px) - memoized
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }, []);

  useEffect(() => {
    loadStatesData();
    
    // Auto-refresh every 5 seconds to get latest data from admin
    const interval = setInterval(() => {
      loadStatesData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadStatesData = async () => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/states`;
      console.log('Fetching states from:', url);
      
      const response = await fetch(url, { 
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      console.log('States fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('States data received:', data);
        
        if (data.success && data.states) {
          // Transform states data to match the table format
          const transformedStates: StateData[] = data.states.map((state: any) => ({
            state: state.name,
            uploadPercentage: 99.97, // Can be loaded from state-specific data
            electionType: state.electionType || 'No active election',
            status: state.status || '-', // Pass through the actual status text from admin
            lastUpdate: '3:15 PM',
            region: state.region || 'Unknown'
          }));
          setStatesData(transformedStates);
        } else {
          // If no states data, set empty array (backend returned successfully but with no data)
          console.log('No states data in response, using default states');
          setStatesData(getDefaultStates());
        }
      } else {
        console.log('📊 Backend returned error, using default states');
        // Use default states as fallback
        setStatesData(getDefaultStates());
      }
    } catch (error) {
      console.log('📊 Using default states (backend connection issue)');
      console.log('💡 Dashboard is running in fallback mode with default data');
      // Use default states as fallback when backend is not available
      setStatesData(getDefaultStates());
    } finally {
      setLoading(false);
    }
  };

  // Default states to use when backend is not available
  const getDefaultStates = (): StateData[] => {
    return [
      {
        state: 'Ondo',
        uploadPercentage: 99.97,
        electionType: '2024 Governorship Election',
        status: 'Completed - November 2024',
        lastUpdate: '3:15 PM',
        region: 'Southwest'
      },
      {
        state: 'Anambra',
        uploadPercentage: 0,
        electionType: '2025 Governorship Election',
        status: 'Scheduled - November 8, 2025',
        lastUpdate: 'Today',
        region: 'Southeast'
      }
    ];
  };

  const getRegion = (stateName: string): string => {
    const regions: Record<string, string> = {
      'Ondo': 'Southwest',
      'Lagos': 'Southwest',
      'Kano': 'Northwest',
      'Rivers': 'South-South',
      'Kaduna': 'Northwest',
      'Enugu': 'Southeast',
      'Delta': 'South-South'
    };
    return regions[stateName] || 'Unknown';
  };

  const getStatusBadge = (status: string, uploadPercentage: number, state: string) => {
    if (status === 'active') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active - 99.97%
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <Badge variant="secondary" className="text-gray-600">
          Inactive
        </Badge>
      </div>
    );
  };

  const getRowClassName = (status: string) => {
    return status === 'active' 
      ? 'bg-green-50 border-l-4 border-l-green-500 hover:bg-green-100' 
      : 'opacity-60 hover:opacity-80';
  };

  // Sort with Ekiti first as latest entry, then alphabetically by state name
  const sortedStates = [...statesData].sort((a, b) => {
    // Ekiti always comes first
    if (a.state === 'Ekiti') return -1;
    if (b.state === 'Ekiti') return 1;
    // Then sort rest alphabetically
    return a.state.localeCompare(b.state);
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading states data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[20px] font-bold">
            <MapPin className="h-5 w-5 text-blue-600" />
            Nigerian States Election Monitoring Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground text-[16px]">
            Current election monitoring status across key Nigerian states
          </p>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No States Data Available</p>
            <p className="text-sm text-gray-500">
              Please configure states in the Admin Centre to begin monitoring
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[20px] font-bold">
          <MapPin className="h-5 w-5 text-blue-600" />
          Nigerian States Election Monitoring Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground text-[16px]">
          Past and active election monitoring with detailed LGA breakdown across key Nigerian states
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>State</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Election Type</TableHead>
              <TableHead>Status</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStates.map((state, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {state.state === 'Ondo' ? (
                      isMobile ? (
                        // Mobile: Navigate to LGA breakdown page for Ondo
                        <span 
                          className="font-medium text-green-700 cursor-pointer px-2 py-1 rounded hover:bg-green-100 transition-colors"
                          onClick={() => {
                            if (onOndoLGANavigate) {
                              onOndoLGANavigate();
                            }
                          }}
                        >
                          {state.state}
                        </span>
                      ) : (
                        // Desktop: Navigate to LGA breakdown page for Ondo
                        <span 
                          className="font-medium text-green-800 cursor-pointer px-2 py-1 rounded hover:bg-green-100 transition-colors"
                          onClick={() => {
                            if (onOndoLGANavigate) {
                              onOndoLGANavigate();
                            }
                          }}
                        >
                          {state.state}
                        </span>
                      )
                    ) : (
                      // All other states: Navigate to their LGA breakdown
                      <span 
                        className="font-medium text-green-800 opacity-50"
                        // Temporarily deactivated
                        // onClick={() => {
                        //   if (onStateLGANavigate) {
                        //     onStateLGANavigate(state.state);
                        //   }
                        // }}
                      >
                        {state.state}
                      </span>
                    )}
                    <Badge variant="outline" className="text-xs bg-white">
                      Click for more details
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant="outline" className="text-xs">
                    {state.region}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{state.electionType}</TableCell>
                <TableCell>
                  {state.status || '-'}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  );
});