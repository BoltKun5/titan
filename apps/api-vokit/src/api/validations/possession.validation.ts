import {
  CardPossessionDeletionTypeEnum,
  CardPossessionLanguageEnum,
  CardPossessionConditionEnum,
  CardPossessionGradeCompanyEnum,
  ICreateMultiplePossessionBody,
  ICreatePossessionBody,
  IDeletePossessionBody,
  ISetQuantityBody,
  ISimpleDeletePossessionBody,
  IUpdatePossessionBody,
} from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class PossessionValidation {
  static update(data: IUpdatePossessionBody): IUpdatePossessionBody {
    const querySchema = Joi.object<IUpdatePossessionBody>({
      cardId: Joi.string(),
      possessions: Joi.array().items({
        boosterId: Joi.string().allow(null).required(),
        condition: Joi.string()
          .allow(null)
          .valid(...Object.values(CardPossessionConditionEnum))
          .required(),
        deletionType: Joi.string()
          .allow(null)
          .valid(...Object.values(CardPossessionDeletionTypeEnum))
          .required(),
        grade: Joi.string()
          .allow(null)
          .valid(...Object.values(CardPossessionGradeCompanyEnum))
          .required(),
        language: Joi.string()
          .allow(null)
          .valid(...Object.values(CardPossessionLanguageEnum))
          .required(),
        note: Joi.string().allow(null).required(),
        printingId: Joi.string().allow(null).required(),
        id: Joi.string().required(),
      }),
      createdTags: Joi.array()
        .items({
          cardPossessionId: Joi.string().required(),
          tagId: Joi.string().required(),
        })
        .optional(),
      deletedTags: Joi.array()
        .items({
          cardPossessionId: Joi.string().required(),
          tagId: Joi.string().required(),
        })
        .optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static create(data: ICreatePossessionBody): ICreatePossessionBody {
    const querySchema = Joi.object<ICreatePossessionBody>({
      cardId: Joi.string(),
      cardPrintingId: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static simpleDelete(data: ISimpleDeletePossessionBody): ISimpleDeletePossessionBody {
    const querySchema = Joi.object<ISimpleDeletePossessionBody>({
      cardId: Joi.string(),
      cardPrintingId: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static forceDelete(data: IDeletePossessionBody): IDeletePossessionBody {
    const querySchema = Joi.object<IDeletePossessionBody>({
      possessionId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static multipleCreate(data: ICreateMultiplePossessionBody): ICreateMultiplePossessionBody {
    const querySchema = Joi.object<ICreateMultiplePossessionBody>({
      cards: Joi.array().items({
        cardId: Joi.string(),
        printingId: Joi.string().allow(null),
      }),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static setQuantity(data: ISetQuantityBody): ISetQuantityBody {
    const querySchema = Joi.object<ISetQuantityBody>({
      cardId: Joi.string(),
      cardPrintingId: Joi.string().allow(null),
      quantity: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
