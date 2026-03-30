import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { buildFormattedCells } from '@/lib/react-korean-manuscript/core/formatter';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';
import { runAllRules } from '@/lib/rules';
import { DEFAULT_COLUMNS } from '@/lib/react-korean-manuscript/core/formatter';

export function useRuleChecker(debounceMs = 300) {
  const { text, setErrorCells, setViolations } = useEditorStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      // Evaluate everything contextually
      const formattedCells = buildFormattedCells(text);
      const { charToCell, cellToChar } = buildCursorMaps(text);

      const errors = runAllRules({
        text,
        formattedCells,
        cellToChar,
        charToCell,
        columns: DEFAULT_COLUMNS
      });

      // Update global store
      const errorCellSet = new Set(errors.map(e => e.cellIndex));
      setErrorCells(errorCellSet);
      setViolations(errors);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [text, setErrorCells, setViolations, debounceMs]);
}
