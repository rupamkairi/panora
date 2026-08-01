import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'

describe('migration CLI loader', () => {
  it('loads migration modules when executed directly by Bun', () => {
    const result = spawnSync(
      'bun',
      [
        '-e',
        "await import('./src/database/migrate.ts'); console.log('migration-loader-ok')",
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, RUN: '' },
        encoding: 'utf8',
      },
    )

    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('migration-loader-ok')
    expect(result.status).toBe(0)
  })
})
