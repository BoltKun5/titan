import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFeePlan } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { Season } from './season.model';

export type CreationModelFeePlan = WithRequired<
  Partial<IFeePlan>,
  'clubId' | 'seasonId' | 'category' | 'amount'
>;

@Table({ tableName: 'titan_fee_plan', paranoid: false, timestamps: true })
export class FeePlan extends CustomModel<IFeePlan, CreationModelFeePlan> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Club)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  category: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @AllowNull(false)
  @Default(1)
  @Column({ type: DataType.INTEGER })
  installments: number;

  @BelongsTo(() => Club)
  club: Club;

  @BelongsTo(() => Season)
  season: Season;
}
