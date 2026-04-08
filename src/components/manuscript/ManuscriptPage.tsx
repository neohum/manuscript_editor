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

  const rows = [];
  for (let r = 0; r < 10; r++) {
    const rowCells = [];
    for (let c = 0; c < 20; c++) {
      const globalIndex = startIndex + r * 20 + c;
      const char = textSubset[r * 20 + c] || '';
      const isActive = globalIndex === Math.max(0, cursorPosition - 1);
      const isError = errorCells.has(globalIndex);

      rowCells.push(
        <td key={`cell-${globalIndex}`} className="p-0 border border-red-400 w-[5%] h-[10%]">
          <ManuscriptCell
            char={char}
            isActive={isActive}
            isError={isError}
            onClick={() => onCellClick?.(globalIndex)}
          />
        </td>
      );
    }
    rows.push(<tr key={`row-${r}`} className="h-[10%]">{rowCells}</tr>);
  }

  return (
    <div className="relative w-full aspect-[2/1] shadow-xl bg-[#fcfaf5] rounded-sm overflow-hidden p-2 flex flex-col justify-center max-w-4xl mx-auto">
      <div className="absolute top-2 right-4 text-xs text-gray-400 font-mono">
        {pageIndex + 1} / {totalPages}
      </div>
      
      <div className="flex flex-row w-full h-full mt-3">
        {/* Left Margin Row Numbers */}
        <div className="flex flex-col w-5 h-full shrink-0 font-serif text-[10px] text-gray-400 select-none pr-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`left-num-${i}`} className="flex-1 flex items-center justify-end">
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Container for the 20x10 Grid -> Table */}
        <table className="flex-1 h-full border-collapse table-fixed bg-white border border-red-400">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  );
}
