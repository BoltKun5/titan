import { MatchStatus, MatchLocation } from '../../../../enums';

export type IMatch = {
  id: string;
  teamId: string;
  seasonId: string;
  venueId: string | null;
  opponent: string;
  date: string;
  status: MatchStatus;
  location: MatchLocation;
  scoreHome: number | null;
  scoreAway: number | null;
  scoreHalfHome: number | null;
  scoreHalfAway: number | null;
  isFriendly: boolean;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
