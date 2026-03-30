import { RuleChecker, RuleError } from './types';

const SMALL_PUNCT = new Set(['.', ',', '。', '、', '．', '，']);

export const checkPunctuationRule: RuleChecker = ({ text, charToCell }) => {
  const errors: RuleError[] = [];
  
  for (let i = 1; i < text.length; i++) {
    if (SMALL_PUNCT.has(text[i])) {
      // If the preceding char is a space or line break, they didn't attach it to the previous word!
      if (text[i - 1] === ' ' || text[i - 1] === '\n') {
        const cellIndex = charToCell[i];
        if (cellIndex !== undefined) {
          errors.push({
            cellIndex,
            type: 'punctuation',
            message: '마침표나 쉼표는 빈 칸 없이 앞 글자에 바로 붙여 써야 합니다.'
          });
        }
      }
    }
  }

  return errors;
};
