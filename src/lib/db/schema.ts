import { pgTable, text, timestamp, integer, uuid, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  password: text('password'),
  image: text('image'),
  role: text('role').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  pk: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

export const classrooms = pgTable('classrooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  inviteCode: text('invite_code').unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const classroomMembers = pgTable('classroom_members', {
  classroomId: uuid('classroom_id').references(() => classrooms.id).notNull(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.classroomId, table.studentId] })
}));

export const problems = pgTable('problems', {
  id: uuid('id').primaryKey().defaultRandom(),
  level: integer('level').notNull(), 
  mode: text('mode').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  errorHints: jsonb('error_hints'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const learningSessions = pgTable('learning_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  problemId: uuid('problem_id').references(() => problems.id),
  mode: text('mode').notNull(),
  score: integer('score'),
  durationSec: integer('duration_sec'),
  finalText: text('final_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const errorLogs = pgTable('error_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => learningSessions.id),
  cellIndex: integer('cell_index').notNull(),
  errorType: text('error_type').notNull(),
  wrongText: text('wrong_text'),
  correctText: text('correct_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
