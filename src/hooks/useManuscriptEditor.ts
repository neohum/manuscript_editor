import { useEffect, useCallback, RefObject, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';

export function useManuscriptEditor(textareaRef: RefObject<HTMLTextAreaElement | null>) {
  const { text, setText, setCursor } = useEditorStore();
  const isComposingRef = useRef(false);

  const syncCursor = useCallback((currentText: string, selectionStart: number) => {
    // Calculate new cursor cell based on currentText
    const { charToCell } = buildCursorMaps(currentText);
    
    // During Korean IME composition, selectionStart advances past the current character 
    // being composed. We offset by -1 so the block cursor highlights the character being edited.
    let targetIndex = selectionStart;
    if (isComposingRef.current && selectionStart > 0) {
      targetIndex = selectionStart - 1;
    }
    
    // charToCell directly maps the target input index to its correct display cell
    const cellIdx = charToCell[targetIndex];
    
    if (cellIdx !== undefined) {
      setCursor(cellIdx, 'left');
    } else {
      // Fallback
      setCursor(null);
    }
  }, [setCursor]);

  const handleSelectionChange = useCallback(() => {
    if (!textareaRef.current) return;
    syncCursor(text, textareaRef.current.selectionStart || 0);
  }, [text, textareaRef, syncCursor]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    // Sync cursor immediately with the new text and selection layout
    syncCursor(newText, e.target.selectionStart || 0);
  };

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    // Re-sync cursor after composition completes to advance it to the next empty cell
    if (textareaRef.current) {
      syncCursor(textareaRef.current.value, textareaRef.current.selectionStart || 0);
    }
  }, [syncCursor, textareaRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      
      const el = e.currentTarget;
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      
      // Auto-indent: insert a newline AND a space
      const insertText = '\n ';
      const newText = text.substring(0, start) + insertText + text.substring(end);
      
      setText(newText);
      
      setTimeout(() => {
        el.setSelectionRange(start + 2, start + 2);
        syncCursor(newText, start + 2);
      }, 0);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const el = e.currentTarget;
      const start = el.selectionStart || 0;
      
      const { charToCell, cellToChar } = buildCursorMaps(text);
      const currentCell = charToCell[start] ?? 0;
      
      let targetCell = e.key === 'ArrowUp' ? currentCell - 20 : currentCell + 20;
      
      if (targetCell < 0) {
        targetCell = 0;
      }
      
      let newStart = start;
      
      // Check if targetCell points to padding (or is out of bounds)
      // The cellToChar array effectively tells us what cells actually have content or formatting
      // Empty text padding cells at the end of the text yield chars.length.
      // We can just rely on mapping back.
      if (targetCell >= cellToChar.length || cellToChar[targetCell - 1] === undefined) {
        // Jump to the very end of the text
        newStart = text.length;
      } else {
        if (targetCell === 0) {
          newStart = 0;
        } else {
          newStart = cellToChar[targetCell - 1];
        }
      }
      
      setTimeout(() => {
        el.setSelectionRange(newStart, newStart);
        syncCursor(text, newStart);
      }, 0);
    }
  }, [text, setText, syncCursor]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const onSelection = () => handleSelectionChange();
    
    el.addEventListener('keyup', onSelection);
    el.addEventListener('click', onSelection);
    el.addEventListener('focus', onSelection);

    return () => {
      el.removeEventListener('keyup', onSelection);
      el.removeEventListener('click', onSelection);
      el.removeEventListener('focus', onSelection);
    };
  }, [handleSelectionChange, textareaRef]);

  return {
    text,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleSelectionChange,
  };
}
