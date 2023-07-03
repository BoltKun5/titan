import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IPreSignedUrl, Overwrite, PreSignedTypeEnum } from 'vokit_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';

export type ModelPreSignedUrl = Overwrite<
  IPreSignedUrl,
  {
    //
  }
>;

export type CreationModelPreSignedUrl = WithRequired<Partial<IPreSignedUrl>, 'type' | 'token'>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'preSignedUrl', paranoid: false, timestamps: true })
export class PreSignedUrl
  extends CustomModel<IPreSignedUrl, CreationModelPreSignedUrl>
  implements ModelPreSignedUrl
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  type: PreSignedTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  token: string;
}
