import { MatchLocation, MatchEventType, MatchStatus } from '../../../../../enums';

export interface ICreateMatchBody {
  teamId: string;
  seasonId: string;
  venueId?: string;
  opponent: string;
  date: string;
  location: MatchLocation;
  isFriendly?: boolean;
}

export interface IUpdateMatchBody {
  venueId?: string;
  opponent?: string;
  date?: string;
  status?: MatchStatus;
  location?: MatchLocation;
  scoreHome?: number;
  scoreAway?: number;
  scoreHalfHome?: number;
  scoreHalfAway?: number;
  notes?: string;
  isFriendly?: boolean;
}

export interface ISetMatchLineupBody {
  lineup: {
    clubMemberId: string;
    position?: string;
    isStarter: boolean;
  }[];
}

export interface IAddMatchEventBody {
  clubMemberId?: string;
  eventType: MatchEventType;
  subtype?: string;
  minute?: number;
  period?: string;
  details?: Record<string, any>;
}
