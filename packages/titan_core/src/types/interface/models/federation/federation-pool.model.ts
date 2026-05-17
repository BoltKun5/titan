export type IFederationPool = {
  id: string;
  externalId: string;
  federationId: string;
  phaseId: string;
  name: string;
  category: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
