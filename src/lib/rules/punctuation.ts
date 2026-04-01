import { RuleChecker, RuleError } from './types';

const SMALL_PUNCT = new Set(['.', ',', '。', '、', '．', '，']);
const QUOTES_OPEN = new Set(['"', '“', "'", '‘', '(']);
const QUOTES_CLOSE = new Set(['"', '”', "'", '’', ')']);

export const checkPunctuationRule: RuleChecker = ({ text, charToCell }) => {
  const errors: RuleError[] = [];
  
  for (let i = 0; i < text.length; i++) {
    // 1. Spacing BEFORE small puncutation (error)
    if (i > 0 && SMALL_PUNCT.has(text[i])) {
      if (text[i - 1] === ' ' || text[i - 1] === '\n') {
        const cellIndex = charToCell[i];
        if (cellIndex !== undefined && cellIndex !== -1) {
          errors.push({
            cellIndex,
            type: 'punctuation',
            message: '마침표나 쉼표는 빈 칸 없이 앞 글자에 바로 붙여 써야 합니다.'
          });
        }
      }
    }

    // 2. Spacing AFTER small punctuation (error)
    if (SMALL_PUNCT.has(text[i]) && i < text.length - 1) {
      if (text[i + 1] === ' ') {
        const cellIndex = charToCell[i + 1];
        if (cellIndex !== undefined && cellIndex !== -1) {
          errors.push({
            cellIndex,
            type: 'punctuation',
            message: '마침표나 쉼표 다음 칸은 비우지 않고 바로 이어서 글자를 써야 합니다.'
          });
        }
      }
    }

    // 3. Spacing instantly AFTER opening quotes or BEFORE closing quotes (error)
    if (QUOTES_OPEN.has(text[i]) && i < text.length - 1 && text[i + 1] === ' ') {
      const cellIndex = charToCell[i + 1];
      if (cellIndex !== undefined && cellIndex !== -1) {
        errors.push({
          cellIndex,
          type: 'punctuation',
          message: '따옴표/괄호 시작 직후에는 빈 칸을 두지 않고 바로 글자를 씁니다.'
        });
      }
    }
    
    if (i > 0 && QUOTES_CLOSE.has(text[i]) && text[i - 1] === ' ') {
      const cellIndex = charToCell[i - 1];
      if (cellIndex !== undefined && cellIndex !== -1) {
        errors.push({
          cellIndex,
          type: 'punctuation',
          message: '따옴표/괄호를 닫기 직전에는 불필요한 빈 칸을 두지 않습니다.'
        });
      }
    }
  }

  return errors;
};
