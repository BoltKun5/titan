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
import { ITrainingAttendance } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Training } from './training.model';
import { ClubMember } from './club-member.model';

export type CreationModelTrainingAttendance = WithRequired<
  Partial<ITrainingAttendance>,
  'trainingId' | 'clubMemberId'
>;

@Table({
 
 
 
 ,

  tableName: 'titan_training_attendance',
  paranoid: false,
  timestamps: true,
  updatedAt: false,
})
export class TrainingAttendance extends CustomModel<
  ITrainingAttendance,
  CreationModelTrainingAttendance
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Training)
  @Column({ type: DataType.UUID })
  trainingId: string;

  @AllowNull(false)
  @ForeignKey(() => ClubMember)
  @Column({ type: DataType.UUID })
  clubMemberId: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isPresent: boolean;

  @BelongsTo(() => Training)
  training: Training;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
