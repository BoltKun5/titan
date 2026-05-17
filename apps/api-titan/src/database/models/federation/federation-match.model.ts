import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatch, FederationMatchStatus, ForfeitSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationMatchday } from './federation-matchday.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';
import { FederationVenue } from './federation-venue.model';

export type CreationModelFederationMatch = WithRequired<
  Partial<IFederationMatch>,
  'externalId' | 'federationId' | 'homeTeamId' | 'awayTeamId' | 'dateUtc' | 'status'
>;

@Table({ tableName: 'federation_match', paranoid: false, timestamps: true })
export class FederationMatch extends CustomModel<IFederationMatch, CreationModelFederationMatch> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_match_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_match_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationMatchday)
  @Index('fed_match_matchday_idx')
  @Column({ type: DataType.UUID })
  matchdayId: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPool)
  @Index('fed_match_pool_idx')
  @Column({ type: DataType.UUID })
  poolId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index('fed_match_home_idx')
  @Column({ type: DataType.UUID })
  homeTeamId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index('fed_match_away_idx')
  @Column({ type: DataType.UUID })
  awayTeamId: string;

  @AllowNull(false)
  @Index('fed_match_date_idx')
  @Column({ type: DataType.DATE })
  dateUtc: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchStatus)) })
  status: FederationMatchStatus;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreAway: number | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationVenue)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.ENUM(...Object.values(ForfeitSide)) })
  forfeitSide: ForfeitSide | null;

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

  @BelongsTo(() => FederationMatchday)
  matchday: FederationMatchday;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam, { foreignKey: 'homeTeamId', as: 'homeTeam' })
  homeTeam: FederationTeam;

  @BelongsTo(() => FederationTeam, { foreignKey: 'awayTeamId', as: 'awayTeam' })
  awayTeam: FederationTeam;

  @BelongsTo(() => FederationVenue)
  venue: FederationVenue;
}
