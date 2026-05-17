import { SportModule } from './sport-module.interface';
import {
  SportType,
  HandballMatchEventSubtype,
  HandballPlayerPosition,
} from '../enums';

export const HandballModule: SportModule = {
  sport: SportType.HANDBALL,
  matchEventSubtypes: Object.values(HandballMatchEventSubtype),
  playerPositions: Object.values(HandballPlayerPosition),
  extensions: {
    player: true,
    match: true,
    playerMatchStats: true,
    playerSeasonStats: true,
    competition: false,
    team: false,
  },
  periods: { count: 2, durationMinutes: 30 },
};
