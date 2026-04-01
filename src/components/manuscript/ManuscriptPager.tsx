import { useState, useEffect, useRef } from 'react';
import { Manuscript } from '@/lib/react-korean-manuscript/components/Manuscript';
import { buildFormattedCells } from '@/lib/react-korean-manuscript/core/formatter';

interface ManuscriptPagerProps {
  text: string;
  cursorCell?: number | null;
  cursorSide?: 'left' | 'right';
  errorCells?: Set<number>;
  errorMessages?: Record<number, string>;
  onCellClick?: (globalIndex: number, side: 'left' | 'right') => void;
  rows?: number; // Added dynamic row count option
  showSpaceMarks?: boolean;
  showErrors?: boolean;
  renderPageToolbar?: (pageIndex: number) => React.ReactNode;
}

export function ManuscriptPager({ 
  text, 
  cursorCell = null, 
  cursorSide = 'right', 
  errorCells = new Set(), 
  errorMessages = {},
  onCellClick,
  rows = 10, // Default to standard 10 rows
  showSpaceMarks = true,
  showErrors = true,
  renderPageToolbar
}: ManuscriptPagerProps) {
  const [totalPages, setTotalPages] = useState(1);
  const [activeRows, setActiveRows] = useState(rows);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const currentPageIndex = cursorCell !== null ? Math.floor(cursorCell / cellsPerPage) : 0;
    
    setTotalPages(Math.max(pages, currentPageIndex + 1));
    setActivePageIndex(currentPageIndex);
  }, [text, cursorCell, rows]);

  // Auto-scroll to active page when it changes
  useEffect(() => {
    const el = pageRefs.current[activePageIndex];
    if (el) {
      // Use 'nearest' to avoid unnecessary jumping if already in view
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activePageIndex]);

  // Ensure refs array is correctly sized
  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, totalPages);
  }, [totalPages]);

  return (
    <div className="flex flex-col gap-12 w-full max-w-[1500px]">
      {Array.from({ length: totalPages }).map((_, i) => (
        <div 
          key={i}
          className="relative w-full flex flex-col mb-10"
        >
          {renderPageToolbar?.(i)}
          <div
            ref={(el) => { pageRefs.current[i] = el; }}
            className="relative w-full shadow-xl bg-[#fffdf7] rounded-[1px] overflow-x-auto pb-8 pt-4 px-2 mt-2"
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
              errorCells={showErrors ? errorCells : new Set()}
              errorMessages={showErrors ? errorMessages : {}}
              pageIndex={i}
              showSpaceMarks={showSpaceMarks}
              showRowNums={true}
              onCellClick={onCellClick}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
