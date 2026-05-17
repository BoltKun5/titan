import { MatchSide, FederationMatchEventType } from '../../../../enums';

export type ITitanFriendlyMatchEvent = {
  id: string;
  friendlyMatchId: string;
  minute: number;
  second: number | null;
  side: MatchSide;
  type: FederationMatchEventType;
  subtype: string | null;
  federationPlayerId: string | null;
  details: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};
