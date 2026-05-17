import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationPlayerMatchStatsHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayerMatchStats } from '../federation-player-match-stats.model';

export type CreationModelFederationPlayerMatchStatsHandball = WithRequired<
  Partial<IFederationPlayerMatchStatsHandball>,
  'matchStatsId'
>;

@Table({ tableName: 'federation_player_match_stats_handball', paranoid: false, timestamps: true })
export class FederationPlayerMatchStatsHandball extends CustomModel<IFederationPlayerMatchStatsHandball, CreationModelFederationPlayerMatchStatsHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayerMatchStats)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  matchStatsId: string;

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
  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB }) savesByZone: Record<string, number> | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) twoMinutesCount: number;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) yellowCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) redCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) blueCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) disqualified: boolean;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) assists: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) technicalFaults: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) steals: number;

  @BelongsTo(() => FederationPlayerMatchStats)
  matchStats: FederationPlayerMatchStats;
}
