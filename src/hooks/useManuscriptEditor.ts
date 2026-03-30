import { useEffect, useCallback, RefObject } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';

export function useManuscriptEditor(textareaRef: RefObject<HTMLTextAreaElement | null>) {
  const { text, setText, setCursor } = useEditorStore();

  const syncCursor = useCallback((currentText: string, selectionStart: number) => {
    if (selectionStart === 0) {
      setCursor(0, 'left');
      return;
    }
    
    // Calculate new cursor cell based on currentText
    const { charToCell } = buildCursorMaps(currentText);
    
    // Cursor is right after the character at (selectionStart - 1)
    const prevCharIndex = selectionStart - 1;
    const cellIdx = charToCell[prevCharIndex];
    
    if (cellIdx !== undefined) {
      // Shifting block cursor right by 1 cell to indicate where input will land
      setCursor(cellIdx + 1, 'left');
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
    handleSelectionChange,
  };
}
