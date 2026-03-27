import { IPlayerMatchStats } from '../../../models/titan/player-match-stats.model';
import { IPlayerSeasonStats } from '../../../models/titan/player-season-stats.model';
import { ITeamSeasonStats } from '../../../models/titan/team-season-stats.model';

export type IPlayerMatchStatsResponse = {
  data: IPlayerMatchStats;
};

export type IPlayerMatchStatsListResponse = {
  data: IPlayerMatchStats[];
};

export type IPlayerSeasonStatsResponse = {
  data: IPlayerSeasonStats;
};

export type IPlayerSeasonStatsListResponse = {
  data: IPlayerSeasonStats[];
};

export type ITeamSeasonStatsResponse = {
  data: ITeamSeasonStats;
};

export type ITeamSeasonStatsListResponse = {
  data: ITeamSeasonStats[];
};

export type IPlayerRankingEntry = {
  playerId: string;
  playerName: string;
  teamName: string | null;
  value: number;
};

export type IPlayerRankingResponse = {
  data: IPlayerRankingEntry[];
};

export type ITeamStatsOverview = {
  team: { id: string; name: string };
  seasonStats: ITeamSeasonStats | null;
  topScorers: IPlayerRankingEntry[];
  topAssists: IPlayerRankingEntry[];
  topSaves: IPlayerRankingEntry[];
};

export type ITeamStatsOverviewResponse = {
  data: ITeamStatsOverview;
};

export type IClubStatsOverview = {
  totalPlayers: number;
  totalTeams: number;
  teamStats: {
    teamId: string;
    teamName: string;
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  }[];
  topScorers: IPlayerRankingEntry[];
  topAssists: IPlayerRankingEntry[];
};

export type IClubStatsOverviewResponse = {
  data: IClubStatsOverview;
};
