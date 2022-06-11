/* eslint-disable @typescript-eslint/indent */
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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import AbyssCore from 'abyss_core';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { LogEndpoint } from './LogEndpoint';
import { CryptionType, ICryption, Algorithm } from 'abyss_crypt_core';

export type ModelCryption = AbyssCore.BaseEntity<
  AbyssCore.Overwrite<
    ICryption,
    {
      logEndpoint: LogEndpoint;
    }
  >
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cryptions', paranoid: false, timestamps: true })
export class Cryption extends CustomModel implements ModelCryption {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  type: CryptionType;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  algorithm: Algorithm;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  byteSize: number;

  @Default(() => new Date())
  @Column({
    type: DataType.DATE,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
  })
  endDate: Date;

  @Column({
    type: DataType.INTEGER,
  })
  durationMs: number;

  @ForeignKey(() => LogEndpoint)
  @Column({
    type: DataType.STRING,
  })
  logEndpointId: string;

  @BelongsTo(() => LogEndpoint)
  logEndpoint: LogEndpoint;
}
