export function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function calculateScore(targetText: string, submittedText: string, ruleViolationsCount: number) {
  // Strip out extra ending spaces to be fair to users leaving cursors around
  const cleanTarget = targetText.trimEnd();
  const cleanSubmitted = submittedText.trimEnd();

  const misses = getLevenshteinDistance(cleanTarget, cleanSubmitted);
  
  // Scoring algorithm:
  // Base score is 100
  // Each missing/wrong character costs 3 points
  // Each formatting rule violation costs 5 points
  
  let score = 100 - (misses * 3) - (ruleViolationsCount * 5);
  
  // Floor at 0
  score = Math.max(0, score);
  
  return {
    score,
    misses,
    ruleViolationsCount
  };
}
