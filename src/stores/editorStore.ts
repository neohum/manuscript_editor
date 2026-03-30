import { create } from 'zustand';
import type { RuleError } from '@/lib/rules/types';

interface EditorState {
  text: string;
  cursorCell: number | null;
  cursorSide: 'left' | 'right';
  errorCells: Set<number>;
  violations: RuleError[];
  setText: (text: string) => void;
  setCursor: (cell: number | null, side?: 'left' | 'right') => void;
  setErrorCells: (cells: Set<number>) => void;
  setViolations: (violations: RuleError[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  text: '',
  cursorCell: null,
  cursorSide: 'left',
  errorCells: new Set(),
  violations: [],
  setText: (text) => set({ text }),
  setCursor: (cell, side = 'left') => set({ cursorCell: cell, cursorSide: side }),
  setErrorCells: (cells) => set({ errorCells: cells }),
  setViolations: (violations) => set({ violations }),
}));
