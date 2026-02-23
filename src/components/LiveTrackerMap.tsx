import React from 'react';

export function LiveTrackerMap() {
  return (
    <div className="relative">
      {/* Nigeria Map SVG - Simplified blue silhouette */}
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-64"
      >
        {/* Nigeria country outline in blue */}
        <path 
          d="M 60 120 
             L 80 110 L 120 105 L 160 100 L 200 95 L 240 100 L 280 105 L 320 115 L 340 130
             L 350 150 L 345 170 L 340 190 L 330 210 L 315 225 L 295 235 L 275 240
             L 250 245 L 220 250 L 190 245 L 160 240 L 130 235 L 100 225 L 80 210
             L 65 190 L 55 170 L 50 150 L 55 130 Z" 
          fill="#4A90E2" 
          stroke="#2E5FA8" 
          strokeWidth="2"
        />
        
        {/* State boundaries - lighter blue lines */}
        <g stroke="#6BA3F5" strokeWidth="1" fill="none">
          {/* Horizontal dividing lines */}
          <path d="M 80 140 L 320 145" />
          <path d="M 90 170 L 310 175" />
          <path d="M 100 200 L 300 205" />
          
          {/* Vertical dividing lines */}
          <path d="M 120 110 L 115 240" />
          <path d="M 160 105 L 155 245" />
          <path d="M 200 100 L 195 250" />
          <path d="M 240 105 L 235 245" />
          <path d="M 280 110 L 275 240" />
        </g>
        
        {/* Highlighted states */}
        {/* Oyo - Southwest */}
        <circle cx="140" cy="180" r="6" fill="#1E90FF" className="animate-pulse" />
        <text x="140" y="195" textAnchor="middle" className="text-xs fill-white">OYO</text>
        
        {/* Jigawa - North */}
        <circle cx="220" cy="130" r="6" fill="#1E90FF" className="animate-pulse" />
        <text x="220" y="145" textAnchor="middle" className="text-xs fill-white">JIGAWA</text>
        
        {/* Kano - North */}
        <circle cx="200" cy="140" r="6" fill="#FF6B6B" className="animate-pulse" />
        <text x="200" y="155" textAnchor="middle" className="text-xs fill-white">KANO</text>
      </svg>
      
      {/* Progress bar at bottom */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: '67%'}}></div>
        </div>
      </div>
    </div>
  );
}