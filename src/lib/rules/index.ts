import { checkIndentRule } from './indent';
import { checkPunctuationRule } from './punctuation';
import { checkQuoteRule } from './quote';
import { checkLineEndRule } from './lineEnd';
import { checkSpelling } from './spelling';
import { checkSpacing } from './spacing';
import { checkNumberAlphaRule } from './numberAlpha';
import { checkStructureRule } from './structure';
import type { RuleChecker, RuleContext, RuleError } from './types';

const allRules: RuleChecker[] = [
  checkIndentRule,
  checkPunctuationRule,
  checkQuoteRule,
  checkLineEndRule,
  checkNumberAlphaRule
];

export const runAllRules = (context: RuleContext): RuleError[] => {
  const errors: RuleError[] = [];
  
  // Conditionally apply structure rule
  const rulesToRun = [...allRules];
  if (context.options?.enableTitleRule) {
    rulesToRun.push(checkStructureRule);
  }

  for (const checker of rulesToRun) {
    const findings = checker(context);
    errors.push(...findings);
  }

  // Deduplicate errors by cellIndex (only show first major violation per cell)
  const dedupedMap = new Map<number, RuleError>();
  for (const err of errors) {
    if (!dedupedMap.has(err.cellIndex)) {
      dedupedMap.set(err.cellIndex, err);
    }
  }

  return Array.from(dedupedMap.values()).sort((a, b) => a.cellIndex - b.cellIndex);
};

export * from './types';
