import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPoolStanding } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';

export type CreationModelFederationPoolStanding = WithRequired<
  Partial<IFederationPoolStanding>,
  'poolId' | 'teamId' | 'rank' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference' | 'points' | 'scrapedAt'
>;

@Table({ tableName: 'federation_pool_standing', paranoid: false, timestamps: true })
export class FederationPoolStanding extends CustomModel<IFederationPoolStanding, CreationModelFederationPoolStanding> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_standing_pool_scraped' })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  rank: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  played: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  won: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  drawn: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  lost: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalsFor: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalsAgainst: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalDifference: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  points: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  penaltyPoints: number;

  @AllowNull(false)
  @Index({ name: 'fed_standing_pool_scraped' })
  @Column({ type: DataType.DATE })
  scrapedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;
}
