import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  IFederationMatchEvent, MatchSide, FederationMatchEventType,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationMatchEvent = WithRequired<
  Partial<IFederationMatchEvent>,
  'matchId' | 'minute' | 'side' | 'type'
>;

@Table({ tableName: 'federation_match_event', paranoid: false, timestamps: true })
export class FederationMatchEvent extends CustomModel<IFederationMatchEvent, CreationModelFederationMatchEvent> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index('fed_match_event_match_minute_idx')
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false)
  @Index('fed_match_event_match_minute_idx')
  @Column({ type: DataType.INTEGER })
  minute: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  second: number | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchEventType)) })
  type: FederationMatchEventType;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  subtype: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  playerId: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  relatedPlayerId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB })
  details: Record<string, unknown> | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer, { foreignKey: 'playerId', as: 'player' })
  player: FederationPlayer;

  @BelongsTo(() => FederationPlayer, { foreignKey: 'relatedPlayerId', as: 'relatedPlayer' })
  relatedPlayer: FederationPlayer;
}
