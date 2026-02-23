import React from 'react';
import { X, Calendar, MapPin, Users, Info, Building2, Vote, Briefcase } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Candidate {
  name: string;
  party: string;
  deputy?: string;
  additionalInfo?: string;
}

interface StateOverview {
  geoPolicalZone?: string;
  capital?: string;
  landmass?: string;
  lgas?: number;
  wards?: number;
  pollingUnits?: number;
}

interface ElectionTimeline {
  electionDate?: string;
  swearingInDate?: string;
}

interface IncumbentGovernor {
  name?: string;
  age?: number;
  party?: string;
}

interface EconomyData {
  overview?: string;
  keyActivities?: string[];
}

interface Election {
  id: string;
  state?: string;
  country?: string;
  region: string;
  electionType: string;
  date: string;
  status: 'upcoming' | 'completed' | 'ongoing';
  details?: string;
  description?: string;
  // Extended data for detailed briefs
  stateOverview?: StateOverview;
  electionTimeline?: ElectionTimeline;
  incumbentGovernor?: IncumbentGovernor;
  candidates?: Candidate[];
  economy?: EconomyData;
}

interface ElectionDetailsModalProps {
  election: Election | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ElectionDetailsModal: React.FC<ElectionDetailsModalProps> = ({ election, isOpen, onClose }) => {
  if (!isOpen || !election) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-white pr-12">
            Election Brief: {election.state || election.country}
          </h2>
          <Badge className={`mt-3 ${getStatusColor(election.status)}`}>
            <span className="capitalize">{election.status}</span>
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* State Overview */}
          {election.stateOverview && (
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">State Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">State</p>
                    <p className="font-semibold text-gray-900">{election.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Geo-Political Zone</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.geoPolicalZone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capital</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.capital}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Landmass</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.landmass}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Local Government Areas</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.lgas}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wards</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.wards}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Polling Units</p>
                    <p className="font-semibold text-gray-900">{election.stateOverview.pollingUnits?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Key Takeaway:</strong> {election.state} is a compact but politically active state with a well-defined administrative and electoral structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Election Timeline */}
          {election.electionTimeline && (
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Election Timeline</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Election Date</p>
                    <p className="font-semibold text-gray-900">{election.electionTimeline.electionDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Swearing-In Date</p>
                    <p className="font-semibold text-gray-900">{election.electionTimeline.swearingInDate}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    <strong>Key Takeaway:</strong> The election timeline allows for a clear transition period between voting and inauguration.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Incumbent Governor */}
          {election.incumbentGovernor && (
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Incumbent Governor</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Governor</p>
                    <p className="font-semibold text-gray-900">{election.incumbentGovernor.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age</p>
                    <p className="font-semibold text-gray-900">{election.incumbentGovernor.age}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Political Party</p>
                    <p className="font-semibold text-gray-900">{election.incumbentGovernor.party}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-800">
                    <strong>Key Takeaway:</strong> The incumbent governor is seeking continuity under the ruling {election.incumbentGovernor.party} administration.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Governorship Candidates */}
          {election.candidates && election.candidates.length > 0 && (
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Vote className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">Governorship Candidates & Parties</h3>
                </div>
                <div className="space-y-4">
                  {election.candidates.map((candidate, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-bold text-gray-900">{candidate.party}</p>
                      <p className="text-sm text-gray-700">
                        <strong>Governorship Candidate:</strong> {candidate.name}
                      </p>
                      {candidate.deputy && (
                        <p className="text-sm text-gray-700">
                          <strong>Deputy:</strong> {candidate.deputy}
                        </p>
                      )}
                      {candidate.additionalInfo && (
                        <p className="text-xs text-gray-600 mt-1">{candidate.additionalInfo}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Economy */}
          {election.economy && (
            <Card className="border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                  <h3 className="text-lg font-bold text-gray-900">Economy</h3>
                </div>
                {election.economy.overview && (
                  <p className="text-sm text-gray-700 mb-4">{election.economy.overview}</p>
                )}
                {election.economy.keyActivities && election.economy.keyActivities.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-2">Key Economic Activities</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {election.economy.keyActivities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-xs text-teal-800">
                    <strong>Key Takeaway:</strong> Agriculture remains the backbone of {election.state}'s economy and strongly influences livelihoods and voter priorities.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback for elections without detailed data */}
          {!election.stateOverview && !election.electionTimeline && (
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Election Date</h3>
                    <p className="text-gray-700 text-lg font-medium">{election.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Region</h3>
                    <p className="text-gray-700">{election.region}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Election Type</h3>
                    <p className="text-gray-700">{election.electionType}</p>
                  </div>
                </div>

                {(election.description || election.details) && (
                  <div className="flex items-start gap-3 pt-2 border-t">
                    <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {election.description || election.details}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};