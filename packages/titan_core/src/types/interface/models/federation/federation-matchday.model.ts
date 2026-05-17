export type IFederationMatchday = {
  id: string;
  externalId: string | null;
  poolId: string;
  number: number;
  label: string | null;
  plannedDate: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
