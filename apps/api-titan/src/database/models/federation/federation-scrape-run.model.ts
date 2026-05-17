import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  IFederationScrapeRun, ScrapeRunStatus, ScrapeRunTrigger,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { User } from '../user.model';

export type CreationModelFederationScrapeRun = WithRequired<
  Partial<IFederationScrapeRun>,
  'federationId' | 'startedAt' | 'status' | 'trigger' | 'targetType'
>;

@Table({ tableName: 'federation_scrape_run', paranoid: false, timestamps: true })
export class FederationScrapeRun extends CustomModel<IFederationScrapeRun, CreationModelFederationScrapeRun> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @Column({ type: DataType.DATE })
  startedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  finishedAt: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ScrapeRunStatus)) })
  status: ScrapeRunStatus;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ScrapeRunTrigger)) })
  trigger: ScrapeRunTrigger;

  @AllowNull(false) @Column({ type: DataType.STRING })
  targetType: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  targetExternalId: string | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsInserted: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsUpdated: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsSkipped: number;

  @AllowNull(false) @Default([]) @Column({ type: DataType.JSONB })
  errors: Array<{ message: string; context?: Record<string, unknown> }>;

  @AllowNull(true) @Default(null) @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  initiatedByUserId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  durationMs: number | null;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => User)
  initiatedByUser: User;
}
