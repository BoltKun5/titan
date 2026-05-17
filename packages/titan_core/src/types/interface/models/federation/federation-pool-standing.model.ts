export type IFederationPoolStanding = {
  id: string;
  poolId: string;
  teamId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  penaltyPoints: number;
  scrapedAt: string;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
