import React from 'react';
import './Manuscript.css';
import { buildFormattedCells, DEFAULT_COLUMNS, DEFAULT_ROWS } from '../core/formatter';
import { SMALL_PUNCT, EXCL_PUNCT } from '../core/constants';
import type { ManuscriptProps, FormattedCell, OverflowPunctCell } from '../types';

const EXCL_PUNCT_SET = EXCL_PUNCT;

export function Manuscript({
  text,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  showSpaceMarks = false,
  cursorCell = null,
  cursorSide = 'right',
  onCellClick = null,
  dblQuoteInit = 0,
  sglQuoteInit = 0,
  showRowNums = false,
  errorCells = new Set<number>(),
  errorMessages = {},
  highlightCells = null,
  pageIndex = null,
}: ManuscriptProps): React.ReactElement {
  const blockSize = columns * rows;
  const formattedCells = buildFormattedCells(text, { dblQuoteInit, sglQuoteInit, columns, rows });

  const renderCell = (cell: FormattedCell, index: number): React.ReactElement => {
    const hasCursor = cursorCell === index;
    const handleClick = onCellClick
      ? (e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const clickedLeft = (e.clientX - rect.left) < rect.width / 2;
          onCellClick(index, clickedLeft ? 'left' : 'right');
        }
      : undefined;
    const cursorClass = hasCursor
      ? (cursorSide === 'left' ? ' cell-cursor-left' : ' cell-cursor')
      : '';
    const isRowEnd = (index + 1) % columns === 0;
    const rowEndClass = isRowEnd ? ' cell-row-end' : '';
    const errorClass = errorCells.has(index) ? ' cell-spell-error group' : '';
    const hlClass = (highlightCells && highlightCells.has(index)) ? ' cell-tts-highlight' : '';
    const cellTitle = errorMessages[index] || undefined;

    const TooltipNode = cellTitle && errorCells.has(index) ? (
      <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-1 w-max max-w-[240px] bg-rose-600/95 text-white font-sans text-[13px] leading-snug tracking-tight px-3 py-2 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 z-[99] pointer-events-none text-center whitespace-pre-wrap font-medium">
        {cellTitle}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-rose-600/95"></div>
      </div>
    ) : null;

    const buildCellElement = (): React.ReactElement => {
    const hlClass = (highlightCells && highlightCells.has(index)) ? ' cell-tts-highlight' : '';
    const cellTitle = errorMessages[index] || undefined;

    // overflow punct / quote → 팬텀 셀
    if (typeof cell === 'object' && cell !== null && 'char' in cell) {
      const oc = cell as OverflowPunctCell;
      const opChar = oc.overflowPunct || '';
      const oqChar = oc.overflowQuote || '';
      const isExclOverflow = EXCL_PUNCT_SET.has(opChar);
      const baseIsSmallPunct = SMALL_PUNCT.has(oc.char);
      const basePunctClass = baseIsSmallPunct ? ' cell-punct' : '';
      return (
        <div
          key={index}
          className={`manuscript-cell cell-overflow-punct${basePunctClass}${cursorClass}${rowEndClass}${errorClass}${hlClass}`}
          onClick={handleClick}
          title={cellTitle}
        >
          {baseIsSmallPunct
            ? <span className="punct-char">{oc.char}</span>
            : oc.char}
          {(opChar || oqChar) && (
            <div className="overflow-phantom-cell">
              {opChar && (
                isExclOverflow
                  ? <span className="phantom-excl">{opChar}</span>
                  : <span className="punct-char">{opChar}</span>
              )}
              {oqChar && <span className="punct-char-open-quote">{oqChar}</span>}
            </div>
          )}
        </div>
      );
    }

    // 말줄임표
    if (typeof cell === 'object' && cell !== null && 'ellipsis' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-ellipsis${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          <span className="ellipsis-char">{cell.ellipsis}</span>
        </div>
      );
    }

    // 마침표/쉼표 + 닫는 따옴표 합침 셀
    if (typeof cell === 'object' && cell !== null && 'punctWithQuote' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-punct${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          <span className="punct-char">{cell.punct}</span>
          <span className="punct-char-close-quote">{cell.quote}</span>
        </div>
      );
    }

    // 느낌표·물음표 (overflow punct/quote 포함 가능)
    if (typeof cell === 'object' && cell !== null && 'excl' in cell) {
      const exclCell = cell as any;
      const opChar = exclCell.overflowPunct || '';
      const oqChar = exclCell.overflowQuote || '';
      return (
        <div key={index} className={`manuscript-cell cell-excl cell-overflow-punct${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          {exclCell.excl}
          {(opChar || oqChar) && (
            <div className="overflow-phantom-cell">
              {opChar && (
                EXCL_PUNCT_SET.has(opChar)
                  ? <span className="phantom-excl">{opChar}</span>
                  : <span className="punct-char">{opChar}</span>
              )}
              {oqChar && <span className="punct-char-open-quote">{oqChar}</span>}
            </div>
          )}
        </div>
      );
    }

    // 자동 빈 칸
    if (typeof cell === 'object' && cell !== null && 'autoBlank' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-auto-blank${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle} />
      );
    }

    // 언더플로우 빈 칸
    if (typeof cell === 'object' && cell !== null && 'underflow' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-auto-blank${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle} />
      );
    }

    // 들여쓰기 칸
    if (typeof cell === 'object' && cell !== null && 'indent' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-indent${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          {showSpaceMarks && <span className="indent-mark">↵</span>}
        </div>
      );
    }

    // 따옴표
    if (typeof cell === 'object' && cell !== null && 'quoteChar' in cell) {
      const qClass = cell.isOpen ? ' cell-punct-open-quote' : ' cell-punct-close-quote';
      const qSpanClass = cell.isOpen ? 'punct-char-open-quote' : 'punct-char-close-quote';
      return (
        <div key={index} className={`manuscript-cell${qClass}${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          <span className={qSpanClass}>{cell.quoteChar}</span>
        </div>
      );
    }

    // 괄호 (여는 괄호: 우상단, 닫는 괄호: 좌상단)
    if (typeof cell === 'object' && cell !== null && 'bracketChar' in cell) {
      const bClass = cell.isOpen ? ' cell-punct-open-quote' : ' cell-punct-close-quote';
      const bSpanClass = cell.isOpen ? 'punct-char-open-quote' : 'punct-char-close-quote';
      return (
        <div key={index} className={`manuscript-cell${bClass}${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          <span className={bSpanClass}>{cell.bracketChar}</span>
        </div>
      );
    }

    // 영문자 2자 1칸
    if (typeof cell === 'object' && cell !== null && 'double' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-double${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          <span className="double-char">{cell.double}</span>
        </div>
      );
    }

    // 단독 알파벳 1칸
    if (typeof cell === 'object' && cell !== null && 'single' in cell) {
      return (
        <div key={index} className={`manuscript-cell cell-alpha-single${cursorClass}${rowEndClass}${errorClass}${hlClass}`} onClick={handleClick} title={cellTitle}>
          {cell.single}
        </div>
      );
    }

    // 마침표·쉼표 일반 처리
    const isSmallPunct = typeof cell === 'string' && SMALL_PUNCT.has(cell);
    return (
      <div
        key={index}
        className={`manuscript-cell${isSmallPunct ? ' cell-punct' : ''}${cursorClass}${rowEndClass}${errorClass}${hlClass}`}
        onClick={handleClick}
        title={cellTitle}
      >
        {cell === ' '
          ? (showSpaceMarks ? <span className="space-mark-v">v</span> : '')
          : isSmallPunct
            ? <span className="punct-char">{cell as string}</span>
            : (cell as string)}
      </div>
    );
  };

  const element = buildCellElement() as React.ReactElement<any>;
    
    // Inject the custom tooltip and strip the native title safely
    return React.cloneElement(
      element,
      { title: undefined },
      ...React.Children.toArray(element.props.children),
      TooltipNode
    );
  };

  // 블록 단위로 분할
  const pageBlocks: FormattedCell[][] = [];
  for (let i = 0; i < formattedCells.length; i += blockSize) {
    pageBlocks.push(formattedCells.slice(i, i + blockSize));
  }

  const blocksToRender =
    pageIndex !== null && pageIndex !== undefined
      ? (pageBlocks[pageIndex] ? [pageBlocks[pageIndex]] : [[]])
      : pageBlocks;

  return (
    <div className="manuscript-wrapper">
      {blocksToRender.map((blockCells, localIdx) => {
        const actualPageIndex =
          pageIndex !== null && pageIndex !== undefined ? pageIndex : localIdx;
        const globalIndexOffset = actualPageIndex * blockSize;
        return (
          <div key={`page-${actualPageIndex}`} className="manuscript-page-block">
            <div className="relative w-full">
              {showRowNums && (
                <div className="manuscript-row-nums">
                  {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="manuscript-row-num">{i + 1}</div>
                  ))}
                </div>
              )}
              <div
                className="manuscript-grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  // We let CSS Grid auto-size the rows based on the cells' aspect-ratio: 1!
                }}
              >
                {blockCells.map((cell, i) => renderCell(cell, globalIndexOffset + i))}
              </div>
            </div>
            <div className="manuscript-page-num">- {actualPageIndex + 1} -</div>
          </div>
        );
      })}
    </div>
  );
}

export default Manuscript;
