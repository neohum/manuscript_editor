# Phase 1 — MVP (4주)

## Week 1: 기반 설정

- [ ] Next.js 16 프로젝트 초기화 (TypeScript, Tailwind CSS)
- [ ] `react-korean-manuscript@0.2.3` 설치 및 동작 확인 (임시 테스트 페이지)
- [ ] Railway PostgreSQL 서비스 생성 + `DATABASE_URL` 연결
- [ ] Drizzle ORM 설정 → `schema.ts` 작성 → 초기 마이그레이션 실행
- [ ] `globals.css` CSS 변수 + 타입 파일 초기화

## Week 2: 에디터 핵심

- [ ] `editorStore.ts` — Zustand 에디터 스토어
- [ ] `useManuscriptEditor.ts` — textarea onChange → buildCursorMaps 연동
- [ ] `ManuscriptEditor.tsx` — hidden textarea + `<Manuscript />` 조합
- [ ] `ManuscriptPager.tsx` — 200자 초과 페이지 분리
- [ ] `(training)/layout.tsx` + `SidePanel.tsx` — 2단 레이아웃
- [ ] `editor/page.tsx` — 자유 작성 페이지

## Week 3: 규칙 엔진 + 받아쓰기

- [ ] `src/lib/rules/types.ts` + `indent.ts` + `punctuation.ts` + `quote.ts` + `lineEnd.ts`
- [ ] `src/lib/rules/index.ts` — `runAllRules()` 통합
- [ ] `useRuleChecker.ts` (300ms debounce)
- [ ] `ErrorExplanationPopup.tsx`
- [ ] `src/lib/scoring/index.ts` — 채점 로직
- [ ] `src/lib/db/seed.ts` — Lv.1 받아쓰기 문제 10개
- [ ] `GET /api/problems`, `GET /api/problems/[id]`
- [ ] `DictationSession.tsx` + 받아쓰기 페이지 2개
- [ ] `ScoreBoard.tsx`

## Week 4: 배포

- [ ] `railway.json` + `next.config.ts` (`output: 'standalone'`)
- [ ] `GET /api/health` 헬스체크 엔드포인트
- [ ] 홈 페이지 + `LevelSelector.tsx`
- [ ] 규칙 사전 정적 페이지 (10가지 규칙)
- [ ] `.env.local.example`
- [ ] Railway 첫 배포 → 공개 URL 확인
