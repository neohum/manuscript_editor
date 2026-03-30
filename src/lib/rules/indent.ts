import { RuleChecker, RuleError } from './types';

export const checkIndentRule: RuleChecker = ({ text, charToCell }) => {
  const errors: RuleError[] = [];
  if (!text) return errors;

  let globalIndex = 0;
  
  // A paragraph is split by newlines. Every paragraph must start with a space.
  const paragraphs = text.split('\n');
  
  for (const p of paragraphs) {
    if (p.length > 0 && p[0] !== ' ') {
      // The first character of this paragraph doesn't have an indent!
      const cellIndex = charToCell[globalIndex];
      if (cellIndex !== undefined) {
        errors.push({
          cellIndex,
          type: 'indent',
          message: '문단의 첫 칸은 반드시 들여쓰기(빈 칸)를 해야 합니다.'
        });
      }
    }
    // +1 for the newline character we split by
    globalIndex += p.length + 1;
  }

  return errors;
};
