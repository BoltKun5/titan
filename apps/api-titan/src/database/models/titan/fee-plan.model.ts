import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFeePlan } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { FederationSeason } from '../federation/federation-season.model';

export type CreationModelFeePlan = WithRequired<
  Partial<IFeePlan>,
  'clubAccountId' | 'seasonId' | 'category' | 'amount'
>;

@Table({ tableName: 'titan_fee_plan', paranoid: false, timestamps: true })
export class FeePlan extends CustomModel<IFeePlan, CreationModelFeePlan> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  category: string;

  @AllowNull(false) @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @AllowNull(false) @Default(1) @Column({ type: DataType.INTEGER })
  installments: number;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
