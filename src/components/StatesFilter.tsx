import React from 'react';
import { MapPin, X } from 'lucide-react';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

interface StatesFilterProps {
  selectedState: string | null;
  onStateSelect: (state: string) => void;
}

export function StatesFilter({ selectedState, onStateSelect }: StatesFilterProps) {
  const clearSelection = () => {
    onStateSelect('');
  };

  return (
    <div className="space-y-2 md:space-y-6 pb-0">
      <div className="text-center">
        <h2 className="mb-1 md:mb-2 text-lg md:text-2xl lg:text-[32px] font-bold">Filter by State</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-xs md:text-base lg:text-[18px] px-2">
          Select a state to view detailed election monitoring data
        </p>
      </div>

      {/* Select Control */}
      <Card className="p-3 md:p-6 bg-white shadow-md">
        <div className="flex flex-col gap-4">
          {/* Dropdown Select */}
          <div className="w-full max-w-md mx-auto">
            <Select value={selectedState || ''} onValueChange={onStateSelect}>
              <SelectTrigger className="h-12 bg-gray-50 border-gray-300">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state} State
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filter */}
          {selectedState && (
            <div className="mt-2 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filter:</span>
                <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {selectedState} State
                  <button
                    onClick={clearSelection}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Info Banner */}
      <Card className="p-2 md:p-4 bg-blue-50 border-blue-200">
        <p className="text-xs md:text-sm text-blue-800 text-center">
          <strong>Note:</strong> Comprehensive election monitoring data is currently available for <strong>Anambra State (Nov 8, 2025)</strong> and Ondo State (completed)
        </p>
      </Card>
    </div>
  );
}