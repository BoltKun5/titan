import { MatchSide } from '../../../../enums';

export type IFederationPlayerMatchStats = {
  id: string;
  matchId: string;
  playerId: string;
  side: MatchSide;
  minutesPlayed: number | null;
  goals: number;
  assists: number;
  saves: number | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
