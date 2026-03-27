import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ISportConfig, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';

export type CreationModelSportConfig = WithRequired<
  Partial<ISportConfig>,
  'sport'
>;

@Table({ tableName: 'titan_sport_config', paranoid: false, timestamps: true })
export class SportConfig extends CustomModel<
  ISportConfig,
  CreationModelSportConfig
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false)
  @Default([])
  @Column({ type: DataType.JSON })
  positions: string[];

  @AllowNull(false)
  @Default([])
  @Column({ type: DataType.JSON })
  goalSubtypes: string[];

  @AllowNull(false)
  @Default([])
  @Column({ type: DataType.JSON })
  sanctionTypes: string[];

  @AllowNull(false)
  @Default([])
  @Column({ type: DataType.JSON })
  periods: string[];

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSON })
  rankingRules: Record<string, any> | null;
}
