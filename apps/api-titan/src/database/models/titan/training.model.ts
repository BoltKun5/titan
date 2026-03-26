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
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITraining, TrainingRecurrence } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Team } from './team.model';
import { Venue } from './venue.model';
import { TrainingAttendance } from './training-attendance.model';

export type CreationModelTraining = WithRequired<
  Partial<ITraining>,
  'teamId' | 'date' | 'startTime' | 'endTime'
>;

@Table({ tableName: 'titan_training', paranoid: false, timestamps: true })
export class Training extends CustomModel<ITraining, CreationModelTraining> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Team)
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(true)
  @ForeignKey(() => Venue)
  @Default(null)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  date: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME })
  startTime: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME })
  endTime: string;

  @AllowNull(false)
  @Default(TrainingRecurrence.ONCE)
  @Column({ type: DataType.ENUM(...Object.values(TrainingRecurrence)) })
  recurrence: TrainingRecurrence;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCancelled: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => Team)
  team: Team;

  @BelongsTo(() => Venue)
  venue: Venue;

  @HasMany(() => TrainingAttendance)
  attendance: TrainingAttendance[];
}
