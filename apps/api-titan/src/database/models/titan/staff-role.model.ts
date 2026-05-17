import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IStaffRole } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';
import { FederationSeason } from '../federation/federation-season.model';

export type CreationModelStaffRole = WithRequired<
  Partial<IStaffRole>,
  'clubAccountId' | 'userId' | 'role'
>;

@Table({ tableName: 'titan_staff_role', paranoid: false, timestamps: true })
export class StaffRole extends CustomModel<IStaffRole, CreationModelStaffRole> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false) @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  role: string;

  @AllowNull(true) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string | null;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
