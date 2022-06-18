import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  HasMany
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { CardSet } from './CardSet';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardSerie', paranoid: false, timestamps: false })
export class CardSerie extends CustomModel {
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
  slug: string;


  @HasMany(() => CardSet)
  sets: CardSet[]
}
