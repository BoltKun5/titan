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
import { CustomModel } from '../custom/custom-model.model';
import { CardSet } from './card-set.model';
import { WithRequired } from '../../core';
import { ICardSerie, Overwrite } from 'vokit_core';

export type ModelCardSerie = Overwrite<
  ICardSerie,
  {
    cardSets: CardSet[];
  }
>;

export type CreationModelCardSerie = WithRequired<Partial<ICardSerie>, 'name' | 'code'>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardSerie', paranoid: false, timestamps: false })
export class CardSerie
  extends CustomModel<ICardSerie, CreationModelCardSerie>
  implements ModelCardSerie
{
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
