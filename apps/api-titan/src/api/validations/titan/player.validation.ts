import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreatePlayerBody,
  IUpdatePlayerBody,
  ILinkPlayerUserBody,
} from 'titan_core';

export default class PlayerValidation {
  static createPlayerBody(data: ICreatePlayerBody): ICreatePlayerBody {
    const schema = Joi.object<ICreatePlayerBody>({
      firstName: Joi.string().min(1).max(100).required(),
      lastName: Joi.string().min(1).max(100).required(),
      photo: Joi.string().allow(null).optional(),
      birthDate: Joi.string().isoDate().allow(null).optional(),
      nationality: Joi.string().max(100).allow(null).optional(),
      licenseNumber: Joi.string().max(100).allow(null).optional(),
      federationPlayerId: Joi.string().max(100).allow(null).optional(),
      position: Joi.string().max(50).allow(null).optional(),
      jerseyNumber: Joi.number()
        .integer()
        .min(0)
        .max(999)
        .allow(null)
        .optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updatePlayerBody(data: IUpdatePlayerBody): IUpdatePlayerBody {
    const schema = Joi.object<IUpdatePlayerBody>({
      firstName: Joi.string().min(1).max(100).optional(),
      lastName: Joi.string().min(1).max(100).optional(),
      photo: Joi.string().allow(null).optional(),
      birthDate: Joi.string().isoDate().allow(null).optional(),
      nationality: Joi.string().max(100).allow(null).optional(),
      licenseNumber: Joi.string().max(100).allow(null).optional(),
      federationPlayerId: Joi.string().max(100).allow(null).optional(),
      position: Joi.string().max(50).allow(null).optional(),
      jerseyNumber: Joi.number()
        .integer()
        .min(0)
        .max(999)
        .allow(null)
        .optional(),
      isActive: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static linkPlayerUserBody(data: ILinkPlayerUserBody): ILinkPlayerUserBody {
    const schema = Joi.object<ILinkPlayerUserBody>({
      userId: Joi.string().uuid().required(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
