import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayerSeasonStats } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationSeason } from './federation-season.model';
import { FederationPlayer } from './federation-player.model';
import { FederationCompetition } from './federation-competition.model';

export type CreationModelFederationPlayerSeasonStats = WithRequired<
  Partial<IFederationPlayerSeasonStats>,
  'seasonId' | 'playerId' | 'matchesPlayed' | 'goals' | 'assists'
>;

@Table({ tableName: 'federation_player_season_stats', paranoid: false, timestamps: true })
export class FederationPlayerSeasonStats extends CustomModel<IFederationPlayerSeasonStats, CreationModelFederationPlayerSeasonStats> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationCompetition)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  competitionId: string | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  matchesPlayed: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  goals: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  assists: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  saves: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;

  @BelongsTo(() => FederationCompetition)
  competition: FederationCompetition;
}
