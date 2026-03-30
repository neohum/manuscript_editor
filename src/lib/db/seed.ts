import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { problems } from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

const level1Problems = [
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 1',
    content: ' 문단 첫 시작은 반드시 한 칸을 띄워 써야 하는 원칙이 있습니다.',
    errorHints: { tips: ['들여쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 2',
    content: ' 숫자 두 자리나 알파벳 두 글자는 보통 25 한 칸에 합쳐 씁니다.',
    errorHints: { tips: ['숫자 2글자', '들여쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 3',
    content: ' 마침표는 문장이 끝나면 구석에 써요. 그리고 다음 문장은 바로 적지 않습니다.',
    errorHints: { tips: ['마침표', '들여쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 4',
    content: ' 쉼표와 마침표를 모두 쓰면, 문장이 훨씬 읽기 편안해집니다.',
    errorHints: { tips: ['쉼표', '마침표'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 5',
    content: ' 따옴표의 쌍이 맞는지 검사하는 것도 원고지 작성의 중요한 기본기입니다.',
    errorHints: { tips: ['따옴표'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 6',
    content: ' "이런 식으로" 대화나 직접 인용하는 문장은 줄을 바꾸어 첫 칸을 비우고 시작해요.',
    errorHints: { tips: ['따옴표', '들여쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 7',
    content: ' 원고지의 빈칸이 부족해 보인다면, 단어를 잘게 띄어 쓰지 않았는지 확인해 보세요.',
    errorHints: { tips: ['띄어쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 8',
    content: ' 느낌표는 쓴 뒤에 한 칸을 띄웁니다! 이건 꼭 지키세요!',
    errorHints: { tips: ['느낌표 뒤 띄어쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 9',
    content: ' 물음표도 마찬가지로 기호를 쓴 다음엔 한 칸을 띄워서 다음 말을 적어요?',
    errorHints: { tips: ['물음표 뒤 띄어쓰기'] }
  },
  {
    level: 1,
    mode: 'dictation',
    title: '새싹 단계 받아쓰기 10',
    content: ' 줄이 끝나는 마지막 칸에는 여는 괄호를 쓰면 안 되고, 반드시 다음 줄 첫 칸에 넘깁니다.',
    errorHints: { tips: ['행말 규칙'] }
  }
];

async function main() {
  console.log('Seeding Database...');
  try {
    // Delete old dictation problems before seeding
    await client`DELETE FROM problems WHERE mode = 'dictation'`;
    
    for (const problem of level1Problems) {
      await db.insert(problems).values(problem);
    }
    console.log('Successfully seeded 10 dictation problems!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

main();
