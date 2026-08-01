import type { ReportQuery, ReportRepository, ReportSummary } from "./types";

export const sampleReports: ReportSummary[] = [];

export class DocumentReportRepository implements ReportRepository {
  async list(query: ReportQuery = {}) {
    const response = await fetch("/api/documents");
    if (!response.ok)
      throw new Error("The document library could not be loaded.");
    const body = (await response.json()) as {
      documents: Array<{
        id: string;
        title: string;
        status: "ready";
      }>;
    };
    const search = query.search?.trim().toLowerCase();
    return body.documents
      .filter(
        (document) => !search || document.title.toLowerCase().includes(search),
      )
      .map((document) => ({
        id: document.id,
        title: document.title,
        publisher: "Indexed document",
        publishedAt: "",
        topic: "Document",
        readingMinutes: 0,
        pageCount: 0,
        progress: 100,
        status: "available" as const,
        description: "",
        keyThemes: [],
      }));
  }

  async get(id: string) {
    return (await this.list()).find((document) => document.id === id) ?? null;
  }
}

export class MockReportRepository implements ReportRepository {
  async list(query: ReportQuery = {}) {
    const search = query.search?.trim().toLowerCase();
    return sampleReports.filter((report) => {
      const matchesTopic =
        !query.topic || query.topic === "All" || report.topic === query.topic;
      const matchesSearch =
        !search ||
        `${report.title} ${report.publisher} ${report.topic}`
          .toLowerCase()
          .includes(search);
      return matchesTopic && matchesSearch;
    });
  }

  async get(id: string) {
    return sampleReports.find((report) => report.id === id) ?? null;
  }
}

export const reportRepository = new DocumentReportRepository();
