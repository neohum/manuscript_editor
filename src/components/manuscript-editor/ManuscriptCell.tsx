import React from 'react';

interface ManuscriptCellProps {
  char: string;
  isActive: boolean; // Indicates if this cell has the cursor
}

export function ManuscriptCell({ char, isActive }: ManuscriptCellProps) {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square text-[3.8cqw] font-serif line-height-[1] whitespace-nowrap overflow-hidden text-gray-800 bg-white shadow-sm border-r border-b border-gray-200 box-border">
      {/* The actual character */}
      <span className="z-10 select-none pointer-events-none">
        {char === '\n' ? '' : char}
      </span>

      {/* Blinking Cursor Indicator */}
      {isActive && (
        <span className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 animate-pulse z-0" />
      )}
    </div>
  );
}
