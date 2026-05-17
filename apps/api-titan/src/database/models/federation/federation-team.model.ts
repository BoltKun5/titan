import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationTeam, FederationGender } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationClub } from './federation-club.model';
import { FederationSeason } from './federation-season.model';

export type CreationModelFederationTeam = WithRequired<
  Partial<IFederationTeam>,
  'externalId' | 'federationId' | 'clubId' | 'seasonId' | 'name' | 'category' | 'genderSection'
>;

@Table({ tableName: 'federation_team', paranoid: false, timestamps: true })
export class FederationTeam extends CustomModel<IFederationTeam, CreationModelFederationTeam> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_team_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  category: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationGender)) })
  genderSection: FederationGender;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  level: string | null;

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

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
