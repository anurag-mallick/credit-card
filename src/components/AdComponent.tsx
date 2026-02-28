'use client';

import { useEffect } from 'react';

interface AdComponentProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable Google AdSense Component
 * Properly handles initialization in hydration-heavy Next.js apps.
 */
export default function AdComponent({ slot, format = 'auto', style, className }: AdComponentProps) {
  useEffect(() => {
    // Prevent multiple initializations in dev/strict mode
    const pushAd = () => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Silently fail if AdBlock is active or script not loaded
        console.warn('AdSense notice: Ad push failed (usual for AdBlockers or pending verification)');
      }
    };

    // Small delay to ensure script availability
    const timer = setTimeout(pushAd, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("ad-container w-full overflow-hidden", className)}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-9092007033496792"
        data-ad-slot={slot || "7402035255"} // Generic placeholder slot if specific one not available
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Helper for class merging inside the component if needed
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
