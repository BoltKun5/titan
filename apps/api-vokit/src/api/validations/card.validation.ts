import { CardRarityEnum } from './../../../../../packages/core/src/enums/card-rarity.enum';
import { ICardQuery } from 'vokit_core';
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
      possession: Joi.string().valid('owned', 'unowned').optional(),
      setFilter: Joi.array().items(Joi.string()).optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
