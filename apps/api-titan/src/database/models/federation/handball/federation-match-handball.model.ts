import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationMatchHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationMatch } from '../federation-match.model';

export type CreationModelFederationMatchHandball = WithRequired<
  Partial<IFederationMatchHandball>,
  'matchId' | 'matchDurationMinutes'
>;

@Table({ tableName: 'federation_match_handball', paranoid: false, timestamps: true })
export class FederationMatchHandball extends CustomModel<IFederationMatchHandball, CreationModelFederationMatchHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationMatch)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  matchId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfAway: number | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  hasExtraTime: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreExtraHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreExtraAway: number | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  hasShootout: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreShootoutHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreShootoutAway: number | null;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  matchDurationMinutes: number;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;
}
