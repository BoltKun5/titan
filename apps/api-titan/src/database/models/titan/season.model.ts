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
import { ISeason } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';

export type CreationModelSeason = WithRequired<
  Partial<ISeason>,
  'clubId' | 'label' | 'startDate' | 'endDate'
>;

@Table({ tableName: 'titan_season', paranoid: false, timestamps: true })
export class Season extends CustomModel<ISeason, CreationModelSeason> {
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
  @Column({ type: DataType.STRING })
  label: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  startDate: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  endDate: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCurrent: boolean;

  @BelongsTo(() => Club)
  club: Club;
}
