import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederation, FederationCode, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';

export type CreationModelFederation = WithRequired<
  Partial<IFederation>,
  'code' | 'name' | 'sport' | 'country' | 'baseUrl'
>;

@Table({ tableName: 'federation', paranoid: false, timestamps: true })
export class Federation extends CustomModel<IFederation, CreationModelFederation> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @Column({ type: DataType.ENUM(...Object.values(FederationCode)) })
  code: FederationCode;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  country: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  baseUrl: string;
}
