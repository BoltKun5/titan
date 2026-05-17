import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationSeason, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationSeason = WithRequired<
  Partial<IFederationSeason>,
  'externalId' | 'federationId' | 'sport' | 'label' | 'startDate' | 'endDate'
>;

@Table({ tableName: 'federation_season', paranoid: false, timestamps: true })
export class FederationSeason extends CustomModel<IFederationSeason, CreationModelFederationSeason> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_season_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_season_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  label: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  startDate: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  endDate: string;

  @AllowNull(false) @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCurrent: boolean;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;
}
