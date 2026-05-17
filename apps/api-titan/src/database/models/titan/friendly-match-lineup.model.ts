import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanFriendlyMatchLineup, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanFriendlyMatch } from './friendly-match.model';
import { FederationPlayer } from '../federation/federation-player.model';

export type CreationModelTitanFriendlyMatchLineup = WithRequired<
  Partial<ITitanFriendlyMatchLineup>,
  'friendlyMatchId' | 'federationPlayerId' | 'side' | 'starter'
>;

@Table({ tableName: 'titan_friendly_match_lineup', paranoid: false, timestamps: true })
export class TitanFriendlyMatchLineup extends CustomModel<ITitanFriendlyMatchLineup, CreationModelTitanFriendlyMatchLineup> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanFriendlyMatch)
  @Index({ name: 'titan_fml_unique', unique: true })
  @Column({ type: DataType.UUID })
  friendlyMatchId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationPlayer)
  @Index({ name: 'titan_fml_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationPlayerId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(false) @Column({ type: DataType.BOOLEAN })
  starter: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isCaptain: boolean;

  @BelongsTo(() => TitanFriendlyMatch)
  friendlyMatch: TitanFriendlyMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
