import { MatchSide, FederationMatchEventType } from '../../../../enums';

export type IFederationMatchEvent = {
  id: string;
  matchId: string;
  minute: number;
  second: number | null;
  side: MatchSide;
  type: FederationMatchEventType;
  subtype: string | null;
  playerId: string | null;
  relatedPlayerId: string | null;
  details: Record<string, unknown> | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
