import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationTeamMember } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationTeam } from './federation-team.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationTeamMember = WithRequired<
  Partial<IFederationTeamMember>,
  'teamId' | 'playerId' | 'dateFrom'
>;

@Table({ tableName: 'federation_team_member', paranoid: false, timestamps: true })
export class FederationTeamMember extends CustomModel<IFederationTeamMember, CreationModelFederationTeamMember> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(false)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.DATEONLY })
  dateFrom: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  dateTo: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isCaptain: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
