import { RuleChecker, RuleError } from './types';
import { spellingErrorDict } from './localDict';

export const checkSpelling: RuleChecker = (context): RuleError[] => {
  const errors: RuleError[] = [];
  const { text, charToCell } = context;

  if (!text) return errors;

  spellingErrorDict.forEach(({ wrong, correct }) => {
    let startIndex = 0;
    let index: number;
    while ((index = text.indexOf(wrong, startIndex)) > -1) {
      // Highlight every character in the wrong phrase so it doesn't get completely hidden
      // by a deduplicated indent error on the first cell.
      for (let i = 0; i < wrong.length; i++) {
        const cellIdx = charToCell[index + i];
        if (cellIdx !== undefined && cellIdx !== -1) {
          errors.push({
            cellIndex: cellIdx,
            type: 'spelling',
            message: `'${wrong}' 대신 '${correct}'이(가) 올바른 맞춤법입니다.`,
          });
        }
      }
      startIndex = index + wrong.length;
    }
  });

  return errors;
};
