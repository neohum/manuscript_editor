import { RuleChecker, RuleError } from './types';
import { spacingErrorDict } from './localDict';

export const checkSpacing: RuleChecker = (context): RuleError[] => {
  const errors: RuleError[] = [];
  const { text, charToCell } = context;

  if (!text) return errors;

  spacingErrorDict.forEach(({ wrong, correct }) => {
    let startIndex = 0;
    let index: number;
    while ((index = text.indexOf(wrong, startIndex)) > -1) {
      // Highlight every character in the wrong phrase so the user clearly sees the spacing error
      // and it doesn't get completely hidden by a deduplicated indent error on the first cell.
      for (let i = 0; i < wrong.length; i++) {
        const cellIdx = charToCell[index + i];
        if (cellIdx !== undefined && cellIdx !== -1) {
          errors.push({
            cellIndex: cellIdx,
            type: 'spacing',
            message: `띄어쓰기 오류: '${wrong}' -> '${correct}'`,
          });
        }
      }
      startIndex = index + wrong.length;
    }
  });

  return errors;
};
