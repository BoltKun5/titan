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
import { IPlayerMatchStats } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Player } from './player.model';
import { Match } from './match.model';

export type CreationModelPlayerMatchStats = WithRequired<
  Partial<IPlayerMatchStats>,
  'playerId' | 'matchId'
>;

@Table({
  tableName: 'titan_player_match_stats',
  paranoid: false,
  timestamps: true,
})
export class PlayerMatchStats extends CustomModel<
  IPlayerMatchStats,
  CreationModelPlayerMatchStats
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
  @ForeignKey(() => Match)
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isStarter: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  minutesPlayed: number | null;

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

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  shotsAttempted: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  penaltiesAttempted: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  penaltiesScored: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.FLOAT })
  rating: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSONB })
  customStats: Record<string, any> | null;

  @BelongsTo(() => Player)
  player: Player;

  @BelongsTo(() => Match)
  match: Match;
}
