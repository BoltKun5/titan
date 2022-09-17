import { CardCountType } from '@local-core';
import { Card } from './Card';
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
  BelongsTo,
  ForeignKey,
  HasMany
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { CardSerie } from './CardSerie';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardSet', paranoid: false, timestamps: false })
export class CardSet extends CustomModel {
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


  @Column({
    type: DataType.STRING,
  })
  tcgOnline: string;


  @Column({
    type: DataType.BOOLEAN,
  })
  isPlayableInStandard: boolean;


  @Column({
    type: DataType.BOOLEAN,
  })
  isPlayableInExpanded: boolean;

  @HasMany(() => Card)
  cards: Card[]


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
  cardSerie: CardSerie

}
