import { CardAttackCost } from './CardAttackCost';
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
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardAttack', paranoid: false, timestamps: false })
export class CardAttack extends CustomModel {
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

  
  @HasMany(() => CardAttackCost)
  cost: CardAttackCost[];


  @Column({
    type: DataType.STRING,
  })
  name: string;


  @Column({
    type: DataType.STRING,
  })
  effect: string;
}
