import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationVenue } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationVenue = WithRequired<
  Partial<IFederationVenue>,
  'federationId' | 'name'
>;

@Table({ tableName: 'federation_venue', paranoid: false, timestamps: true })
export class FederationVenue extends CustomModel<IFederationVenue, CreationModelFederationVenue> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  address: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  city: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  postalCode: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  capacity: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DECIMAL(9, 6) })
  latitude: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DECIMAL(9, 6) })
  longitude: string | null;

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
