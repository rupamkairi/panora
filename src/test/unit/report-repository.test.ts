import { describe, expect, it } from 'vitest'

import { MockReportRepository } from '~/features/reports/repository'

describe('MockReportRepository', () => {
  const repository = new MockReportRepository()

  it('keeps the report catalog empty until sourced reports are added', async () => {
    await expect(repository.list()).resolves.toEqual([])
    await expect(repository.list({ search: 'stanford' })).resolves.toEqual([])
  })

  it('does not resolve removed sample report identifiers', async () => {
    await expect(repository.list({ topic: 'Global economy' })).resolves.toEqual([])
    await expect(repository.get('future-of-jobs')).resolves.toBeNull()
    await expect(repository.get('missing')).resolves.toBeNull()
  })
})
