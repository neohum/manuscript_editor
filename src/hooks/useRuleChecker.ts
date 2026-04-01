import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { buildFormattedCells } from '@/lib/react-korean-manuscript/core/formatter';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';
import { runAllRules, RuleError } from '@/lib/rules';
import { DEFAULT_COLUMNS } from '@/lib/react-korean-manuscript/core/formatter';

export function useRuleChecker(debounceMs = 300, enableTitleRule?: boolean, enableSpellCheck: boolean = true) {
  const { text, setErrorCells, setViolations } = useEditorStore();

  useEffect(() => {
    let active = true;

    // 1. Local rules (fast, small debounce)
    const localHandler = setTimeout(() => {
      const formattedCells = buildFormattedCells(text);
      const { charToCell, cellToChar } = buildCursorMaps(text);

      const localErrors = runAllRules({
        text,
        formattedCells,
        cellToChar,
        charToCell,
        columns: DEFAULT_COLUMNS,
        options: { enableTitleRule }
      });

      if (!active) return;

      // Optimistically show local errors fast
      const dedupedMap = new Map<number, RuleError>();
      for (const err of localErrors) {
        if (!dedupedMap.has(err.cellIndex)) {
          dedupedMap.set(err.cellIndex, err);
        }
      }
      const dedupedArr = Array.from(dedupedMap.values()).sort((a, b) => a.cellIndex - b.cellIndex);
      
      setErrorCells(new Set(dedupedArr.map(e => e.cellIndex)));
      setViolations(dedupedArr);

      // 2. Remote rules (spellcheck API, heavy debounce)
      if (!enableSpellCheck) return;
      
      const remoteHandler = setTimeout(() => {
        if (!text.trim()) return;

        fetch('/api/spellcheck', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
          .then(res => res.json())
          .then(data => {
            if (!active) return;
            if (data.result && Array.isArray(data.result)) {
              // Merge local and remote
              const combinedErrors = [...localErrors, ...data.result];
              
              const finalMap = new Map<number, RuleError>();
              for (const err of combinedErrors) {
                if (!finalMap.has(err.cellIndex)) {
                  finalMap.set(err.cellIndex, err);
                }
              }
              const finalArr = Array.from(finalMap.values()).sort((a, b) => a.cellIndex - b.cellIndex);
              
              setErrorCells(new Set(finalArr.map(e => e.cellIndex)));
              setViolations(finalArr);
            }
          })
          .catch(err => console.error("Spellcheck API Error:", err));
      }, 700); // Wait another 700ms after the initial 300ms debounce (total 1sec from last keystroke)

    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(localHandler);
    };
  }, [text, setErrorCells, setViolations, debounceMs, enableTitleRule, enableSpellCheck]);
}
