import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationClub } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationClub = WithRequired<
  Partial<IFederationClub>,
  'externalId' | 'federationId' | 'name'
>;

@Table({ tableName: 'federation_club', paranoid: false, timestamps: true })
export class FederationClub extends CustomModel<IFederationClub, CreationModelFederationClub> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_club_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_club_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  shortName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  city: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  logoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSON })
  colors: string[] | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  website: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  phone: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  email: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  foundingYear: number | null;

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
}
