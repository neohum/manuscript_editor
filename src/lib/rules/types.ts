import type { FormattedCell } from '@/lib/react-korean-manuscript/types';

export interface RuleError {
  cellIndex: number;
  type: string;
  message: string;
}

export interface RuleContext {
  text: string;
  formattedCells: FormattedCell[];
  cellToChar: number[];
  charToCell: number[];
  columns: number;
}

export type RuleChecker = (context: RuleContext) => RuleError[];
