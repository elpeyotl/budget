import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDatabase() {
  if (!_db) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    _db = drizzle(client, { schema })
  }
  return _db
}
