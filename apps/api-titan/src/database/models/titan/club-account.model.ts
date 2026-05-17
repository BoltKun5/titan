import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanClubAccount } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationClub } from '../federation/federation-club.model';

export type CreationModelTitanClubAccount = WithRequired<
  Partial<ITitanClubAccount>,
  'federationClubId' | 'subscriptionPlan' | 'subscriptionStatus' | 'subscribedAt'
>;

@Table({ tableName: 'titan_club_account', paranoid: false, timestamps: true })
export class TitanClubAccount extends CustomModel<ITitanClubAccount, CreationModelTitanClubAccount> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  federationClubId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  displayName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSON })
  brandingColors: string[] | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  brandingLogoUrl: string | null;

  @AllowNull(false) @Default('free') @Column({ type: DataType.STRING })
  subscriptionPlan: string;

  @AllowNull(false) @Default('active') @Column({ type: DataType.STRING })
  subscriptionStatus: string;

  @AllowNull(false) @Default(() => new Date())
  @Column({ type: DataType.DATE })
  subscribedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  cancelledAt: string | null;

  @BelongsTo(() => FederationClub)
  federationClub: FederationClub;
}
