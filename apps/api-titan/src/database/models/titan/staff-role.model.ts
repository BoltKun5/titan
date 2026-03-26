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
import { IStaffRole } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { User } from '../user.model';
import { Season } from './season.model';

export type CreationModelStaffRole = WithRequired<
  Partial<IStaffRole>,
  'clubId' | 'userId' | 'role'
>;

@Table({ tableName: 'titan_staff_role', paranoid: false, timestamps: true })
export class StaffRole extends CustomModel<IStaffRole, CreationModelStaffRole> {
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
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  role: string;

  @AllowNull(true)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string | null;

  @BelongsTo(() => Club)
  club: Club;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Season)
  season: Season;
}
