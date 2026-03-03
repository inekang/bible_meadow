
import React from 'react';

const Meadow: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#2E3192] via-[#4A4EAD] to-[#6669D1] transition-colors duration-1000">
      {/* Sky Details - Stars */}
      <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-24 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
      <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse delay-150"></div>
      <div className="absolute top-16 right-1/4 w-1 h-1 bg-white/80 rounded-full animate-pulse delay-300"></div>
      <div className="absolute top-8 left-[60%] w-1 h-1 bg-white/80 rounded-full animate-pulse delay-500"></div>
      
      {/* Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Hill Layers */}
      <div className="absolute bottom-0 w-[140%] h-[60%] -left-[20%] rounded-[100%] opacity-20 translate-y-[25%] pointer-events-none bg-[#1A1C4F]"></div>
      <div className="absolute bottom-0 w-[160%] h-[45%] -left-[30%] rounded-[100%] opacity-30 translate-y-[35%] pointer-events-none bg-[#3B3E91]"></div>
      <div className="absolute bottom-0 w-[180%] h-[30%] -left-[40%] rounded-[100%] translate-y-[45%] pointer-events-none bg-[#5255BB]/40"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export default Meadow;
