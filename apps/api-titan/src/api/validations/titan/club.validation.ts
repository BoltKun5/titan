import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateClubBody,
  IUpdateClubBody,
  ICreateSeasonBody,
  IUpdateSeasonBody,
  ICreateVenueBody,
  IUpdateVenueBody,
  SportType,
} from 'titan_core';

export default class ClubValidation {
  static createClubBody(data: ICreateClubBody): ICreateClubBody {
    const schema = Joi.object<ICreateClubBody>({
      name: Joi.string().min(1).max(100).required(),
      sport: Joi.string()
        .valid(...Object.values(SportType))
        .required(),
      logo: Joi.string().allow(null).optional(),
      colors: Joi.array().items(Joi.string()).optional(),
      address: Joi.string().allow('').optional(),
      phone: Joi.string().allow('').optional(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow('')
        .optional(),
      website: Joi.string().allow('').optional(),
      federationId: Joi.string().allow('').optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateClubBody(data: IUpdateClubBody): IUpdateClubBody {
    const schema = Joi.object<IUpdateClubBody>({
      name: Joi.string().min(1).max(100).optional(),
      logo: Joi.string().allow(null).optional(),
      colors: Joi.array().items(Joi.string()).optional(),
      address: Joi.string().allow('').optional(),
      phone: Joi.string().allow('').optional(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow('')
        .optional(),
      website: Joi.string().allow('').optional(),
      federationId: Joi.string().allow('').optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static createSeasonBody(data: ICreateSeasonBody): ICreateSeasonBody {
    const schema = Joi.object<ICreateSeasonBody>({
      label: Joi.string().min(1).max(50).required(),
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required(),
      isCurrent: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateSeasonBody(data: IUpdateSeasonBody): IUpdateSeasonBody {
    const schema = Joi.object<IUpdateSeasonBody>({
      label: Joi.string().min(1).max(50).optional(),
      startDate: Joi.string().isoDate().optional(),
      endDate: Joi.string().isoDate().optional(),
      isCurrent: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static createVenueBody(data: ICreateVenueBody): ICreateVenueBody {
    const schema = Joi.object<ICreateVenueBody>({
      name: Joi.string().min(1).max(100).required(),
      address: Joi.string().allow('').optional(),
      capacity: Joi.number().integer().min(0).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateVenueBody(data: IUpdateVenueBody): IUpdateVenueBody {
    const schema = Joi.object<IUpdateVenueBody>({
      name: Joi.string().min(1).max(100).optional(),
      address: Joi.string().allow('').optional(),
      capacity: Joi.number().integer().min(0).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
