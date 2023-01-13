import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { AdminConfigTypeEnum, IAdminConfig, Overwrite } from 'vokit_core';
import { WithRequired } from '../../core';

export type ModelAdminConfig = Overwrite<
  IAdminConfig,
  {
    //
  }
>;

export type CreationModelAdminConfig = WithRequired<
  Partial<IAdminConfig>,
  'type' | 'label' | 'name' | 'value'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'adminConfig', paranoid: false, timestamps: false })
export class AdminConfig
  extends CustomModel<IAdminConfig, CreationModelAdminConfig>
  implements ModelAdminConfig
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  label: string | null;

  @Column({
    type: DataType.INTEGER,
  })
  type: AdminConfigTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  value: string;
}
