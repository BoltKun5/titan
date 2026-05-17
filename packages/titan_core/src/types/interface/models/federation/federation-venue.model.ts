export type IFederationVenue = {
  id: string;
  externalId: string | null;
  federationId: string;
  name: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  capacity: number | null;
  latitude: string | null;
  longitude: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
