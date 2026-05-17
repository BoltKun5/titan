import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationStaff } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationClub } from './federation-club.model';

export type CreationModelFederationStaff = WithRequired<
  Partial<IFederationStaff>,
  'externalId' | 'federationId' | 'clubId' | 'firstName' | 'lastName' | 'role'
>;

@Table({ tableName: 'federation_staff', paranoid: false, timestamps: true })
export class FederationStaff extends CustomModel<IFederationStaff, CreationModelFederationStaff> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_staff_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_staff_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  firstName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  lastName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  role: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sectionScope: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationClub)
  club: FederationClub;
}
