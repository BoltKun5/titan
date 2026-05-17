import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPool } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationPhase } from './federation-phase.model';

export type CreationModelFederationPool = WithRequired<
  Partial<IFederationPool>,
  'externalId' | 'federationId' | 'phaseId' | 'name'
>;

@Table({ tableName: 'federation_pool', paranoid: false, timestamps: true })
export class FederationPool extends CustomModel<IFederationPool, CreationModelFederationPool> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_pool_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_pool_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationPhase)
  @Column({ type: DataType.UUID })
  phaseId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  category: string | null;

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

  @BelongsTo(() => FederationPhase)
  phase: FederationPhase;
}
