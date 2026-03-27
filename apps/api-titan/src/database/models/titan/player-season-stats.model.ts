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
import { IPlayerSeasonStats } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Player } from './player.model';
import { Season } from './season.model';
import { Team } from './team.model';

export type CreationModelPlayerSeasonStats = WithRequired<
  Partial<IPlayerSeasonStats>,
  'playerId' | 'seasonId'
>;

@Table({
  tableName: 'titan_player_season_stats',
  paranoid: false,
  timestamps: true,
})
export class PlayerSeasonStats extends CustomModel<
  IPlayerSeasonStats,
  CreationModelPlayerSeasonStats
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(false)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => Team)
  @Column({ type: DataType.UUID })
  teamId: string | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  gamesPlayed: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  gamesStarted: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  minutesPlayed: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  goals: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  goalDetails: Record<string, number> | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  assists: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  saves: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  saveDetails: Record<string, number> | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  sanctions: Record<string, number> | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  shotsAttempted: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.FLOAT })
  shootingPercentage: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.FLOAT })
  savePercentage: number | null;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  penaltiesAttempted: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  penaltiesScored: number;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  customStats: Record<string, any> | null;

  @BelongsTo(() => Player)
  player: Player;

  @BelongsTo(() => Season)
  season: Season;

  @BelongsTo(() => Team)
  team: Team;
}
