export type IFederationPlayerSeasonStats = {
  id: string;
  seasonId: string;
  playerId: string;
  competitionId: string | null;
  matchesPlayed: number;
  goals: number;
  assists: number;
  saves: number | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
