import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPhase } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationCompetition } from './federation-competition.model';

export type CreationModelFederationPhase = WithRequired<
  Partial<IFederationPhase>,
  'competitionId' | 'name' | 'order'
>;

@Table({ tableName: 'federation_phase', paranoid: false, timestamps: true })
export class FederationPhase extends CustomModel<IFederationPhase, CreationModelFederationPhase> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationCompetition)
  @Column({ type: DataType.UUID })
  competitionId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  order: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  startDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  endDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => FederationCompetition)
  competition: FederationCompetition;
}
