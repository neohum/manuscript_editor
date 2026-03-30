"use client";

import React, { useRef, useState, useEffect } from "react";
import { ManuscriptPage } from "./ManuscriptPage";

interface ManuscriptEditorProps {
  initialText?: string;
  onChange?: (text: string) => void;
}

export function ManuscriptEditor({
  initialText = "",
  onChange,
}: ManuscriptEditorProps) {
  const [text, setText] = useState(initialText);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS_PER_PAGE = 200;

  // Sync to external onChange if provided
  useEffect(() => {
    if (onChange) onChange(text);
  }, [text, onChange]);

  const handleFocusClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Update cursor position on navigation keys (arrows, backspace, etc.)
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
  };

  const handleClickTextarea = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Update cursor position if user clicks inside the raw textarea (if somehow visible)
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
  };

  // Determine how many pages we need to render
  // At minimum 1 page.
  const numPages = Math.max(1, Math.ceil(text.length / MAX_CHARS_PER_PAGE));
  const pages = Array.from({ length: numPages }).map((_, pageIndex) => {
    const startIndex = pageIndex * MAX_CHARS_PER_PAGE;
    const textSubset = text.slice(startIndex, startIndex + MAX_CHARS_PER_PAGE);

    return (
      <ManuscriptPage
        key={`page-${pageIndex}`}
        startIndex={startIndex}
        textSubset={textSubset}
        cursorPosition={cursorPosition}
      />
    );
  });

  return (
    <div
      className="relative flex flex-col items-center w-full min-h-screen cursor-text transition-all duration-300 ease-in-out"
      onClick={handleFocusClick}
    >
      {/* 
        The invisible textarea that handles all standard browser text inputs,
        IME composition, spellcheck, mobile keyboard, and copy/paste correctly.
      */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
        onClick={handleClickTextarea}
        className="absolute w-full h-full opacity-0 pointer-events-none resize-none focus:outline-none overflow-hidden text-transparent caret-transparent"
        spellCheck="false"
        autoFocus
        style={{ zIndex: 0 }}
      />

      {/* Render the manuscript pages overlayed */}
      <div className="z-10 w-full pointer-events-none select-none flex flex-col gap-8 pb-32">
        {pages}
      </div>
    </div>
  );
}
