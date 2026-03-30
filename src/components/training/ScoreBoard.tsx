"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { diffChars } from 'diff';
import { ManuscriptPager } from '@/components/manuscript/ManuscriptPager';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';

type ScoreResult = {
  score: number;
  misses: number;
  ruleViolationsCount: number;
};

export function ScoreBoard({ result, targetContent, submittedContent, onRetry }: { 
  result: ScoreResult | null, 
  targetContent: string, 
  submittedContent: string,
  onRetry: () => void 
}) {
  const errorCells = useMemo(() => {
    if (!targetContent || !submittedContent) return new Set<number>();
    
    // Clean trailing whitespace diff noise
    const diffs = diffChars(targetContent.trimEnd(), submittedContent.trimEnd());
    const errSet = new Set<number>();
    
    // We only care about matching against the user's submitted string cells
    const { charToCell } = buildCursorMaps(submittedContent);
    let submittedIndex = 0;
    
    diffs.forEach((part) => {
      // Extra characters or Wrong characters typed instead of actual
      if (part.added) {
        for (let i = 0; i < (part.count || 0); i++) {
          const cellIdx = charToCell[submittedIndex + i];
          if (cellIdx !== undefined) errSet.add(cellIdx);
        }
        submittedIndex += (part.count || 0);
      } else if (part.removed) {
        // Missing letters logic! The user forgot to type letters here.
        // Let's highlight the cell precisely where it was expected (the current cursor position conceptually)
        const cellIdx = charToCell[Math.min(submittedIndex, Math.max(0, charToCell.length - 1))];
        if (cellIdx !== undefined) errSet.add(cellIdx);
      } else {
        // Correct text, move the cursor forward normally
        submittedIndex += (part.count || 0);
      }
    });

    return errSet;
  }, [targetContent, submittedContent]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-100/95 backdrop-blur-md overflow-y-auto animate-in fade-in py-10 px-4 md:px-8">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full mx-auto shadow-2xl flex flex-col gap-8 animate-in slide-in-from-bottom-10 duration-300 border border-gray-200">
        
        {/* Header Summary */}
        <div className="text-center relative">
          <h2 className="text-3xl font-bold font-serif text-slate-800 tracking-tight">받아쓰기 채점 결과</h2>
          <div className="text-7xl font-black text-emerald-600 my-4 drop-shadow-sm font-serif">
            {result.score} <span className="text-3xl text-slate-300">점</span>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <div className="px-6 py-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between min-w-[200px] shadow-sm">
              <span className="text-sm text-rose-600 font-bold mb-1">오탈자 (잘못된 글자)</span>
              <span className="text-2xl font-black text-rose-800">{result.misses}개</span>
            </div>
            <div className="px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between min-w-[200px] shadow-sm">
              <span className="text-sm text-amber-600 font-bold mb-1">원고지 규칙 위반</span>
              <span className="text-2xl font-black text-amber-800">{result.ruleViolationsCount}회</span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center gap-4 my-2">
          <button 
            onClick={onRetry}
            className="w-48 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <i className="fi fi-rr-rotate-right"></i> 다시 시도하기
          </button>
          <Link href="/dictation" className="w-48 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-2">
            <i className="fi fi-rr-list"></i> 다른 문제 풀기
          </Link>
        </div>

        {/* Visual Comparison Grids */}
        <div className="flex flex-col gap-10 mt-4 bg-[#fffdf7] p-6 rounded-2xl border border-slate-200">
          
          <div className="flex flex-col gap-2 w-full max-w-full items-center">
            <div className="flex items-center gap-2 self-start mb-2 px-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg py-1.5 text-sm">
              <i className="fi fi-rr-check-circle"></i> 정답 원고지 (목표 문자열)
            </div>
            {/* Readonly manuscript */}
            <div className="w-full pointer-events-none select-none">
              <ManuscriptPager 
                rows={0}
                text={targetContent} 
                cursorCell={null} 
                cursorSide="right" 
                errorCells={new Set()} 
                onCellClick={() => {}} 
              />
            </div>
          </div>

          <hr className="border-slate-300 border-dashed" />

          <div className="flex flex-col gap-2 w-full max-w-full items-center">
            <div className="flex items-center gap-2 self-start mb-2 px-2 bg-rose-100 text-rose-800 font-bold rounded-lg py-1.5 text-sm">
              <i className="fi fi-rr-cross-circle"></i> 내 제출본 (붉은색이 틀린 부분)
            </div>
            {/* Render User Manuscript with error highlighting applied to diff mismatches */}
            <div className="w-full pointer-events-none select-none">
              <ManuscriptPager 
                rows={0}
                text={submittedContent} 
                cursorCell={null} 
                cursorSide="right" 
                errorCells={errorCells} 
                onCellClick={() => {}} 
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
