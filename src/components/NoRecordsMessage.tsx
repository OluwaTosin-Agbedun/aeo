import React from 'react';
import { AlertCircle, Database } from 'lucide-react';
import { Card } from './ui/card';

interface NoRecordsMessageProps {
  stateName: string;
  statesWithData?: string[];
}

export function NoRecordsMessage({ stateName, statesWithData = [] }: NoRecordsMessageProps) {
  // Format the list of states with data
  const getStatesText = () => {
    if (statesWithData.length === 0) return 'available states';
    if (statesWithData.length === 1) return statesWithData[0];
    if (statesWithData.length === 2) return `${statesWithData[0]} and ${statesWithData[1]}`;
    
    const lastState = statesWithData[statesWithData.length - 1];
    const otherStates = statesWithData.slice(0, -1).join(', ');
    return `${otherStates}, and ${lastState}`;
  };

  return (
    <Card className="p-4 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 mb-0">
      <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-6">
        <div className="flex justify-center">
          <div className="bg-yellow-100 p-4 md:p-6 rounded-full">
            <Database className="w-12 h-12 md:w-16 md:h-16 text-yellow-600" />
          </div>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            <h3 className="text-xl md:text-2xl text-gray-900">No Records Available</h3>
          </div>
          
          <p className="text-base md:text-lg text-gray-700">
            Election monitoring data for <span className="font-semibold text-blue-700">{stateName} State</span> is currently not available.
          </p>
          
          <p className="text-sm md:text-base text-gray-600">
            {statesWithData.length > 0 ? (
              <>
                The Athena Election Observatory currently has detailed tracking data, live statistics, and key insights available for <span className="font-semibold">{getStatesText()} State{statesWithData.length > 1 ? 's' : ''}</span>.
              </>
            ) : (
              <>
                The Athena Election Observatory is actively monitoring elections across Nigeria. 
                Detailed tracking data will be available as elections are monitored and data is collected.
              </>
            )}
          </p>
        </div>

        {statesWithData.length > 0 && (
          <div className="pt-2 md:pt-4">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 md:px-6 md:py-3">
              <p className="text-xs md:text-sm text-blue-800">
                <strong>Tip:</strong> Select <span className="font-semibold">{statesWithData.length === 1 ? statesWithData[0] : 'one of the states above'}</span> to view comprehensive election monitoring data
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}