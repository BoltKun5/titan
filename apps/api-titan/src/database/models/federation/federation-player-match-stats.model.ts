import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayerMatchStats, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationPlayerMatchStats = WithRequired<
  Partial<IFederationPlayerMatchStats>,
  'matchId' | 'playerId' | 'side'
>;

@Table({ tableName: 'federation_player_match_stats', paranoid: false, timestamps: true })
export class FederationPlayerMatchStats extends CustomModel<IFederationPlayerMatchStats, CreationModelFederationPlayerMatchStats> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index({ name: 'fed_pms_unique', unique: true })
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_pms_unique', unique: true })
  @Index('fed_pms_player_idx')
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  minutesPlayed: number | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  goals: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  assists: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  saves: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
