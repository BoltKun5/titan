import { MatchSide } from '../../../../enums';

export type ITitanFriendlyMatchLineup = {
  id: string;
  friendlyMatchId: string;
  federationPlayerId: string;
  side: MatchSide;
  starter: boolean;
  jerseyNumber: number | null;
  position: string | null;
  isCaptain: boolean;
  createdAt?: string;
  updatedAt?: string;
};
