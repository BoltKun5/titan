import {
  DefaultScope,
  Scopes,
  Table,
  IsUUID,
  PrimaryKey,
  Default,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import {
  Overwrite,
  ICard,
  CardRarityEnum,
  CardCategoryEnum,
  CardEvolutionStageEnum,
  CardTrainerTypeEnum,
  CardEnergyTypeEnum,
} from 'vokit_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { CardAdditionalPrinting } from './card-additional-printing.model';
import { CardSet } from './card-set.model';
import { CardType } from './card-type.model';
import { UserCardPossession } from './user-card-possession.model';
import { v4 as uuidv4 } from 'uuid';

export type ModelCard = Overwrite<
  ICard,
  {
    cardSet: CardSet;
    types: CardType[];
    userCardPossessions: UserCardPossession[];
    cardAdditionalPrinting: CardAdditionalPrinting[];
  }
>;

export type CreationModelCard = WithRequired<
  Partial<ICard>,
  | 'name'
  | 'rarity'
  | 'category'
  | 'setId'
  | 'hp'
  | 'evolveFrom'
  | 'stage'
  | 'types'
  | 'trainerType'
  | 'canBeReverse'
  | 'isHolo'
  | 'localId'
  | 'energyType'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({ stats: {} }))
@Table({ tableName: 'card', paranoid: false, timestamps: false })
export class Card extends CustomModel<ICard, CreationModelCard> implements ModelCard {
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
    type: DataType.INTEGER,
  })
  rarity: CardRarityEnum;

  @Column({
    type: DataType.INTEGER,
  })
  category: CardCategoryEnum;

  @ForeignKey(() => CardSet)
  @Column({
    type: DataType.STRING,
  })
  setId: string;
  @BelongsTo(() => CardSet)
  cardSet: CardSet;

  @Column({
    type: DataType.INTEGER,
  })
  hp: number;

  @Column({
    type: DataType.STRING,
  })
  evolveFrom: string;

  @Column({
    type: DataType.INTEGER,
  })
  stage: CardEvolutionStageEnum;

  @HasMany(() => CardType)
  types: CardType[];

  @Column({
    type: DataType.INTEGER,
  })
  trainerType: CardTrainerTypeEnum;

  @Column({
    type: DataType.BOOLEAN,
  })
  canBeReverse: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  isHolo: boolean;

  @Column({
    type: DataType.STRING,
  })
  localId: string;

  @Column({
    type: DataType.INTEGER,
  })
  energyType: CardEnergyTypeEnum;

  @HasMany(() => UserCardPossession)
  userCardPossessions: UserCardPossession[];

  @HasMany(() => CardAdditionalPrinting)
  cardAdditionalPrinting: CardAdditionalPrinting[];
}
