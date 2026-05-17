export type IFederationPhase = {
  id: string;
  externalId: string | null;
  competitionId: string;
  name: string;
  order: number;
  startDate: string | null;
  endDate: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
