import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  HasMany,
  Unique
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

  @Unique
  @Column({
    type: DataType.STRING,
  })
  name: string;


  @HasMany(() => CardSet)
  cardSets: CardSet[]
}
