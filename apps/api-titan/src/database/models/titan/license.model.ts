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
import { ILicense, LicenseStatus } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { ClubMember } from './club-member.model';

export type CreationModelLicense = WithRequired<
  Partial<ILicense>,
  'clubMemberId' | 'licenseNumber' | 'startDate' | 'expirationDate'
>;

@Table({ tableName: 'titan_license', paranoid: false, timestamps: true })
export class License extends CustomModel<ILicense, CreationModelLicense> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => ClubMember)
  @Column({ type: DataType.UUID })
  clubMemberId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  licenseNumber: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  type: string | null;

  @AllowNull(false)
  @Default(LicenseStatus.VALID)
  @Column({ type: DataType.ENUM(...Object.values(LicenseStatus)) })
  status: LicenseStatus;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  startDate: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  expirationDate: string;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
