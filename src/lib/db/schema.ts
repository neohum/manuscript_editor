import { pgTable, text, timestamp, integer, uuid, jsonb, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  level: integer('level').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

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
