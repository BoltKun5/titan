import { CardAbility } from './CardAbility';
import { CardDexId } from './CardDexId';
import { CardEnergyTypeEnum } from '../../type/enums/card-energy-type.enum';
import { CardTrainerTypeEnum } from '../../type/enums/card-trainer-type.enum';
import { CardEvolutionStageEnum } from '../../type/enums/card-evolution-stage.enum';
import { CardCategoryEnum } from '../../type/enums/card-category.enum';
import { CardRarityEnum } from '../../type/enums/card-rarity.enum';
import { CardDamageModification } from './CardDamageModification';
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
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { CardSet } from './CardSet';
import { CardType } from './CardType';
import { CardAttribute } from './CardAttribute';
import { HeldItemType } from '../../type/types';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'Card', paranoid: false, timestamps: false })
export class Card extends CustomModel {
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
  cardSet: CardSet


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
  types: CardType[]


  @HasMany(() => CardAttack)
  attacks: CardAttack[];


  @HasMany(() => CardAbility)
  abilities: CardAbility[];


  @Column({
    type: DataType.STRING(1047),
  })
  effect: string;


  @HasMany(() => CardDamageModification)
  damageModifications: CardDamageModification[]

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

}
