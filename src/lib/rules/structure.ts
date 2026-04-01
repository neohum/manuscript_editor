import { RuleChecker, RuleError } from './types';

export const checkStructureRule: RuleChecker = ({ text, charToCell, columns }) => {
  const errors: RuleError[] = [];
  if (!text.trim()) return errors;

  const lines = text.split('\n');

  // Rule 1: First line should be completely empty (or spaces only)
  if (lines.length > 0 && lines[0].trim().length > 0) {
    // Flag the first cell of the content
    const cellIndex = charToCell[0];
    if (cellIndex !== undefined && cellIndex !== -1) {
      errors.push({
        cellIndex,
        type: 'structure',
        message: '원고지의 첫째 줄은 비워두는 것이 원칙입니다. 둘째 줄부터 제목을 작성해 보세요.',
      });
    }
  }

  // Rule 2: Title (Line 2) should not end with a period.
  // Assuming line 2 is the title if there are more than 1 line.
  if (lines.length >= 2 && lines[1].trim().length > 0) {
    const title = lines[1].trimRight();
    if (title.endsWith('.')) {
      // Find the index of the period
      let periodGlobalIndex = 0;
      periodGlobalIndex += lines[0].length + 1; // +1 for \n
      periodGlobalIndex += lines[1].lastIndexOf('.');
      
      const cellIndex = charToCell[periodGlobalIndex];
      if (cellIndex !== undefined && cellIndex !== -1) {
        errors.push({
          cellIndex,
          type: 'structure',
          message: '제목의 끝에는 마침표를 찍지 않습니다.',
        });
      }
    }
  }

  // Rule 3: Fourth line (index 3) should be completely empty to separate title/name from body
  if (lines.length >= 4 && lines[3].trim().length > 0) {
    let fourthLineStartIndex = 0;
    fourthLineStartIndex += lines[0].length + 1;
    fourthLineStartIndex += lines[1].length + 1;
    fourthLineStartIndex += lines[2].length + 1;

    const nonSpaceIdx = lines[3].search(/\S/);
    const targetIdx = nonSpaceIdx !== -1 ? fourthLineStartIndex + nonSpaceIdx : fourthLineStartIndex;
    
    const cellIndex = charToCell[targetIdx];
    if (cellIndex !== undefined && cellIndex !== -1) {
      errors.push({
        cellIndex,
        type: 'structure',
        message: '원고지의 넷째 줄은 제목부와 본문을 구분하기 위해 완전히 비워두는 것이 원칙입니다.',
      });
    }
  }

  return errors;
};
