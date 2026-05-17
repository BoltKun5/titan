export type IFederationPoolTeam = {
  id: string;
  poolId: string;
  teamId: string;
  withdrawn: boolean;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
