"use client";

import { ManuscriptPager } from './ManuscriptPager';

interface Props {
  text: string;
  rows?: number;
}

export function ManuscriptViewer({ text, rows = 5 }: Props) {
  return (
    <div className="w-full flex justify-center py-4 select-none pointer-events-none opacity-90 transition-all">
      <ManuscriptPager 
        text={text} 
        rows={rows} 
        cursorCell={null} 
      />
    </div>
  );
}
