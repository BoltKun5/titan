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
import { IPayment, PaymentStatus, PaymentMethod } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { ClubMember } from './club-member.model';
import { FeePlan } from './fee-plan.model';

export type CreationModelPayment = WithRequired<
  Partial<IPayment>,
  'clubMemberId' | 'feePlanId' | 'amount'
>;

@Table({ tableName: 'titan_payment', paranoid: false, timestamps: true })
export class Payment extends CustomModel<IPayment, CreationModelPayment> {
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
  @ForeignKey(() => FeePlan)
  @Column({ type: DataType.UUID })
  feePlanId: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @AllowNull(false)
  @Default(PaymentStatus.UNPAID)
  @Column({ type: DataType.ENUM(...Object.values(PaymentStatus)) })
  status: PaymentStatus;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.ENUM(...Object.values(PaymentMethod)) })
  method: PaymentMethod | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  paidAt: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATEONLY })
  dueDate: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;

  @BelongsTo(() => FeePlan)
  feePlan: FeePlan;
}
