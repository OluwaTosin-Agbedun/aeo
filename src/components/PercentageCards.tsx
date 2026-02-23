import React from 'react';

interface PercentageCardProps {
  percentage: string;
  state: string;
  variant: 'success' | 'warning';
}

function PercentageCard({ percentage, state, variant }: PercentageCardProps) {
  const bgColor = variant === 'success' ? 'bg-blue-500' : 'bg-orange-500';
  
  return (
    <div className={`${bgColor} text-white rounded-lg p-4 text-center min-w-20`}>
      <div className="text-2xl mb-1">{percentage}</div>
      <div className="text-sm">{state}</div>
    </div>
  );
}

export function PercentageCards() {
  return (
    <div className="flex gap-4">
      <PercentageCard percentage="100%" state="Oyo" variant="success" />
      <PercentageCard percentage="100%" state="Jigawa" variant="success" />
      <PercentageCard percentage="2%" state="Kano" variant="warning" />
    </div>
  );
}