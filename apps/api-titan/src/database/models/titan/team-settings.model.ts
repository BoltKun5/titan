import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanTeamSettings } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationTeam } from '../federation/federation-team.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';

export type CreationModelTitanTeamSettings = WithRequired<
  Partial<ITitanTeamSettings>,
  'federationTeamId' | 'clubAccountId'
>;

@Table({ tableName: 'titan_team_settings', paranoid: false, timestamps: true })
export class TitanTeamSettings extends CustomModel<ITitanTeamSettings, CreationModelTitanTeamSettings> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  federationTeamId: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  coachUserId: string | null;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  assistantCoachUserId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  internalNotes: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  displayColor: string | null;

  @BelongsTo(() => FederationTeam)
  federationTeam: FederationTeam;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User, { foreignKey: 'coachUserId', as: 'coach' })
  coach: User;

  @BelongsTo(() => User, { foreignKey: 'assistantCoachUserId', as: 'assistantCoach' })
  assistantCoach: User;
}
