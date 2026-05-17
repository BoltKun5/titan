import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPoolTeam } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';

export type CreationModelFederationPoolTeam = WithRequired<
  Partial<IFederationPoolTeam>,
  'poolId' | 'teamId'
>;

@Table({ tableName: 'federation_pool_team', paranoid: false, timestamps: true })
export class FederationPoolTeam extends CustomModel<IFederationPoolTeam, CreationModelFederationPoolTeam> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_pool_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index({ name: 'fed_pool_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  withdrawn: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;
}
