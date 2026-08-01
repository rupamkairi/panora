import { loadEnv as vxrnLoadEnv } from 'vxrn/loadEnv'

export async function getTestEnv() {
  // load development environment
  await vxrnLoadEnv('development')

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must point to the configured Neon test database')
  }

  return {
    CI: 'true',
    DO_NOT_TRACK: '1',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:8081',
    ONE_SERVER_URL: 'http://localhost:8081',
    POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN || 'test-token',
    VITE_DEMO_MODE: '1',
    VITE_WEB_HOSTNAME: '',
    DATABASE_URL: process.env.DATABASE_URL,
  }
}
