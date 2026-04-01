import { runAllRules } from './src/lib/rules/index';
import { buildFormattedCells } from './src/lib/react-korean-manuscript/core/formatter';
import { buildCursorMaps } from './src/lib/react-korean-manuscript/core/cursorMaps';

const text = "\n 안되요 \n 할수 있다";
const formattedCells = buildFormattedCells(text);
const { charToCell, cellToChar } = buildCursorMaps(text);

const errors = runAllRules({
  text,
  formattedCells,
  cellToChar,
  charToCell,
  columns: 20
});

console.log("ERRORS:", errors);
