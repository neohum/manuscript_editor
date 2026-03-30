import { RuleChecker, RuleError } from './types';

export const checkLineEndRule: RuleChecker = ({ formattedCells }) => {
  const errors: RuleError[] = [];
  
  formattedCells.forEach((cell, cellIndex) => {
    if (typeof cell === 'object' && cell !== null && 'underflow' in cell) {
      errors.push({
        cellIndex,
        type: 'lineEnd',
        message: '여는 따옴표나 여는 괄호는 행의 맨 끝 칸에 쓸 수 없어 다음 줄로 넘깁니다.'
      });
    }
  });

  return errors;
};
