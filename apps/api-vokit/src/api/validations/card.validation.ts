import { IUpsertCardBody } from './../../../../../packages/core/src/types/interface/api/requests/card.request';
import { CardRarityEnum } from './../../../../../packages/core/src/enums/card-rarity.enum';
import { ICardQuery, CardTypeEnum } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class CardValidation {
  static cardQuery(data: ICardQuery): ICardQuery {
    const querySchema = Joi.object<ICardQuery>({
      order: Joi.string().valid('default', 'name', 'type').optional(),
      namefilter: Joi.string().optional(),
      rarity: Joi.array()
        .items(Joi.number().valid(...Object.values(CardRarityEnum)))
        .optional(),
      page: Joi.number().optional(),
      stats: Joi.boolean().optional(),
      possession: Joi.string()
        .valid('partial_owned', 'partial_unowned', 'fully_owned', 'unowned', 'multiple_owned')
        .optional(),
      setFilter: Joi.array().items(Joi.string()).optional(),
      userId: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static cardBody(data: IUpsertCardBody): IUpsertCardBody {
    const querySchema = Joi.object<IUpsertCardBody>({
      id: Joi.string(),
      canBeReverse: Joi.boolean(),
      cardAdditionalPrinting: Joi.array().items(
        Joi.object({
          id: Joi.string().optional(),
          type: Joi.number(),
          name: Joi.string(),
          creator: Joi.number(),
        }),
      ),
      localId: Joi.string(),
      name: Joi.string(),
      rarity: Joi.number(),
      setId: Joi.string(),
      types: Joi.array().items(Joi.number().valid(...Object.values(CardTypeEnum))),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
