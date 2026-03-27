import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITeamSeasonStats } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Team } from './team.model';
import { Season } from './season.model';

export type CreationModelTeamSeasonStats = WithRequired<
  Partial<ITeamSeasonStats>,
  'teamId' | 'seasonId'
>;

@Table({
  tableName: 'titan_team_season_stats',
  paranoid: false,
  timestamps: true,
})
export class TeamSeasonStats extends CustomModel<
  ITeamSeasonStats,
  CreationModelTeamSeasonStats
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Team)
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  gamesPlayed: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  wins: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  draws: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  losses: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  goalsFor: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  goalsAgainst: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  goalDifference: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  points: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  rank: number | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  homeWins: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  homeDraws: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  homeLosses: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  awayWins: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  awayDraws: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  awayLosses: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  longestWinStreak: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  longestUnbeatenStreak: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  longestLossStreak: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  currentStreakType: string | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  currentStreakCount: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  customStats: Record<string, any> | null;

  @BelongsTo(() => Team)
  team: Team;

  @BelongsTo(() => Season)
  season: Season;
}
