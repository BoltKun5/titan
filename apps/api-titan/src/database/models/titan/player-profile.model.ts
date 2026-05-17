import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanPlayerProfile } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPlayer } from '../federation/federation-player.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';

export type CreationModelTitanPlayerProfile = WithRequired<
  Partial<ITitanPlayerProfile>,
  'federationPlayerId' | 'clubAccountId'
>;

@Table({ tableName: 'titan_player_profile', paranoid: false, timestamps: true })
export class TitanPlayerProfile extends CustomModel<ITitanPlayerProfile, CreationModelTitanPlayerProfile> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  federationPlayerId: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  customPhotoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactPhone: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactRelation: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  internalNotes: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  imageRightsConsented: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  imageRightsConsentDate: string | null;

  @BelongsTo(() => FederationPlayer)
  federationPlayer: FederationPlayer;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User)
  user: User;
}
