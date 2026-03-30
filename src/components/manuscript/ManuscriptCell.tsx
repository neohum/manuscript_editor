import React from 'react';

interface ManuscriptCellProps {
  char: string;
  isActive: boolean;
  isError?: boolean;
  onClick?: () => void;
}

export function ManuscriptCell({ char, isActive, isError = false, onClick }: ManuscriptCellProps) {
  let bgClass = "bg-white";
  if (isError) bgClass = "bg-red-100";
  
  return (
    <div 
      className={`relative flex items-center justify-center w-full h-full aspect-square cursor-pointer transition-colors ${bgClass}`}
      onClick={onClick}
    >
      <span className={`z-10 select-none pointer-events-none font-serif text-gray-800 ${isError ? 'text-red-700 font-bold' : ''}`}>
        {char === '\n' ? '' : char}
      </span>

      {/* Blinking Block Cursor Indicator */}
      {isActive && (
        <span className="absolute inset-0 bg-amber-500/30 border-2 border-amber-500 animate-pulse z-0" />
      )}
    </div>
  );
}
