import { IMatch, IMatchLineup, IMatchEvent } from '../../../models';

export interface IMatchWithDetails extends IMatch {
  lineup?: IMatchLineup[];
  events?: IMatchEvent[];
}

export interface IMatchResponse {
  match: IMatchWithDetails;
}

export interface IMatchListResponse {
  matches: IMatch[];
}

export interface IStandingsEntry {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface IStandingsResponse {
  standings: IStandingsEntry[];
}
