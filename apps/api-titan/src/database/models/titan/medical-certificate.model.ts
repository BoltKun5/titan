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
import { IMedicalCertificate } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { ClubMember } from './club-member.model';

export type CreationModelMedicalCertificate = WithRequired<
  Partial<IMedicalCertificate>,
  'clubMemberId' | 'issueDate' | 'expirationDate'
>;

@Table({
 
 
 ,

  tableName: 'titan_medical_certificate',
  paranoid: false,
  timestamps: true,
})
export class MedicalCertificate extends CustomModel<
  IMedicalCertificate,
  CreationModelMedicalCertificate
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => ClubMember)
  @Column({ type: DataType.UUID })
  clubMemberId: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  fileUrl: string | null;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isValid: boolean;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  issueDate: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  expirationDate: string;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
