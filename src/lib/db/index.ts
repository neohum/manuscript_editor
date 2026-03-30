import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> };

if (!globalForDb.db) {
  const client = postgres(process.env.DATABASE_URL as string, {
    max: 5, 
    idle_timeout: 20, 
    connect_timeout: 10,
  });
  globalForDb.db = drizzle(client, { schema });
}

export const db = globalForDb.db;
