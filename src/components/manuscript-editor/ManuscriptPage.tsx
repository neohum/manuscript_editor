import React from 'react';
import { ManuscriptCell } from './ManuscriptCell';

interface ManuscriptPageProps {
  textSubset: string;
  startIndex: number;
  cursorPosition: number;
}

export function ManuscriptPage({
  textSubset,
  startIndex,
  cursorPosition,
}: ManuscriptPageProps) {
  // A standard page is 200 characters (20 columns x 10 rows)
  const MAX_CHARS = 200;

  // We explicitly render 200 cells.
  const cells = Array.from({ length: MAX_CHARS }).map((_, index) => {
    const globalIndex = startIndex + index;
    const char = textSubset[index] || '';
    const isActive = globalIndex === cursorPosition;

    return (
      <ManuscriptCell
        key={`cell-${globalIndex}`}
        char={char}
        isActive={isActive}
      />
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto my-8 bg-paper relative shadow-md p-4 flex justify-center border border-gray-200">
      {/* Container for the 20x10 Grid */}
      <div
        className="grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(10,minmax(0,1fr))] w-full bg-red-300 gap-0 @container"
        style={{
          border: '2px solid #fca5a5', // matched to red-300 container
        }}
      >
        {cells}
      </div>
    </div>
  );
}
