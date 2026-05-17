import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayer, FederationGender } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationPlayer = WithRequired<
  Partial<IFederationPlayer>,
  'externalId' | 'federationId' | 'firstName' | 'lastName'
>;

@Table({ tableName: 'federation_player', paranoid: false, timestamps: true })
export class FederationPlayer extends CustomModel<IFederationPlayer, CreationModelFederationPlayer> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_player_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_player_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  licenseNumber: string | null;

  @AllowNull(false) @Column({ type: DataType.STRING })
  firstName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  lastName: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  birthDate: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.ENUM(...Object.values(FederationGender)) })
  gender: FederationGender | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  nationality: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  photoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  height: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  weight: number | null;

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
