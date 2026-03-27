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
import { IClubMember, ClubMemberRole, ClubMemberStatus } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { User } from '../user.model';
import { Season } from './season.model';
import { License } from './license.model';
import { MedicalCertificate } from './medical-certificate.model';

export type CreationModelClubMember = WithRequired<
  Partial<IClubMember>,
  'clubId' | 'userId' | 'seasonId' | 'role'
>;

@Table({ tableName: 'titan_club_member', paranoid: false, timestamps: true })
export class ClubMember extends CustomModel<
  IClubMember,
  CreationModelClubMember
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
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Default(ClubMemberRole.PLAYER)
  @Column({ type: DataType.ENUM(...Object.values(ClubMemberRole)) })
  role: ClubMemberRole;

  @AllowNull(false)
  @Default(ClubMemberStatus.ACTIVE)
  @Column({ type: DataType.ENUM(...Object.values(ClubMemberStatus)) })
  status: ClubMemberStatus;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  emergencyContact: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  emergencyPhone: string | null;

  @AllowNull(false)
  @Default(() => new Date())
  @Column({ type: DataType.DATE })
  joinedAt: string;

  @BelongsTo(() => Club)
  club: Club;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Season)
  season: Season;

  @HasMany(() => License)
  licenses: License[];

  @HasMany(() => MedicalCertificate)
  medicalCertificates: MedicalCertificate[];
}
