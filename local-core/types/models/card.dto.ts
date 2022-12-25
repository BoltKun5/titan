import { ICardAdditionalPrinting } from './card-additional-printing.dto';
import { CardRarityEnum, CardRarityEnumFrench } from './../../enums/card-rarity.enum';
import { HeldItemType } from './../card-item.type';
import { ICardAbility } from './card-ability.dto';
import { CardEnergyTypeEnum, CardCategoryEnum, CardEvolutionStageEnum, CardTrainerTypeEnum } from '../../enums';
import { ICardAttack } from './card-attack.dto';
import { ICardAttribute } from './card-attribute.dto';
import { ICardDamageModification } from './card-damage-modification';
import { ICardDexId } from './card-dex-id.dto';
import { ICardSet } from './card-set.dto';
import { ICardType } from './card-type.dto';
import { IUserCardPossession } from './user-card-possession.dto';

export type ICard = {
  id: string,
  name: string,
  rarity: CardRarityEnum | CardRarityEnumFrench,
  category: CardCategoryEnum,
  setId: string,
  cardSet: ICardSet,
  hp: number,
  evolveFrom: string,
  stage: CardEvolutionStageEnum,
  types: ICardType[],
  attacks: ICardAttack[],
  abilities: ICardAbility[],
  effect: string,
  damageModifications: ICardDamageModification[],
  retreat: number,
  regulationMark: string,
  trainerType: CardTrainerTypeEnum
  canBeNormal: boolean,
  canBeReverse: boolean,
  isHolo: boolean,
  isFirstEdition: boolean,
  attributes: ICardAttribute[],
  localId: string,
  globalId: string,
  dexIds: ICardDexId[],
  description: string,
  level: string,
  item: HeldItemType,
  energyType: CardEnergyTypeEnum,
  userCardPossessions: IUserCardPossession[],
  cardAdditionalPrinting: ICardAdditionalPrinting[]
}