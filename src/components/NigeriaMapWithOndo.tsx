import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { OndoStateDetailPanel } from './OndoStateDetailPanel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import nigeriaMapWithOndo from 'figma:asset/dcf1de52059ac4b02937a1fdbdf247bbd0f7c656.png';
import nigeriaMapWithAnambra from 'figma:asset/37d26fcb6dd5c5eb5b88ac10cc05300a3f99c5c7.png';

interface NigeriaMapWithOndoProps {
  onOndoClick?: () => void;
}

export const NigeriaMapWithOndo = React.memo(function NigeriaMapWithOndo({ onOndoClick }: NigeriaMapWithOndoProps = {}) {
  const [showDetail, setShowDetail] = useState(false);

  const handleOndoClick = () => {
    setShowDetail(true);
    if (onOndoClick) {
      onOndoClick();
    }
  };

  useEffect(() => {
    // Load Flourish embed script
    const script = document.createElement('script');
    script.src = 'https://public.flourish.studio/resources/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-md relative">
        <div className="relative bg-white p-4 md:p-8">
          {/* Nigeria Map Visualization */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-5xl">
              <ImageWithFallback 
                src={nigeriaMapWithAnambra}
                alt="Map of Nigeria showing all 36 states and Federal Capital Territory with Anambra State highlighted in green and Ondo State in blue for election monitoring coverage - Anambra Election is being tracked"
                className="w-full h-auto object-contain rounded-lg shadow-lg"
                style={{ maxHeight: '700px' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Panel */}
      {showDetail && (
        <OndoStateDetailPanel onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
});