import React from 'react';
import type { RuleError } from '@/lib/rules';

interface ErrorExplanationPopupProps {
  cursorCell: number | null;
  violations: RuleError[];
}

export function ErrorExplanationPopup({ cursorCell, violations }: ErrorExplanationPopupProps) {
  if (cursorCell === null) return null;

  // Find all violations at the user's exact cursor cell position
  const activeViolations = violations.filter(v => v.cellIndex === cursorCell);

  if (activeViolations.length === 0) return null;

  return (
    <div className="mt-4 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2">
      <h3 className="font-bold text-sm text-red-600 flex items-center gap-1">
        <span className="text-base">🚨</span> 이 위치의 문제점
      </h3>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col gap-2 shadow-sm text-sm text-red-800 leading-relaxed">
        {activeViolations.map((v, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="mt-0.5">•</span>
            <span>{v.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
