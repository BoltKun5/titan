import { CardDamageModificationType } from './../../enums/card-damage-modification-type.enum';
import { ICard } from './card.dto';
import { CardTypeEnum } from '../../enums/card-type.enum';

export type ICardDamageModification = {
  id: string,
  cardEntityId: string,
  cardEntity: ICard,
  modificationType: CardDamageModificationType,
  type: CardTypeEnum,
  value: string
}