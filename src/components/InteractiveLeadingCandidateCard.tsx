import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Vote, ChevronDown } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CandidateData {
  candidate: string;
  party: string;
  votes: string;
  percentage: string;
  trackingNotes: string;
  partyColor: string;
}

export function InteractiveLeadingCandidateCard() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [candidatesData, setCandidatesData] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCandidatesData();
  }, []);

  const loadCandidatesData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/election/state/Ondo`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.candidates) {
          const transformed: CandidateData[] = data.data.candidates.map((c: any) => ({
            candidate: c.name,
            party: c.party,
            votes: c.votes.toLocaleString(),
            percentage: `${c.percentage.toFixed(2)}%`,
            trackingNotes: c.percentage > 50 ? 'Leading candidate' : c.percentage > 20 ? 'Strong contender' : 'Trailing',
            partyColor: c.color
          }));
          setCandidatesData(transformed);
        }
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePopupPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Position popup within the card's boundary
      setPopupPosition({
        top: rect.bottom + scrollY - 20, // Overlap slightly with card bottom
        left: rect.left + 10 // Small margin from left edge
      });
    }
  };

  const showPopup = () => {
    updatePopupPosition();
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-gray-800">Leading Candidate</CardTitle>
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4 text-green-600" />
            <ChevronDown className={`h-3 w-3 text-green-600 transition-transform duration-200 ${
              isPopupVisible ? 'rotate-180' : ''
            }`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-gray-900 mb-1">72.74%</div>
          <p className="text-xs text-gray-600 mb-2">Lucky Aiyedatiwa (APC) preliminary count</p>
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
              Ondo 2025 Election Results (Top 3 Candidates)
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
                  <th className="px-3 py-2 text-left font-bold text-gray-900 text-xs">Tracking Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidatesData.map((candidate, index) => (
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