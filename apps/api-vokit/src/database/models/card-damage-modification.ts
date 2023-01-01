import { Card } from './card';
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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { CardDamageModificationType, CardTypeEnum } from '../../../../local-core/enums';
import { Overwrite } from 'abyss_core';
import { ICardDamageModification } from '../../../../local-core';

export type ModelCardDamageModification = Overwrite<
  ICardDamageModification,
  {
    cardEntity: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardDamageModification', paranoid: false, timestamps: false })
export class CardDamageModification
  extends CustomModel<ModelCardDamageModification>
  implements ModelCardDamageModification
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardEntityId: string;

  @BelongsTo(() => Card)
  cardEntity: Card;

  @Column({
    type: DataType.INTEGER,
  })
  modificationType: CardDamageModificationType;

  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  value: string;
}
