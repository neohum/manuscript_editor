import React from 'react';
import { ManuscriptCell } from './ManuscriptCell';
import { useEditorStore } from '@/stores/editorStore';

interface ManuscriptPageProps {
  textSubset: string;
  startIndex: number;
  cursorPosition: number;
  pageIndex: number;
  totalPages: number;
  onCellClick?: (globalIndex: number) => void;
}

export function ManuscriptPage({
  textSubset,
  startIndex,
  cursorPosition,
  pageIndex,
  totalPages,
  onCellClick,
}: ManuscriptPageProps) {
  const { errorCells } = useEditorStore();
  const MAX_CHARS = 200;

  const cells = Array.from({ length: MAX_CHARS }).map((_, index) => {
    const globalIndex = startIndex + index;
    const char = textSubset[index] || '';
    const isActive = globalIndex === Math.max(0, cursorPosition - 1);
    const isError = errorCells.has(globalIndex);

    return (
      <ManuscriptCell
        key={`cell-${globalIndex}`}
        char={char}
        isActive={isActive}
        isError={isError}
        onClick={() => onCellClick?.(globalIndex)}
      />
    );
  });

  return (
    <div className="relative w-full aspect-[2/1] shadow-xl bg-[#fcfaf5] rounded-sm overflow-hidden p-2 flex flex-col justify-center max-w-4xl mx-auto">
      <div className="absolute top-2 right-4 text-xs text-gray-400 font-mono">
        {pageIndex + 1} / {totalPages}
      </div>
      
      {/* Container for the 20x10 Grid */}
      <div
        className="grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-10 border border-red-400 bg-red-400"
        style={{
          gap: '1px', // This creates the "lines" between cells
          padding: '1px',
        }}
      >
        {cells}
      </div>
    </div>
  );
}
