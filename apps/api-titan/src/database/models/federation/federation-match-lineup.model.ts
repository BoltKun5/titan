import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatchLineup, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationMatchLineup = WithRequired<
  Partial<IFederationMatchLineup>,
  'matchId' | 'playerId' | 'side' | 'starter'
>;

@Table({ tableName: 'federation_match_lineup', paranoid: false, timestamps: true })
export class FederationMatchLineup extends CustomModel<IFederationMatchLineup, CreationModelFederationMatchLineup> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index({ name: 'fed_lineup_unique', unique: true })
  @Index('fed_lineup_match_side_idx')
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_lineup_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(false)
  @Index('fed_lineup_match_side_idx')
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

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
