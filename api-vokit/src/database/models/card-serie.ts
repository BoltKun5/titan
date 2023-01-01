import { Overwrite } from 'abyss_core';
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
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ICardSerie } from '../../../../local-core/types';
import { CustomModel } from '../custom/custom-model';
import { CardSet } from './card-set';

export type ModelCardSerie = Overwrite<
  ICardSerie,
  {
    cardSets: CardSet[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardSerie', paranoid: false, timestamps: false })
export class CardSerie extends CustomModel<ModelCardSerie> implements ModelCardSerie {
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

  @Column({
    type: DataType.STRING,
  })
  code: string;

  @HasMany(() => CardSet)
  cardSets: CardSet[];
}
