# Phase 2 — 학습 시스템 (4주)

## Week 5: 인증
- [ ] `auth.ts` (루트) — Auth.js v5 Credentials + DrizzleAdapter
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `app/api/auth/register/route.ts` — 회원가입 (bcrypt)
- [ ] `middleware.ts` — 경로 보호 + 교사 역할 가드
- [ ] 로그인/회원가입 페이지
- [ ] `schema.ts`에 Auth.js 필수 컬럼/테이블 추가

## Week 6: 세션 저장 + 교정 퀴즈
- [ ] `sessionStore.ts` + `useTimer.ts`
- [ ] `POST /api/sessions` + `POST /api/errors` + `GET /api/sessions/[id]`
- [ ] `DictationSession.tsx`에 세션 저장 연동
- [ ] Lv.1~2 교정 문제 10개 seed 추가
- [ ] `CorrectionSession.tsx` (onCellClick 판정 로직)
- [ ] 교정 퀴즈 페이지 2개

## Week 7: 맞춤법 + 개인 리포트
- [ ] `hanspell.ts` + `localDict.ts` (상위 50개 어휘)
- [ ] `POST /api/spellcheck`
- [ ] `spacing.ts` + `spelling.ts` 규칙 모듈
- [ ] `GET /api/reports/me` (Drizzle 집계 쿼리)
- [ ] `ErrorDistributionChart.tsx` + `ErrorTrendChart.tsx`
- [ ] `reports/page.tsx`

## Week 8: 레벨 시스템 + 반응형
- [ ] `numberAlpha.ts` 규칙 구현
- [ ] 레벨 업 로직 (세션 점수 누적 → DB 업데이트)
- [ ] `Badge.tsx` + 헤더 레벨 표시
- [ ] Tailwind 반응형 breakpoint 적용 (태블릿)
- [ ] Lv.3~4 문제 seed 추가
