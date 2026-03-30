import { RuleChecker, RuleError } from './types';

export const checkQuoteRule: RuleChecker = ({ text, charToCell }) => {
  const errors: RuleError[] = [];
  
  let dblQWait = -1;
  let sglQWait = -1;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === '\u201C' || c === '\u201D' || c === '\u201E') {
      if (dblQWait === -1) dblQWait = i; // Store index of opening quote
      else dblQWait = -1;                // Closed it
    }
    if (c === "'" || c === '\u2018' || c === '\u2019' || c === '\u201A') {
      if (sglQWait === -1) sglQWait = i;
      else sglQWait = -1;
    }
  }

  if (dblQWait !== -1 && charToCell[dblQWait] !== undefined) {
    errors.push({
      cellIndex: charToCell[dblQWait],
      type: 'quote',
      message: '여는 쌍따옴표에 대한 닫는 쌍따옴표가 없습니다.'
    });
  }
  
  if (sglQWait !== -1 && charToCell[sglQWait] !== undefined) {
    errors.push({
      cellIndex: charToCell[sglQWait],
      type: 'quote',
      message: '여는 홑따옴표에 대한 닫는 홑따옴표가 없습니다.'
    });
  }

  return errors;
};
