import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IBudgetEntry, BudgetEntryType, BudgetCategory } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { FederationSeason } from '../federation/federation-season.model';

export type CreationModelBudgetEntry = WithRequired<
  Partial<IBudgetEntry>,
  'clubAccountId' | 'seasonId' | 'type' | 'category' | 'label' | 'amount' | 'date'
>;

@Table({ tableName: 'titan_budget_entry', paranoid: false, timestamps: true })
export class BudgetEntry extends CustomModel<IBudgetEntry, CreationModelBudgetEntry> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(BudgetEntryType)) })
  type: BudgetEntryType;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(BudgetCategory)) })
  category: BudgetCategory;

  @AllowNull(false) @Column({ type: DataType.STRING })
  label: string;

  @AllowNull(false) @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @AllowNull(false) @Column({ type: DataType.DATEONLY })
  date: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
