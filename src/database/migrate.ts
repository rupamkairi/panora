import { migrate } from '@take-out/postgres/migrate'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { DATABASE_URL } from '~/server/env-server'

const migrationsTS =
  typeof import.meta.glob === 'function'
    ? import.meta.glob(`./migrations/*.ts`)
    : Object.fromEntries(
        readdirSync(fileURLToPath(new URL('./migrations/', import.meta.url).href))
          .filter((file) => /^\d+.*\.ts$/.test(file))
          .map((file) => [
            `./migrations/${file}`,
            () => import(new URL(`./migrations/${file}`, import.meta.url).href),
          ]),
      )

// vite tries to eval this at build time :/
const PROCESS_ENV = globalThis['process']['env']

export async function main() {
  console.info('🔄 waiting for database to be ready...')
  await waitForDatabase(DATABASE_URL)

  console.info('🚀 running migrations...')
  await migrate({
    connectionString: DATABASE_URL,
    migrationsGlob: migrationsTS,
    gitSha: process.env.GIT_SHA,
    // @take-out/postgres exits the CLI process after this callback, so the
    // completion message must be emitted here rather than after migrate().
    onMigrationComplete: async () => {
      console.info('✅ migrations complete')
    },
  })
}

if (import.meta.main || PROCESS_ENV.RUN) {
  main().catch((err: unknown) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
}

async function waitForDatabase(connectionString: string, maxRetries = 30) {
  const { Pool } = await import('pg')

  for (let i = 0; i < maxRetries; i++) {
    try {
      const pool = new Pool({
        connectionString,
        ssl: connectionString.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined,
      })
      await pool.query('SELECT 1')
      await pool.end()
      console.info('✅ database connection successful')
      return
    } catch (err) {
      const delay = Math.min(1000 * 1.5 ** i, 10000)
      console.info(
        `⏳ waiting for database... attempt ${i + 1}/${maxRetries} (retry in ${delay}ms)`,
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error('database connection timeout after ' + maxRetries + ' attempts')
}
