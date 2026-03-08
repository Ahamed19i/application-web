
import React from 'react';

export const NetworkBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 blur-[120px] rounded-full animate-pulse"></div>
      
      {/* Secondary Glow */}
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-accent-secondary/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-accent-primary/5 blur-[150px] rounded-full"></div>
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.15]" style={{ 
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>
    </div>
  );
};
