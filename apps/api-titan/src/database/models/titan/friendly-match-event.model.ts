import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  ITitanFriendlyMatchEvent, MatchSide, FederationMatchEventType,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanFriendlyMatch } from './friendly-match.model';
import { FederationPlayer } from '../federation/federation-player.model';

export type CreationModelTitanFriendlyMatchEvent = WithRequired<
  Partial<ITitanFriendlyMatchEvent>,
  'friendlyMatchId' | 'minute' | 'side' | 'type'
>;

@Table({ tableName: 'titan_friendly_match_event', paranoid: false, timestamps: true })
export class TitanFriendlyMatchEvent extends CustomModel<ITitanFriendlyMatchEvent, CreationModelTitanFriendlyMatchEvent> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanFriendlyMatch)
  @Index('titan_fme_match_minute_idx')
  @Column({ type: DataType.UUID })
  friendlyMatchId: string;

  @AllowNull(false)
  @Index('titan_fme_match_minute_idx')
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

  @AllowNull(true) @Default(null)
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  federationPlayerId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB })
  details: Record<string, unknown> | null;

  @BelongsTo(() => TitanFriendlyMatch)
  friendlyMatch: TitanFriendlyMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
