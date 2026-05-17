export type IFederationStaff = {
  id: string;
  externalId: string;
  federationId: string;
  clubId: string;
  firstName: string;
  lastName: string;
  role: string;
  sectionScope: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
