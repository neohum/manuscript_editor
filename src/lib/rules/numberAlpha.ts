import { RuleChecker, RuleError } from './types';

// Detect single lower-alpha or digits separated by a space
// For example: "1 2" instead of "12"
// Catch patterns like "\d \d" or "[a-z] [a-z]"
export const checkNumberAlphaRule: RuleChecker = (context): RuleError[] => {
  const errors: RuleError[] = [];
  const { text, charToCell } = context;

  if (!text) return errors;

  // Regex to find single digits or lower-alpha separated by ONE OR MORE spaces
  // This helps catch cases where user typed spaces between numbers/letters that shouldn't be separated
  const regex = /([0-9a-z])(\s+)([0-9a-z])/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const char1 = match[1];
    const spaces = match[2];
    const char2 = match[3];

    // If it's a digit followed by space followed by digit OR alpha-space-alpha
    // We flag it as a potential warning, saying they shouldn't be spaced out
    const isNumNum = /[0-9]/.test(char1) && /[0-9]/.test(char2);
    const isAlphaAlpha = /[a-z]/.test(char1) && /[a-z]/.test(char2);
    
    // Actually, rules specify: 아라비아 숫자 2자, 알파벳 대소문자는 한칸.
    // Meaning two sequential [0-9a-zA-Z] shouldn't have spaces between them normally in Korean writing
    // We only strictly warn if they are BOTH numbers or BOTH lowercase english,
    // which indicates they broken up a number or a word.
    
    if (isNumNum || isAlphaAlpha) {
      const firstCharIdx = match.index;
      // Report on the first space cell
      const spaceIdx = firstCharIdx + 1;
      const cellIdx = charToCell[spaceIdx];

      if (cellIdx !== undefined && cellIdx !== -1) {
        errors.push({
          cellIndex: cellIdx,
          type: 'numberAlpha',
          message: '숫자나 영문자는 보통 띄어 쓰지 않고 한 칸에 함께 적습니다.',
        });
      }
    }
  }

  return errors;
};
