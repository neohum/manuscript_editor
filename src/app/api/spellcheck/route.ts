import { NextResponse } from 'next/server';
import { buildCursorMaps } from '@/lib/react-korean-manuscript/core/cursorMaps';
// @ts-ignore
import hanspell from 'hanspell';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (typeof text !== 'string') {
      return NextResponse.json({ message: 'Invalid text' }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ result: [] }, { status: 200 });
    }

    const { charToCell } = buildCursorMaps(text);

    // Promise wrapper for hanspell callback API
    const checkSpell = () => new Promise<any[]>((resolve, reject) => {
      let combinedResults: any[] = [];
      try {
        hanspell.spellCheckByDAUM(
          text,
          6000,
          (res: any[]) => { combinedResults.push(...res); },
          () => resolve(combinedResults),
          (err: any) => reject(err)
        );
      } catch (err) {
        reject(err);
      }
    });

    const hanspellResults = await checkSpell();

    const errors: any[] = [];

    // Map external results to RuleError schema
    for (const item of hanspellResults) {
      // Ignore manuscript false-positives: standard orthography conflicts.
      if (item.type === 'space' && item.suggestions.length > 0) {
        const suggestion = item.suggestions[0];

        // 1. Ignore indentation corrections: standard orthography removes leading spaces, but manuscript REQUIRES them.
        if (item.token.startsWith(' ') && item.token.trimStart() === suggestion) {
          continue;
        }

        // 2. Ignore punctuation spacing corrections: standard requires spaces after . or , but manuscript forbids them.
        const normalizedSuggestion = suggestion.replace(/([.,])\s+/g, '$1');
        const normalizedToken = item.token.replace(/([.,])\s+/g, '$1');
        
        // If the only difference was a space after a period/comma, skip this error!
        if (normalizedSuggestion === normalizedToken) {
          continue;
        }
      }

      let startIndex = 0;
      let index: number;
      while ((index = text.indexOf(item.token, startIndex)) > -1) {
        for (let i = 0; i < item.token.length; i++) {
          const cellIdx = charToCell[index + i];
          if (cellIdx !== undefined && cellIdx !== -1) {
            errors.push({
              cellIndex: cellIdx,
              type: item.type === 'space' ? 'spacing' : 'spelling',
              message: `'${item.token}' 대신 '${item.suggestions[0]}'이(가) 적절합니다.`,
              token: item.token,
              suggestion: item.suggestions[0]
            });
          }
        }
        startIndex = index + item.token.length;
      }
    }

    return NextResponse.json({ result: errors }, { status: 200 });
  } catch (error) {
    console.error('Spellcheck error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

