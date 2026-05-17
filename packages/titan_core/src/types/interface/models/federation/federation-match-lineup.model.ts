import { MatchSide } from '../../../../enums';

export type IFederationMatchLineup = {
  id: string;
  matchId: string;
  playerId: string;
  side: MatchSide;
  starter: boolean;
  jerseyNumber: number | null;
  position: string | null;
  isCaptain: boolean;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
