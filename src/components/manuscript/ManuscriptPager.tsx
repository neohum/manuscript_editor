import { useState, useEffect } from 'react';
import { Manuscript } from '@/lib/react-korean-manuscript/components/Manuscript';
import { buildFormattedCells } from '@/lib/react-korean-manuscript/core/formatter';

interface ManuscriptPagerProps {
  text: string;
  cursorCell?: number | null;
  cursorSide?: 'left' | 'right';
  errorCells?: Set<number>;
  onCellClick?: (globalIndex: number, side: 'left' | 'right') => void;
  rows?: number; // Added dynamic row count option
}

export function ManuscriptPager({ 
  text, 
  cursorCell = null, 
  cursorSide = 'right', 
  errorCells = new Set(), 
  onCellClick,
  rows = 10 // Default to standard 10 rows
}: ManuscriptPagerProps) {
  const [totalPages, setTotalPages] = useState(1);
  const [activeRows, setActiveRows] = useState(rows);

  useEffect(() => {
    // Run an initial build with infinite rows to see exactly how many lines the text naturally requires
    const naturalCells = buildFormattedCells(text, { columns: 20, rows: 9999 });
    
    // Find the actual used cells by ignoring the trailing empty padding cells
    let lastUsedIndex = naturalCells.length - 1;
    while (lastUsedIndex >= 0 && naturalCells[lastUsedIndex] === '') {
      lastUsedIndex--;
    }
    
    const actualUsedCells = lastUsedIndex + 1;
    let computedRows = rows;

    if (rows === 0 || rows === -1) { 
      // Auto-rows mode: dynamically shrink or expand to fit exactly what is needed (min 3 rows)
      computedRows = Math.max(3, Math.ceil(actualUsedCells / 20));
      setActiveRows(computedRows);
    } else {
      setActiveRows(rows);
    }

    const cellsPerPage = 20 * computedRows;
    const pages = Math.max(1, Math.ceil(actualUsedCells / cellsPerPage));
    const maxCursorPage = cursorCell !== null ? Math.floor(cursorCell / cellsPerPage) + 1 : 1;
    
    setTotalPages(Math.max(pages, maxCursorPage));
  }, [text, cursorCell, rows]);

  return (
    <div className="flex flex-col gap-12 w-full max-w-[1500px]">
      {Array.from({ length: totalPages }).map((_, i) => (
        <div 
          key={i} 
          className="relative w-full shadow-xl bg-[#fffdf7] rounded-[1px] overflow-hidden pb-8 pt-4 px-2"
        >
          {/* Page Counter */}
          <div className="absolute top-[-24px] right-0 text-xs text-gray-500 font-mono">
            {i + 1} / {totalPages}
          </div>
          
          <Manuscript 
            text={text} 
            columns={20}
            rows={activeRows}
            cursorCell={cursorCell}
            cursorSide={cursorSide}
            errorCells={errorCells}
            pageIndex={i}
            showSpaceMarks={true}
            showRowNums={true}
            onCellClick={onCellClick}
          />
        </div>
      ))}
    </div>
  );
}
