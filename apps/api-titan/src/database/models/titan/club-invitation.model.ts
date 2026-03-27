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
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { User } from '../user.model';

export interface IClubInvitation {
  id: string;
  clubId: string;
  code: string;
  role: string;
  expiresAt: Date;
  createdBy: string;
  usedBy: string | null;
  usedAt: Date | null;
  createdAt?: string;
  updatedAt?: string;
}

type CreationModelClubInvitation = Partial<IClubInvitation> &
  Pick<IClubInvitation, 'clubId' | 'code' | 'role' | 'expiresAt' | 'createdBy'>;

@Table({
 
 
 ,

  tableName: 'titan_club_invitation',
  paranoid: false,
  timestamps: true,
})
export class ClubInvitation extends CustomModel<
  IClubInvitation,
  CreationModelClubInvitation
> {
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
  @Unique
  @Column({ type: DataType.STRING })
  code: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  role: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  expiresAt: Date;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  createdBy: string;

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  usedBy: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  usedAt: Date | null;

  @BelongsTo(() => Club)
  club: Club;
}
