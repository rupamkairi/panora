import type { ReportQuery, ReportRepository, ReportSummary } from './types'

export const sampleReports: ReportSummary[] = [
  {
    id: 'ai-index-2025',
    title: 'AI Index Report 2025',
    publisher: 'Stanford Institute for Human-Centered AI',
    publishedAt: 'April 2025',
    topic: 'Artificial intelligence',
    readingMinutes: 32,
    pageCount: 456,
    progress: 58,
    status: 'available',
    description:
      'A sample workspace demonstrating how Panora can make a long annual report easier to navigate and understand.',
    keyThemes: [
      {
        title: 'Capability is moving quickly',
        description:
          'Performance improved across demanding benchmarks while the cost of using capable models continued to fall.',
      },
      {
        title: 'Adoption is becoming operational',
        description:
          'Organizations are moving beyond experiments and reshaping workflows around repeatable uses.',
      },
      {
        title: 'Governance is part of deployment',
        description:
          'Transparency, evaluation, and accountability increasingly determine whether adoption can scale responsibly.',
      },
    ],
  },
  {
    id: 'world-economic-outlook',
    title: 'World Economic Outlook',
    publisher: 'International Monetary Fund',
    publishedAt: 'October 2025',
    topic: 'Global economy',
    readingMinutes: 26,
    pageCount: 198,
    progress: 21,
    status: 'available',
    description:
      'Illustrative catalog entry for exploring global growth, inflation, and policy trade-offs.',
    keyThemes: [
      {
        title: 'Growth remains uneven',
        description:
          'The recovery differs substantially across regions, income groups, and policy environments.',
      },
      {
        title: 'Inflation has not disappeared',
        description:
          'Price pressures are easing in aggregate while remaining persistent in important categories.',
      },
      {
        title: 'Policy choices carry trade-offs',
        description:
          'Governments must balance stability, investment, fiscal resilience, and household pressures.',
      },
    ],
  },
  {
    id: 'future-of-jobs',
    title: 'Future of Jobs Report',
    publisher: 'World Economic Forum',
    publishedAt: 'January 2025',
    topic: 'Work and skills',
    readingMinutes: 22,
    pageCount: 290,
    progress: 0,
    status: 'available',
    description:
      'Illustrative catalog entry about changing occupations, skills, and workforce transitions.',
    keyThemes: [
      {
        title: 'Tasks change before occupations disappear',
        description:
          'Many roles are being recomposed as tools alter how individual tasks are performed.',
      },
      {
        title: 'Learning becomes continuous',
        description:
          'Adaptability and access to practical reskilling matter across career stages.',
      },
      {
        title: 'Transitions are not evenly distributed',
        description:
          'The costs and opportunities of change differ across industries, regions, and workers.',
      },
    ],
  },
  {
    id: 'climate-action',
    title: 'State of Climate Action',
    publisher: 'World Resources Institute',
    publishedAt: 'November 2024',
    topic: 'Climate',
    readingMinutes: 18,
    pageCount: 96,
    progress: 0,
    status: 'available',
    description:
      'Illustrative catalog entry tracking progress across the systems needed for climate action.',
    keyThemes: [
      {
        title: 'Progress differs by system',
        description: 'Some transitions are accelerating while others remain far off track.',
      },
      {
        title: 'Infrastructure shapes pace',
        description:
          'Delivery depends on grids, transport, buildings, land use, and long-term investment.',
      },
      {
        title: 'Accountability needs comparable measures',
        description:
          'Consistent indicators make it easier to see where commitments translate into outcomes.',
      },
    ],
  },
]

export class MockReportRepository implements ReportRepository {
  async list(query: ReportQuery = {}) {
    const search = query.search?.trim().toLowerCase()
    return sampleReports.filter((report) => {
      const matchesTopic = !query.topic || query.topic === 'All' || report.topic === query.topic
      const matchesSearch =
        !search ||
        `${report.title} ${report.publisher} ${report.topic}`
          .toLowerCase()
          .includes(search)
      return matchesTopic && matchesSearch
    })
  }

  async get(id: string) {
    return sampleReports.find((report) => report.id === id) ?? null
  }
}

export const reportRepository = new MockReportRepository()
