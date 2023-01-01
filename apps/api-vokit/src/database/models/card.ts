import { CardAdditionalPrinting } from './card-additional-printing';
import { CardDexId } from './card-dex-id';
import { CardDamageModification } from './card-damage-modification';
import { CardAttack } from './card-attack';
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
import { CardSet } from './card-set';
import { CardType } from './card-type';
import { CardAttribute } from './card-attribute';
import { UserCardPossession } from './user-card-possession';
import { Overwrite } from 'abyss_core';
import {
  CardCategoryEnum,
  CardEnergyTypeEnum,
  CardEvolutionStageEnum,
  CardRarityEnum,
  CardTrainerTypeEnum,
  HeldItemType,
  ICard,
} from '../../../../local-core';
import { CardAbility } from './card-ability';
import { CustomModel } from '../custom/custom-model.model';

export type ModelCard = Overwrite<
  ICard,
  {
    cardSet: CardSet;
    types: CardType[];
    attacks: CardAttack[];
    abilities: CardAbility[];
    damageModifications: CardDamageModification[];
    attributes: CardAttribute[];
    dexIds: CardDexId[];
    userCardPossessions: UserCardPossession[];
    cardAdditionalPrinting: CardAdditionalPrinting[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({ stats: {} }))
@Table({ tableName: 'card', paranoid: false, timestamps: false })
export class Card extends CustomModel<ModelCard> implements ModelCard {
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

  @HasMany(() => CardAttack)
  attacks: CardAttack[];

  @HasMany(() => CardAbility)
  abilities: CardAbility[];

  @Column({
    type: DataType.STRING(1047),
  })
  effect: string;

  @HasMany(() => CardDamageModification)
  damageModifications: CardDamageModification[];

  @Column({
    type: DataType.INTEGER,
  })
  retreat: number;

  @Column({
    type: DataType.STRING,
  })
  regulationMark: string;

  @Column({
    type: DataType.INTEGER,
  })
  trainerType: CardTrainerTypeEnum;

  @Column({
    type: DataType.BOOLEAN,
  })
  canBeNormal: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  canBeReverse: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  isHolo: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  isFirstEdition: boolean;

  @HasMany(() => CardAttribute)
  attributes: CardAttribute[];

  @Column({
    type: DataType.STRING,
  })
  localId: string;

  @Column({
    type: DataType.STRING,
  })
  globalId: string;

  @HasMany(() => CardDexId)
  dexIds: CardDexId[];

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  level: string;

  @Column({
    type: DataType.JSON,
  })
  item: HeldItemType;

  @Column({
    type: DataType.INTEGER,
  })
  energyType: CardEnergyTypeEnum;

  @HasMany(() => UserCardPossession)
  userCardPossessions: UserCardPossession[];

  @HasMany(() => CardAdditionalPrinting)
  cardAdditionalPrinting: CardAdditionalPrinting[];
}
