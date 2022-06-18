import { CardTypeEnum } from './../../type/enums/card-type.enum';
import { CardEntity } from './CardEntity';
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardType', paranoid: false, timestamps: false })
export class CardType extends CustomModel {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;


  @ForeignKey(() => CardEntity)
  @Column({
    type: DataType.STRING,
  })
  cardEntityId: string;

  @BelongsTo(() => CardEntity)
  cardEntity: CardEntity


  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;

}
