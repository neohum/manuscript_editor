"use client";

import { useRef, useEffect } from "react";
import { useEditorStore } from '@/stores/editorStore';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';
import { useRuleChecker } from '@/hooks/useRuleChecker';
import { ManuscriptPager } from './ManuscriptPager';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';

export function ManuscriptEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Custom hook binds the textarea and handles cursor updates to Zustand
  const { handleChange, text } = useManuscriptEditor(textareaRef);
  
  // Rule checking engine running continuously (debounced)
  useRuleChecker(300);
  
  // Extract state mapped directly by Zustand
  const { cursorCell, cursorSide, errorCells, setText } = useEditorStore();

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const handleCellClick = (globalIndex: number, side: 'left' | 'right') => {
    const { cellToChar } = buildCursorMaps(text);
    
    // When clicking a cell that is way beyond the current text, append spaces (if user wants)
    // Or just jump cursor to the end.
    let targetCharIndex = cellToChar[globalIndex];
    if (targetCharIndex === undefined) {
      targetCharIndex = text.length;
    }
    
    // Fallback logic for padding empty space, translated to raw chars roughly
    if (globalIndex >= cellToChar.length) {
      // pad spaces if desired, but typically we just focus at end of string
      targetCharIndex = text.length;
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(targetCharIndex, targetCharIndex);
      }
    }, 0);
  };

  return (
    <div 
      className="relative w-full flex flex-col items-center"
      onClick={handleContainerClick}
    >
      {/* Visually hidden textarea for native input & IME */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        className="fixed top-[-9999px] left-[-9999px] w-1 h-1 opacity-0 z-0"
        spellCheck={false}
        autoFocus
      />
      
      {/* Visual layer using Pager to support multiple grids. */}
      <div className="w-full max-w-full md:max-w-5xl flex flex-col gap-6 items-center select-none" style={{ pointerEvents: 'auto' }}>
        <ManuscriptPager 
          text={text} 
          cursorCell={cursorCell} 
          cursorSide={cursorSide} 
          errorCells={errorCells}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  );
}
