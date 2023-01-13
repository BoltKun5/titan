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
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { CardSerie } from './card-serie.model';
import { CardCountType, ICardSet, Overwrite } from 'vokit_core';
import { WithRequired } from '../../core';

export type ModelCardSet = Overwrite<
  ICardSet,
  {
    cardSerie: CardSerie;
    cards: Card[];
  }
>;

export type CreationModelAdminConfig = WithRequired<
  Partial<ICardSet>,
  'name' | 'cardCount' | 'cards' | 'releaseDate' | 'code' | 'cardSerieId'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardSet', paranoid: false, timestamps: false })
export class CardSet
  extends CustomModel<ICardSet, CreationModelAdminConfig>
  implements ModelCardSet
{
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
    type: DataType.JSON,
  })
  cardCount: CardCountType;

  @HasMany(() => Card)
  cards: Card[];

  @Column({
    type: DataType.DATEONLY,
  })
  releaseDate: Date;

  @Column({
    type: DataType.STRING,
  })
  code: string;

  @ForeignKey(() => CardSerie)
  @Column({
    type: DataType.STRING,
  })
  cardSerieId: string;
  @BelongsTo(() => CardSerie)
  cardSerie: CardSerie;
}
