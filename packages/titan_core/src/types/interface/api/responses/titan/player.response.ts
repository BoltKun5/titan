import { IPlayer } from '../../../models/titan/player.model';

export type IPlayerResponse = {
  data: IPlayer;
};

export type IPlayerListResponse = {
  data: IPlayer[];
};

export type IPlayerWithStats = IPlayer & {
  seasonStats?: {
    gamesPlayed: number;
    goals: number;
    assists: number;
    saves: number;
    minutesPlayed: number;
  };
};
