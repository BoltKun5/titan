import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatchday } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';

export type CreationModelFederationMatchday = WithRequired<
  Partial<IFederationMatchday>,
  'poolId' | 'number'
>;

@Table({ tableName: 'federation_matchday', paranoid: false, timestamps: true })
export class FederationMatchday extends CustomModel<IFederationMatchday, CreationModelFederationMatchday> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_matchday_pool_number' })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false)
  @Index({ name: 'fed_matchday_pool_number' })
  @Column({ type: DataType.INTEGER })
  number: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  label: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  plannedDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;
}
