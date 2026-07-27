import { describe, expect, it } from 'vitest'

import { MockReportRepository } from '~/features/reports/repository'

describe('MockReportRepository', () => {
  const repository = new MockReportRepository()

  it('filters reports by search across title, publisher, and topic', async () => {
    await expect(repository.list({ search: 'stanford' })).resolves.toMatchObject([
      { id: 'ai-index-2025' },
    ])
    await expect(repository.list({ search: 'climate' })).resolves.toMatchObject([
      { id: 'climate-action' },
    ])
  })

  it('filters by topic and resolves an individual report', async () => {
    await expect(repository.list({ topic: 'Global economy' })).resolves.toHaveLength(1)
    await expect(repository.get('future-of-jobs')).resolves.toMatchObject({
      title: 'Future of Jobs Report',
    })
    await expect(repository.get('missing')).resolves.toBeNull()
  })
})
