export type ReportStatus = 'available' | 'processing' | 'failed'
export type ReportWorkspaceMode = 'overview' | 'questions' | 'quiz' | 'chat'

export type ReportSummary = {
  id: string
  title: string
  publisher: string
  publishedAt: string
  topic: string
  readingMinutes: number
  pageCount: number
  progress: number
  status: ReportStatus
  description: string
  keyThemes: Array<{ title: string; description: string }>
}

export type ReportQuery = {
  search?: string
  topic?: string
}

export interface ReportRepository {
  list(query?: ReportQuery): Promise<ReportSummary[]>
  get(id: string): Promise<ReportSummary | null>
}
