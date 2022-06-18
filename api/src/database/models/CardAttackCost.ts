import { CardTypeEnum } from './../../type/enums/card-type.enum';
import { CardAttack } from './CardAttack';
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
@Table({ tableName: 'CardAttackCost', paranoid: false, timestamps: false })
export class CardAttackCost extends CustomModel {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;


  @ForeignKey(() => CardAttack)
  @Column({
    type: DataType.STRING,
  })
  cardAttackId: string;

  @BelongsTo(() => CardAttack)
  cardAttack: CardAttack


  @Column({
    type: DataType.INTEGER,
  })
  cost: number;


  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;

}
