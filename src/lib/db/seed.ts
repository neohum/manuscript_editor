import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { problems, users } from './schema';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

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

const level1CorrectionProblems = [
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 1',
    content: ' 문단 첫 시작은 반드시 한 칸을 띄워 써야 하는 원칙이 있습니다.',
    errorHints: { tips: ['들여쓰기', '띄어쓰기'], wrongText: '문단첫시작은 반드시 한 칸을띄워 써야 하는 원칙이있습니다.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 2',
    content: ' 숫자 두 자리나 알파벳 두 글자는 보통 25 한 칸에 합쳐 씁니다.',
    errorHints: { tips: ['숫자 2글자', '띄어쓰기'], wrongText: ' 숫자두자리나 알파벳두글자는 보통한 칸에 합쳐 씁니다.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 3',
    content: ' 마침표는 문장이 끝나면 구석에 써요. 그리고 다음 문장은 바로 적지 않습니다.',
    errorHints: { tips: ['마침표', '띄어쓰기'], wrongText: ' 마침표는 문장이 끝나면 구석에써요그리고 다음 문장은 바로 적지않습니다.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 4',
    content: ' 쉼표와 마침표를 모두 쓰면, 문장이 훨씬 읽기 편안해집니다.',
    errorHints: { tips: ['쉼표', '마침표', '띄어쓰기'], wrongText: ' 쉼표와 마침표를모두 쓰면,문장이 훨씬 읽기편안해집니다.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 5',
    content: ' 따옴표의 쌍이 맞는지 검사하는 것도 원고지 작성의 중요한 기본기입니다.',
    errorHints: { tips: ['따옴표', '띄어쓰기'], wrongText: ' 따옴표의쌍이 맞는지검사하는 것도 원고지 작성의 중요한기본기입니다.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 6',
    content: ' "이런 식으로" 대화나 직접 인용하는 문장은 줄을 바꾸어 첫 칸을 비우고 시작해요.',
    errorHints: { tips: ['따옴표', '들여쓰기', '띄어쓰기'], wrongText: '"이런식으로" 대화나 직접 인용하는 문장은 줄을바꾸어 첫 칸을 비우고 시작해요.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 7',
    content: ' 원고지의 빈칸이 부족해 보인다면, 단어를 잘게 띄어 쓰지 않았는지 확인해 보세요.',
    errorHints: { tips: ['띄어쓰기'], wrongText: ' 원고지의 빈칸이 부족해 보인다면,단어를 잘게 띄어쓰지 않았는지확인해 보세요.' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 8',
    content: ' 느낌표는 쓴 뒤에 한 칸을 띄웁니다! 이건 꼭 지키세요!',
    errorHints: { tips: ['느낌표 뒤 띄어쓰기'], wrongText: ' 느낌표는쓴 뒤에 한칸을 띄웁니다!이건 꼭 지키세요!' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 9',
    content: ' 물음표도 마찬가지로 기호를 쓴 다음엔 한 칸을 띄워서 다음 말을 적어요?',
    errorHints: { tips: ['물음표 뒤 띄어쓰기'], wrongText: ' 물음표도 마찬가지로 기호를쓴다음엔 한 칸을 띄워서 다음 말을 적어요?' }
  },
  {
    level: 1, mode: 'correction', title: '새싹 단계 교정 10',
    content: ' 줄이 끝나는 마지막 칸에는 여는 괄호를 쓰면 안 되고, 반드시 다음 줄 첫 칸에 넘깁니다.',
    errorHints: { tips: ['행말 규칙', '띄어쓰기'], wrongText: ' 줄이 끝나는 마지막칸에는 여는괄호를 쓰면 안 되고,반드시 다음 줄 첫칸에 넘깁니다.' }
  }
];

const level3Problems = [
  { level: 3, mode: 'dictation', title: '거목 단계 받아쓰기 1', content: ' 그는 25년 동안 피땀 흘려 일한 대가로 드디어 작은 집 한 채를 마련했다.', errorHints: { tips: ['숫자 2글자'] } },
  { level: 3, mode: 'dictation', title: '거목 단계 받아쓰기 2', content: ' "정말로 내가 해낼 수 있을까?" 그녀의 눈빛은 불안과 설렘이 교차했다.', errorHints: { tips: ['따옴표', '들여쓰기'] } },
];

const level4Problems = [
  { level: 4, mode: 'dictation', title: '마스터 단계 받아쓰기 1', content: ' 인공지능(AI)과 로봇공학이 결합된 새로운 시대가 열리고 있다.', errorHints: { tips: ['알파벳 대문자'] } },
  { level: 4, mode: 'dictation', title: '마스터 단계 받아쓰기 2', content: ' 안타깝게도, 그 일은 어제 내린 폭우 때문에 산산이 부서지고 말았다.', errorHints: { tips: ['쉼표', '맞춤법'] } },
];

const level3CorrectionProblems = [
  { level: 3, mode: 'correction', title: '거목 단계 교정 1', content: ' 24시간 내내 운영되는 편의점이 동네 곳곳에 생겨나기 시작했다.', errorHints: { tips: ['숫자 2글자'], wrongText: ' 2 4시간 내내운영되는 편의점이동네 곳곳에생겨나기시작했다.' } },
];

const level4CorrectionProblems = [
  { level: 4, mode: 'correction', title: '마스터 단계 교정 2', content: ' 최근 발표된 보고서에 따르면, IT 업계의 성장세가 예사롭지 않다.', errorHints: { tips: ['알파벳 2글자', '들여쓰기'], wrongText: '최근 발표된 보고서에따르면, I T업계의 성장세가예사롭지않다.' } },
];

async function main() {
  console.log('Seeding Database...');
  try {
    // Delete old data before seeding
    await client`DELETE FROM problems WHERE mode = 'dictation'`;
    await client`DELETE FROM problems WHERE mode = 'correction'`;
    
    // Seed users (teacher & student)
    const passwordHash = await bcrypt.hash('1234', 10);
    // Use upsert or checking logic, or just delete all test users
    await client`DELETE FROM users WHERE email IN ('teacher@test.com', 'student@test.com')`;
    await db.insert(users).values([
      { name: '김선생님', email: 'teacher@test.com', password: passwordHash, role: 'teacher' },
      { name: '이학생', email: 'student@test.com', password: passwordHash, role: 'student' }
    ]);
    console.log('Successfully seeded test users!');

    for (const problem of [...level1Problems, ...level3Problems, ...level4Problems]) {
      await db.insert(problems).values(problem);
    }
    console.log('Successfully seeded dictation problems!');

    for (const problem of [...level1CorrectionProblems, ...level3CorrectionProblems, ...level4CorrectionProblems]) {
      await db.insert(problems).values(problem);
    }
    console.log('Successfully seeded correction problems!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

main();
