import { SportType } from '../enums';

export interface SportModuleExtensions {
  player: boolean;
  match: boolean;
  playerMatchStats: boolean;
  playerSeasonStats: boolean;
  competition: boolean;
  team: boolean;
}

export interface SportModulePeriods {
  count: number;
  durationMinutes: number;
}

export interface SportModule {
  sport: SportType;
  matchEventSubtypes: readonly string[];
  playerPositions: readonly string[];
  extensions: SportModuleExtensions;
  periods: SportModulePeriods;
}
