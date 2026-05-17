import { FederationMatchStatus, MatchSide } from '../../../../enums';

export type ITitanFriendlyMatch = {
  id: string;
  clubAccountId: string;
  homeFederationTeamId: string;
  awayFederationTeamId: string;
  dateUtc: string;
  status: FederationMatchStatus;
  scoreHome: number | null;
  scoreAway: number | null;
  scoreHalfHome: number | null;
  scoreHalfAway: number | null;
  venueId: string | null;
  ourSide: MatchSide;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
