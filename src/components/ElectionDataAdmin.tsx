import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Loader2, Plus, Trash2, Save, RefreshCw, Database } from 'lucide-react';

interface StateData {
  name: string;
  region: string;
  electionType: string;
  status: string;
}

interface Candidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

interface Stats {
  registeredVoters: number;
  accreditedVoters: number;
  totalVotes: number;
  rejectedVotes: number;
  validVotes: number;
}

interface Polling {
  totalPollingUnits: number;
  uploadedResults: number;
  uploadPercentage: number;
  totalLGAs: number;
  reportingLGAs: number;
}

interface LGAData {
  lga: string;
  ec8aAccreditedVoters: string;
  totalBVAS: string;
  validVotes: string;
  votesCast: string;
  leadingParties: string;
  trackingNotes: string;
}

interface Highlight {
  title: string;
  mainStatistic: string;
  description: string;
  colorTheme: string;
}

export function ElectionDataAdmin() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<StateData[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Stats>({
    registeredVoters: 0,
    accreditedVoters: 0,
    totalVotes: 0,
    rejectedVotes: 0,
    validVotes: 0
  });
  const [polling, setPolling] = useState<Polling>({
    totalPollingUnits: 0,
    uploadedResults: 0,
    uploadPercentage: 0,
    totalLGAs: 0,
    reportingLGAs: 0
  });
  const [lgas, setLgas] = useState<LGAData[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6`;

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  // Load state data when selected state changes
  useEffect(() => {
    if (selectedState) {
      loadStateData(selectedState);
    }
  }, [selectedState]);

  const loadStates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/election/states`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (!response.ok) throw new Error('Failed to load states');

      const data = await response.json();
      if (data.success && data.states.length > 0) {
        setStates(data.states);
        // Set first state as selected if none selected
        if (!selectedState && data.states.length > 0) {
          setSelectedState(data.states[0].name);
        }
      } else {
        // Initialize with defaults if no data exists
        await initializeDefaultData();
      }
    } catch (error) {
      // Silently handle error - backend might not be available yet
      // This is expected behavior when the system is initializing
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStateData = async (stateName: string) => {
    if (!stateName) return;
    
    try {
      setLoading(true);
      
      // Load state data (candidates, stats, polling)
      const stateResponse = await fetch(`${API_BASE}/election/state/${stateName}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (!stateResponse.ok) throw new Error('Failed to load state data');

      const data = await stateResponse.json();
      if (data.success) {
        setCandidates(data.data.candidates || []);
        setStats({
          registeredVoters: data.data.stats?.registeredVoters || 0,
          accreditedVoters: data.data.stats?.accreditedVoters || 0,
          totalVotes: data.data.stats?.totalVotes || 0,
          rejectedVotes: data.data.stats?.rejectedVotes || 0,
          validVotes: data.data.stats?.validVotes || 0
        });
        setPolling({
          totalPollingUnits: data.data.polling?.totalPollingUnits || 0,
          uploadedResults: data.data.polling?.uploadedResults || 0,
          uploadPercentage: data.data.polling?.uploadPercentage || 0,
          totalLGAs: data.data.polling?.totalLGAs || 0,
          reportingLGAs: data.data.polling?.reportingLGAs || 0
        });
      }

      // Load LGA data (non-blocking)
      try {
        const lgaResponse = await fetch(`${API_BASE}/election/state/${stateName}/lgas`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        
        if (lgaResponse.ok) {
          const lgaData = await lgaResponse.json();
          if (lgaData.success) {
            setLgas(lgaData.lgas || []);
          }
        } else {
          setLgas([]);
        }
      } catch (lgaError) {
        // Silently handle - LGA data may not exist yet
        setLgas([]);
      }

      // Load highlights data (non-blocking)
      try {
        const highlightsResponse = await fetch(`${API_BASE}/election/state/${stateName}/highlights`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        
        if (highlightsResponse.ok) {
          const highlightsData = await highlightsResponse.json();
          if (highlightsData.success) {
            setHighlights(highlightsData.highlights || []);
          }
        } else {
          setHighlights([]);
        }
      } catch (highlightsError) {
        // Silently handle - highlights data may not exist yet
        setHighlights([]);
      }
    } catch (error) {
      // Silently handle error - backend might not be available or no data exists yet
      setCandidates([]);
      setStats({
        registeredVoters: 0,
        accreditedVoters: 0,
        totalVotes: 0,
        rejectedVotes: 0,
        validVotes: 0
      });
      setPolling({
        totalPollingUnits: 0,
        uploadedResults: 0,
        uploadPercentage: 0,
        totalLGAs: 0,
        reportingLGAs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultData = async () => {
    try {
      const response = await fetch(`${API_BASE}/election/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to initialize');

      const data = await response.json();
      if (data.success) {
        toast.success('Election data initialized with defaults');
        await loadStates();
      }
    } catch (error) {
      // Silently handle initialization error
      // This is expected when backend is not available
    }
  };

  const saveStates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/election/states`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ states })
      });

      if (!response.ok) throw new Error('Failed to save states');

      const data = await response.json();
      if (data.success) {
        toast.success('States data saved successfully');
      }
    } catch (error) {
      console.error('Error saving states:', error);
      toast.error('Failed to save states data');
    } finally {
      setLoading(false);
    }
  };

  const saveStateData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/election/state/${selectedState}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ candidates, stats, polling })
      });

      if (!response.ok) throw new Error('Failed to save state data');

      const data = await response.json();
      if (data.success) {
        toast.success(`Data saved for ${selectedState}`);
        // Refresh states list to update records count
        await loadStates();
      }
    } catch (error) {
      console.error('Error saving state data:', error);
      toast.error(`Failed to save data for ${selectedState}`);
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = () => {
    setCandidates([...candidates, {
      name: '',
      party: '',
      votes: 0,
      percentage: 0,
      color: '#3b82f6'
    }]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const updateCandidate = (index: number, field: keyof Candidate, value: any) => {
    const updated = [...candidates];
    // Ensure numeric fields are always numbers, not undefined
    if (field === 'votes' || field === 'percentage') {
      updated[index] = { ...updated[index], [field]: value === '' ? 0 : value };
    } else {
      updated[index] = { ...updated[index], [field]: value || '' };
    }
    setCandidates(updated);
  };

  const addState = () => {
    setStates([...states, {
      name: '',
      region: '',
      electionType: '',
      status: 'No Records'
    }]);
  };

  const removeState = (index: number) => {
    setStates(states.filter((_, i) => i !== index));
  };

  const updateState = (index: number, field: keyof StateData, value: any) => {
    const updated = [...states];
    updated[index] = { ...updated[index], [field]: value || '' };
    setStates(updated);
  };

  const addLGA = () => {
    setLgas([...lgas, {
      lga: '',
      ec8aAccreditedVoters: '0',
      totalBVAS: '0',
      validVotes: '0',
      votesCast: '0',
      leadingParties: '',
      trackingNotes: ''
    }]);
  };

  const removeLGA = (index: number) => {
    setLgas(lgas.filter((_, i) => i !== index));
  };

  const updateLGA = (index: number, field: keyof LGAData, value: any) => {
    const updated = [...lgas];
    updated[index] = { ...updated[index], [field]: value || '' };
    setLgas(updated);
  };

  const saveLGAData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/election/state/${selectedState}/lgas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ lgas })
      });

      if (!response.ok) throw new Error('Failed to save LGA data');

      const data = await response.json();
      if (data.success) {
        toast.success(`LGA data saved for ${selectedState}`);
      }
    } catch (error) {
      console.error('Error saving LGA data:', error);
      toast.error(`Failed to save LGA data for ${selectedState}`);
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, {
      title: '',
      mainStatistic: '',
      description: '',
      colorTheme: 'blue'
    }]);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, field: keyof Highlight, value: any) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value || '' };
    setHighlights(updated);
  };

  const saveHighlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/election/state/${selectedState}/highlights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ highlights })
      });

      if (!response.ok) throw new Error('Failed to save highlights');

      const data = await response.json();
      if (data.success) {
        toast.success(`Key Highlights saved for ${selectedState}`);
      }
    } catch (error) {
      console.error('Error saving highlights:', error);
      toast.error(`Failed to save highlights for ${selectedState}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          Manage all election data displayed across the dashboard. Changes will be reflected immediately after saving.
        </AlertDescription>
      </Alert>

      {/* Initialize Data Alert */}
      {states.length === 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>No data found!</strong> Click "Initialize Election Data" to load default Anambra and Ondo state data.
            </div>
            <Button
              onClick={async () => {
                await initializeDefaultData();
                window.location.reload();
              }}
              disabled={loading}
              variant="default"
              className="ml-4"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Initialize Election Data
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Action: Restore Data */}
      {states.length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Quick Action:</strong> Need to restore Anambra and Ondo election data to defaults?
            </div>
            <Button
              onClick={async () => {
                if (confirm('This will restore Anambra and Ondo election data to defaults. Continue?')) {
                  setLoading(true);
                  try {
                    const response = await fetch(`${API_BASE}/election/force-reinitialize`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'Content-Type': 'application/json'
                      }
                    });

                    if (response.ok) {
                      toast.success('✅ Election data restored successfully!');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    } else {
                      const error = await response.json();
                      toast.error(`Failed to restore data: ${error.error || 'Unknown error'}`);
                    }
                  } catch (error: any) {
                    toast.error(`Error: ${error.message}`);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              disabled={loading}
              size="sm"
              variant="outline"
              className="ml-4"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Restore Data to Defaults
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="states" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="states">States Overview</TabsTrigger>
          <TabsTrigger value="details">State Details</TabsTrigger>
          <TabsTrigger value="highlights">Key Highlights</TabsTrigger>
          <TabsTrigger value="lgas">LGA Breakdown</TabsTrigger>
        </TabsList>

        {/* States Management Tab */}
        <TabsContent value="states" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage States</CardTitle>
              <CardDescription>
                Add or edit states shown in the Nigerian States Election Monitoring Overview table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          State
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Region
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Election Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {states.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No states added yet. Click "Add State" to begin.
                          </td>
                        </tr>
                      ) : (
                        states.map((state, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <Input
                                value={state.name || ''}
                                onChange={(e) => updateState(index, 'name', e.target.value)}
                                placeholder="e.g., Ondo"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={state.region || ''}
                                onChange={(e) => updateState(index, 'region', e.target.value)}
                                placeholder="e.g., South West"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={state.electionType || ''}
                                onChange={(e) => updateState(index, 'electionType', e.target.value)}
                                placeholder="e.g., Governorship"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={state.status || ''}
                                onChange={(e) => updateState(index, 'status', e.target.value)}
                                placeholder="e.g., Active"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeState(index)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button onClick={addState} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add State
                </Button>
                <Button onClick={saveStates} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save States
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* State Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select State to Edit</CardTitle>
              <CardDescription>
                Choose a state to manage its election data, candidates, and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {states.map((state) => (
                  <Button
                    key={state.name}
                    variant={selectedState === state.name ? 'default' : 'outline'}
                    onClick={() => setSelectedState(state.name)}
                  >
                    {state.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedState && (
            <>
              {/* Candidates Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidates - {selectedState}</CardTitle>
                  <CardDescription>
                    Manage candidates and their vote counts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Candidate Name</Label>
                          <Input
                            value={candidate.name || ''}
                            onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                            placeholder="e.g., Lucky Aiyedatiwa"
                          />
                        </div>
                        <div>
                          <Label>Party</Label>
                          <Input
                            value={candidate.party || ''}
                            onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                            placeholder="e.g., APC"
                          />
                        </div>
                        <div>
                          <Label>Votes</Label>
                          <Input
                            type="number"
                            value={candidate.votes ?? 0}
                            onChange={(e) => updateCandidate(index, 'votes', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Percentage</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={candidate.percentage ?? 0}
                            onChange={(e) => updateCandidate(index, 'percentage', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Color (hex)</Label>
                          <Input
                            value={candidate.color || ''}
                            onChange={(e) => updateCandidate(index, 'color', e.target.value)}
                            placeholder="#22c55e"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            onClick={() => removeCandidate(index)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addCandidate} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </CardContent>
              </Card>

              {/* Statistics Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Voter Statistics - {selectedState}</CardTitle>
                  <CardDescription>
                    Manage voter registration and vote count statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Registered Voters</Label>
                      <Input
                        type="number"
                        value={stats.registeredVoters ?? 0}
                        onChange={(e) => setStats({ ...stats, registeredVoters: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Accredited Voters</Label>
                      <Input
                        type="number"
                        value={stats.accreditedVoters ?? 0}
                        onChange={(e) => setStats({ ...stats, accreditedVoters: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Total Votes</Label>
                      <Input
                        type="number"
                        value={stats.totalVotes ?? 0}
                        onChange={(e) => setStats({ ...stats, totalVotes: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Valid Votes</Label>
                      <Input
                        type="number"
                        value={stats.validVotes ?? 0}
                        onChange={(e) => setStats({ ...stats, validVotes: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Rejected Votes</Label>
                      <Input
                        type="number"
                        value={stats.rejectedVotes ?? 0}
                        onChange={(e) => setStats({ ...stats, rejectedVotes: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Polling Units Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Polling Data - {selectedState}</CardTitle>
                  <CardDescription>
                    Manage polling unit and LGA reporting statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Polling Units</Label>
                      <Input
                        type="number"
                        value={polling.totalPollingUnits ?? 0}
                        onChange={(e) => {
                          const totalUnits = parseInt(e.target.value) || 0;
                          const uploaded = polling.uploadedResults || 0;
                          const percentage = totalUnits > 0 ? (uploaded / totalUnits) * 100 : 0;
                          setPolling({ ...polling, totalPollingUnits: totalUnits, uploadPercentage: percentage });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Uploaded Results</Label>
                      <Input
                        type="number"
                        value={polling.uploadedResults ?? 0}
                        onChange={(e) => {
                          const uploaded = parseInt(e.target.value) || 0;
                          const totalUnits = polling.totalPollingUnits || 0;
                          const percentage = totalUnits > 0 ? (uploaded / totalUnits) * 100 : 0;
                          setPolling({ ...polling, uploadedResults: uploaded, uploadPercentage: percentage });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Upload Percentage (Auto-calculated)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={polling.uploadPercentage ?? 0}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label>Total LGAs</Label>
                      <Input
                        type="number"
                        value={polling.totalLGAs ?? 0}
                        onChange={(e) => setPolling({ ...polling, totalLGAs: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Reporting LGAs</Label>
                      <Input
                        type="number"
                        value={polling.reportingLGAs ?? 0}
                        onChange={(e) => setPolling({ ...polling, reportingLGAs: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={saveStateData} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save {selectedState} Data
                </Button>
                <Button onClick={() => loadStateData(selectedState)} variant="outline" disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Data
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Key Highlights Tab */}
        <TabsContent value="highlights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select State for Key Highlights Management</CardTitle>
              <CardDescription>
                Choose a state to manage its key election highlights and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {states.map((state) => (
                  <Button
                    key={state.name}
                    variant={selectedState === state.name ? 'default' : 'outline'}
                    onClick={() => setSelectedState(state.name)}
                  >
                    {state.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedState && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Key Highlights - {selectedState}</CardTitle>
                  <CardDescription>
                    Manage the 3 highlight cards displayed on the dashboard (typically: Election Completion, Leading Candidate, Victory Margin)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {highlights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No highlights yet. Click "Add Highlight" to create highlight cards for this state.
                    </div>
                  ) : (
                    highlights.map((highlight, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm text-gray-700">Highlight #{index + 1}</h3>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeHighlight(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label>Highlight Title</Label>
                            <Input
                              value={highlight.title || ''}
                              onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                              placeholder="e.g., Election Upload Complete"
                            />
                          </div>
                          
                          <div>
                            <Label>Main Statistic</Label>
                            <Input
                              value={highlight.mainStatistic || ''}
                              onChange={(e) => updateHighlight(index, 'mainStatistic', e.target.value)}
                              placeholder="e.g., 99.97%"
                            />
                          </div>
                          
                          <div>
                            <Label>Color Theme</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={highlight.colorTheme || 'blue'}
                              onChange={(e) => updateHighlight(index, 'colorTheme', e.target.value)}
                            >
                              <option value="blue">Blue</option>
                              <option value="green">Green</option>
                              <option value="purple">Purple</option>
                              <option value="red">Red</option>
                              <option value="orange">Orange</option>
                              <option value="teal">Teal</option>
                            </select>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Input
                              value={highlight.description || ''}
                              onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                              placeholder="e.g., of Polling Units Tallied across all 18 LGAs in Ondo State with comprehensive data coverage"
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        <div className={`mt-3 bg-gradient-to-br ${
                          highlight.colorTheme === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200' :
                          highlight.colorTheme === 'green' ? 'from-green-50 to-green-100 border-green-200' :
                          highlight.colorTheme === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200' :
                          highlight.colorTheme === 'red' ? 'from-red-50 to-red-100 border-red-200' :
                          highlight.colorTheme === 'orange' ? 'from-orange-50 to-orange-100 border-orange-200' :
                          'from-teal-50 to-teal-100 border-teal-200'
                        } rounded-xl p-4 shadow-sm border`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              highlight.colorTheme === 'blue' ? 'bg-blue-600' :
                              highlight.colorTheme === 'green' ? 'bg-green-600' :
                              highlight.colorTheme === 'purple' ? 'bg-purple-600' :
                              highlight.colorTheme === 'red' ? 'bg-red-600' :
                              highlight.colorTheme === 'orange' ? 'bg-orange-600' :
                              'bg-teal-600'
                            }`}></div>
                            <h4 className={`font-bold text-sm ${
                              highlight.colorTheme === 'blue' ? 'text-blue-900' :
                              highlight.colorTheme === 'green' ? 'text-green-900' :
                              highlight.colorTheme === 'purple' ? 'text-purple-900' :
                              highlight.colorTheme === 'red' ? 'text-red-900' :
                              highlight.colorTheme === 'orange' ? 'text-orange-900' :
                              'text-teal-900'
                            }`}>
                              {highlight.title || 'Title Preview'}
                            </h4>
                          </div>
                          <p className={`text-sm ${
                            highlight.colorTheme === 'blue' ? 'text-blue-800' :
                            highlight.colorTheme === 'green' ? 'text-green-800' :
                            highlight.colorTheme === 'purple' ? 'text-purple-800' :
                            highlight.colorTheme === 'red' ? 'text-red-800' :
                            highlight.colorTheme === 'orange' ? 'text-orange-800' :
                            'text-teal-800'
                          }`}>
                            <span className="font-bold text-xl">{highlight.mainStatistic || '0'}</span> {highlight.description || 'Description preview'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={addHighlight} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Highlight
                    </Button>
                    <Button onClick={saveHighlights} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Highlights
                    </Button>
                    <Button onClick={() => loadStateData(selectedState)} variant="outline" disabled={loading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* LGA Breakdown Tab */}
        <TabsContent value="lgas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select State for LGA Management</CardTitle>
              <CardDescription>
                Choose a state to manage its Local Government Area (LGA) breakdown data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {states.map((state) => (
                  <Button
                    key={state.name}
                    variant={selectedState === state.name ? 'default' : 'outline'}
                    onClick={() => setSelectedState(state.name)}
                  >
                    {state.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedState && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>LGA Breakdown - {selectedState}</CardTitle>
                  <CardDescription>
                    Manage detailed election data for each Local Government Area in {selectedState}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lgas.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No LGA data yet. Click "Add LGA" to start adding Local Government Areas.
                    </div>
                  ) : (
                    lgas.map((lga, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm text-gray-700">LGA #{index + 1}</h3>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLGA(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label>LGA Name</Label>
                            <Input
                              value={lga.lga || ''}
                              onChange={(e) => updateLGA(index, 'lga', e.target.value)}
                              placeholder="e.g., AKOKO NORTH EAST"
                            />
                          </div>
                          
                          <div>
                            <Label>EC8A Accredited Voters</Label>
                            <Input
                              value={lga.ec8aAccreditedVoters || ''}
                              onChange={(e) => updateLGA(index, 'ec8aAccreditedVoters', e.target.value)}
                              placeholder="e.g., 31,600"
                            />
                          </div>
                          
                          <div>
                            <Label>Total BVAS</Label>
                            <Input
                              value={lga.totalBVAS || ''}
                              onChange={(e) => updateLGA(index, 'totalBVAS', e.target.value)}
                              placeholder="e.g., 31,187"
                            />
                          </div>
                          
                          <div>
                            <Label>Valid Votes</Label>
                            <Input
                              value={lga.validVotes || ''}
                              onChange={(e) => updateLGA(index, 'validVotes', e.target.value)}
                              placeholder="e.g., 30,970"
                            />
                          </div>
                          
                          <div>
                            <Label>Votes Cast</Label>
                            <Input
                              value={lga.votesCast || ''}
                              onChange={(e) => updateLGA(index, 'votesCast', e.target.value)}
                              placeholder="e.g., 31,441"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Leading Parties (with results)</Label>
                            <Input
                              value={lga.leadingParties || ''}
                              onChange={(e) => updateLGA(index, 'leadingParties', e.target.value)}
                              placeholder="1. Candidate Name (PARTY): 24,914 (80.45%)  2. Name (PARTY): 4,950 (15.98%)"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Tracking Notes</Label>
                            <Input
                              value={lga.trackingNotes || ''}
                              onChange={(e) => updateLGA(index, 'trackingNotes', e.target.value)}
                              placeholder="e.g., High APC dominance; track PU completion."
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={addLGA} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add LGA
                    </Button>
                    <Button onClick={saveLGAData} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save LGA Data
                    </Button>
                    <Button onClick={() => loadStateData(selectedState)} variant="outline" disabled={loading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

      </Tabs>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}
