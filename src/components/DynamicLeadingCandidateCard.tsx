import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Vote, ChevronDown } from 'lucide-react';

interface Candidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

interface CandidateData {
  candidate: string;
  party: string;
  votes: string;
  percentage: string;
  trackingNotes: string;
  partyColor: string;
}

interface DynamicLeadingCandidateCardProps {
  stateName: string;
  candidates: Candidate[];
}

export function DynamicLeadingCandidateCard({ stateName, candidates }: DynamicLeadingCandidateCardProps) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const candidatesData: CandidateData[] = candidates.map((c) => ({
    candidate: c.name,
    party: c.party,
    votes: c.votes.toLocaleString(),
    percentage: `${c.percentage.toFixed(2)}%`,
    trackingNotes: c.percentage > 50 ? 'Leading candidate' : c.percentage > 20 ? 'Strong contender' : c.votes === 0 ? 'Pre-election - No results yet' : 'Trailing',
    partyColor: c.color
  }));

  const leadingCandidate = candidatesData[0];
  const isPreElection = candidates.every(c => c.votes === 0);

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isPopupVisible) {
        hidePopup();
      } else {
        showPopup();
      }
    }
    if (e.key === 'Escape') {
      hidePopup();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        cardRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !cardRef.current.contains(event.target as Node)
      ) {
        hidePopup();
      }
    };

    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

  if (!leadingCandidate) {
    return null;
  }

  return (
    <>
      <div 
        className="relative"
        onMouseEnter={showPopup}
        onMouseLeave={hidePopup}
      >
        <Card 
          ref={cardRef}
          className="border-green-200 bg-green-50 hover:bg-green-100 transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-visible border rounded-xl shadow-sm h-full"
          onClick={showPopup}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Leading candidate detailed results"
          aria-expanded={isPopupVisible}
          aria-describedby="candidate-popup"
        >
        <Badge className="absolute -top-2 -right-2 bg-green-600 shadow-md">
          View full election analysis
        </Badge>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-gray-800">
            {isPreElection ? 'Leading Candidates' : 'Leading Candidate'}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4 text-green-600" />
            <ChevronDown className={`h-3 w-3 text-green-600 transition-transform duration-200 ${
              isPopupVisible ? 'rotate-180' : ''
            }`} />
          </div>
        </CardHeader>
        <CardContent>
          {isPreElection ? (
            <>
              <div className="text-xl font-bold text-gray-900 mb-1">Pre-Election</div>
              <p className="text-xs text-gray-600 mb-2">
                {candidatesData.length} candidates registered - Results pending
              </p>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-gray-900 mb-1">{leadingCandidate.percentage}</div>
              <p className="text-xs text-gray-600 mb-2">{leadingCandidate.candidate} ({leadingCandidate.party}) preliminary count</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Popup Card */}
      {isPopupVisible && (
        <div
          ref={popupRef}
          id="candidate-popup"
          className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[460px] max-w-[95vw] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
          style={{
            top: `calc(100% - 20px)`,
            left: '10px',
            right: '10px',
            maxHeight: '400px',
            overflow: 'auto'
          }}
        >
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-sm mb-1">
              {isPreElection 
                ? `${stateName} Election - Registered Candidates` 
                : `${stateName} Election Results (Top ${Math.min(3, candidatesData.length)} Candidates)`
              }
            </h3>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-gray-900 text-xs">Candidate</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-900 text-xs">Party</th>
                  <th className="px-3 py-2 text-right font-bold text-gray-900 text-xs">Votes</th>
                  <th className="px-3 py-2 text-right font-bold text-gray-900 text-xs">Percentage</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-900 text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidatesData.slice(0, 3).map((candidate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-medium text-xs">
                      {candidate.candidate}
                    </td>
                    <td className="px-3 py-2">
                      <Badge 
                        className="text-white text-xs font-medium"
                        style={{ backgroundColor: candidate.partyColor }}
                      >
                        {candidate.party}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-medium text-xs">
                      {candidate.votes}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-bold text-xs">
                      {candidate.percentage}
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-xs">
                      {candidate.trackingNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
