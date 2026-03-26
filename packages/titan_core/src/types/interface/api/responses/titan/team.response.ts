import { ITeam, ITeamPlayer } from '../../../models';
import { IUser } from '../../../models';

export interface ITeamWithPlayers extends ITeam {
  players?: (ITeamPlayer & { user?: Partial<IUser> })[];
}

export interface ITeamResponse {
  team: ITeamWithPlayers;
}

export interface ITeamListResponse {
  teams: ITeam[];
}
