export type IFederationTeamMember = {
  id: string;
  teamId: string;
  playerId: string;
  jerseyNumber: number | null;
  position: string | null;
  dateFrom: string;
  dateTo: string | null;
  isCaptain: boolean;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
