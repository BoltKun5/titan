import {
  CardRarityEnum,
  CardRarityEnumFrench,
  CardCategoryEnum,
  CardEvolutionStageEnum,
  CardTrainerTypeEnum,
  CardEnergyTypeEnum,
} from '../../../enums';
import { ICardAdditionalPrinting } from './card-additional-printing.model';
import { ICardSet } from './card-set.model';
import { ICardType } from './card-type.model';
import { IUserCardPossession } from './user-card-possession.model';

export type ICard = {
  id: string;
  name: string;
  rarity: CardRarityEnum | CardRarityEnumFrench;
  category: CardCategoryEnum;
  setId: string;
  cardSet: ICardSet;
  hp: number;
  evolveFrom: string;
  stage: CardEvolutionStageEnum;
  types: ICardType[];
  trainerType: CardTrainerTypeEnum;
  canBeReverse: boolean;
  isHolo: boolean;
  localId: string;
  energyType: CardEnergyTypeEnum;
  userCardPossessions: IUserCardPossession[];
  cardAdditionalPrinting: ICardAdditionalPrinting[];
};
