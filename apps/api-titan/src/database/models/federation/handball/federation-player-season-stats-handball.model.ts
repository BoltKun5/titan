import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationPlayerSeasonStatsHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayerSeasonStats } from '../federation-player-season-stats.model';

export type CreationModelFederationPlayerSeasonStatsHandball = WithRequired<
  Partial<IFederationPlayerSeasonStatsHandball>,
  'seasonStatsId'
>;

@Table({ tableName: 'federation_player_season_stats_handball', paranoid: false, timestamps: true })
export class FederationPlayerSeasonStatsHandball extends CustomModel<IFederationPlayerSeasonStatsHandball, CreationModelFederationPlayerSeasonStatsHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayerSeasonStats)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  seasonStatsId: string;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedFastbreak: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeFastbreak: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER }) savesTotal: number | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) twoMinutesCount: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) yellowCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) redCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) blueCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) disqualifications: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) assists: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) technicalFaults: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) steals: number;

  @BelongsTo(() => FederationPlayerSeasonStats)
  seasonStats: FederationPlayerSeasonStats;
}
