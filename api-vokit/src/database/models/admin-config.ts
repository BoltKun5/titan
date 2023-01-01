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
import { Overwrite } from 'abyss_core';
import { AdminConfigTypeEnum, IAdminConfig } from '../../../../local-core';
import { CustomModel } from '../custom/custom-model';

export type ModelAdminConfig = Overwrite<
  IAdminConfig,
  {
    //
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'adminConfig', paranoid: false, timestamps: false })
export class AdminConfig extends CustomModel<ModelAdminConfig> implements ModelAdminConfig {
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
