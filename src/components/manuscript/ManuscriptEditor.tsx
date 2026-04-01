"use client";

import { useRef, useEffect, useState } from "react";
import { useEditorStore } from '@/stores/editorStore';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';
import { useRuleChecker } from '@/hooks/useRuleChecker';
import { ManuscriptPager } from './ManuscriptPager';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';

export function ManuscriptEditor({ enableTitleRule = false }: { enableTitleRule?: boolean } = {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSpaceMarks, setShowSpaceMarks] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const [enableSpellCheck, setEnableSpellCheck] = useState(true);
  const [titleRuleEnabled, setTitleRuleEnabled] = useState(enableTitleRule);
  
  // Custom hook binds the textarea and handles cursor updates to Zustand
  const { 
    handleChange, 
    handleKeyDown, 
    handleCompositionStart, 
    handleCompositionEnd, 
    text 
  } = useManuscriptEditor(textareaRef);
  
  // Rule checking engine running continuously (debounced)
  useRuleChecker(300, titleRuleEnabled, enableSpellCheck);
  
  // Extract state mapped directly by Zustand
  const { cursorCell, cursorSide, errorCells, violations, setText } = useEditorStore();

  // Auto-apply manuscript structure for titles on mount if empty
  useEffect(() => {
    if (titleRuleEnabled && text.trim() === '') {
      // Line 1: empty (\n)
      // Line 2: roughly centered title (6 spaces + \n)
      // Line 3: name area (empty \n, user clicks to write)
      // Line 4: completely blank (\n)
      // Line 5: indented 1 space for body ( )
      setText('\n      \n\n\n ');
    } else if (!titleRuleEnabled && text === '\n      \n\n\n ') {
      setText('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleRuleEnabled]);

  const errorMessages = typeof window !== 'undefined' 
    ? Object.fromEntries(violations.map(v => [v.cellIndex, v.message])) 
    : {};

  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const handleFixAll = () => {
    if (violations.length === 0) {
      alert("발견된 오류가 없습니다.");
      return;
    }
    
    let newText = text;
    let count = 0;
    
    // Extract unique token-suggestion pairs (only from external API spelling/spacing errors)
    const pairs = new Map<string, string>();
    violations.forEach(v => {
      if (v.token && v.suggestion) {
        pairs.set(v.token, v.suggestion);
      }
    });

    if (pairs.size === 0) {
      alert("자동으로 수정할 수 있는 맞춤법/띄어쓰기 오류가 없습니다.\n(원고지 구조 오류는 직접 수정해야 합니다)");
      return;
    }
    
    pairs.forEach((suggestion, token) => {
      const hits = newText.split(token).length - 1;
      if (hits > 0) count += hits;
      newText = newText.replace(new RegExp(escapeRegExp(token), 'g'), suggestion);
    });
    
    if (newText !== text) {
      setText(newText);
      alert(`총 ${count}건의 맞춤법/띄어쓰기 오류가 일괄 수정되었습니다!`);
    } else {
      alert("기존 텍스트 구조 변경으로 인해 더 이상 일치하는 자동 수정 항목이 없습니다.");
    }
  };

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
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="fixed top-[-9999px] left-[-9999px] w-1 h-1 opacity-0 z-0"
        spellCheck={false}
        autoFocus
      />
      
      {/* Visual layer using Pager to support multiple grids. */}
      <div className="w-full max-w-full md:max-w-5xl flex flex-col gap-4 items-center select-none" style={{ pointerEvents: 'auto' }}>
        
        {/* Editor Toolbar / Toggles (Top Level) */}
        <div className="w-full flex items-center justify-start px-2 mb-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => setTitleRuleEnabled(true)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${titleRuleEnabled ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fi fi-rr-h1 mr-1"></i> 제목 포함 글쓰기
            </button>
            <button 
              onClick={() => setTitleRuleEnabled(false)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!titleRuleEnabled ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fi fi-rr-text mr-1"></i> 제목 없이 본문만
            </button>
          </div>
        </div>

        {/* Title Mode Guide Banner */}
        {titleRuleEnabled && (
          <div className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-900 shadow-sm flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <i className="fi fi-rr-info text-indigo-500 mt-0.5 whitespace-nowrap"></i>
            <div className="flex flex-col gap-1.5 leading-relaxed">
              <p className="font-bold text-indigo-700">📌 올바른 제목과 이름 배치 원칙 (자동 채점 적용 중)</p>
              <ul className="list-disc list-inside text-indigo-800/80 space-y-1 ml-1 mt-1 font-medium">
                <li><strong className="text-indigo-900 text-xs bg-white px-1 py-0.5 rounded shadow-sm border border-indigo-100 mr-1">1째 줄</strong> 통째로 비워둡니다. (자동 처리됨)</li>
                <li><strong className="text-indigo-900 text-xs bg-white px-1 py-0.5 rounded shadow-sm border border-indigo-100 mr-1">2째 줄</strong> 중앙 부근에 제목을 적고, 끝에 마침표를 찍지 않습니다.</li>
                <li><strong className="text-indigo-900 text-xs bg-white px-1 py-0.5 rounded shadow-sm border border-indigo-100 mr-1">3째 줄</strong> 이름(소속)을 오른쪽 끝에서 1~2칸 여유를 두고 적습니다.</li>
                <li><strong className="text-indigo-900 text-xs bg-white px-1 py-0.5 rounded shadow-sm border border-indigo-100 mr-1">4째 줄</strong> 통째로 비워둡니다. (제목부와 본문 사이 공백)</li>
                <li><strong className="text-indigo-900 text-xs bg-white px-1 py-0.5 rounded shadow-sm border border-indigo-100 mr-1">5째 줄</strong> 첫 칸을 비우고(들여쓰기) 본격적인 본문을 시작합니다!</li>
              </ul>
            </div>
          </div>
        )}

        <ManuscriptPager 
          text={text} 
          cursorCell={cursorCell} 
          cursorSide={cursorSide} 
          errorCells={errorCells}
          errorMessages={errorMessages}
          showSpaceMarks={showSpaceMarks}
          showErrors={showErrors}
          onCellClick={handleCellClick}
          renderPageToolbar={() => (
            <div className="w-full flex flex-wrap items-center justify-end gap-4 px-2 mb-2" onClick={(e) => e.stopPropagation()}>
              <button
                 onClick={handleFixAll}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                 title="발견된 모든 맞춤법 및 띄어쓰기 오류를 올바르게 고칩니다"
              >
                <i className="fi fi-rr-magic-wand text-xs"></i> 일괄 자동 수정
              </button>
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={enableSpellCheck} 
                  onChange={(e) => setEnableSpellCheck(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                자동 맞춤법 검사
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={showSpaceMarks} 
                  onChange={(e) => setShowSpaceMarks(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer"
                />
                띄어쓰기 기호 (v) 표시
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={showErrors} 
                  onChange={(e) => setShowErrors(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer"
                />
                오류 강조 표시
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}
