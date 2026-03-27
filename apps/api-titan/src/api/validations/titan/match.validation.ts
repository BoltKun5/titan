import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateMatchBody,
  IUpdateMatchBody,
  ISetMatchLineupBody,
  IAddMatchEventBody,
  MatchLocation,
  MatchStatus,
  MatchEventType,
} from 'titan_core';

export default class MatchValidation {
  static createMatchBody(data: ICreateMatchBody): ICreateMatchBody {
    const schema = Joi.object<ICreateMatchBody>({
      teamId: Joi.string().uuid().required(),
      seasonId: Joi.string().uuid().required(),
      venueId: Joi.string().uuid().allow(null).optional(),
      opponent: Joi.string().min(1).max(100).required(),
      date: Joi.string().isoDate().required(),
      location: Joi.string()
        .valid(...Object.values(MatchLocation))
        .required(),
      isFriendly: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateMatchBody(data: IUpdateMatchBody): IUpdateMatchBody {
    const schema = Joi.object<IUpdateMatchBody>({
      venueId: Joi.string().uuid().allow(null).optional(),
      opponent: Joi.string().min(1).max(100).optional(),
      date: Joi.string().isoDate().optional(),
      status: Joi.string()
        .valid(...Object.values(MatchStatus))
        .optional(),
      location: Joi.string()
        .valid(...Object.values(MatchLocation))
        .optional(),
      scoreHome: Joi.number().integer().min(0).allow(null).optional(),
      scoreAway: Joi.number().integer().min(0).allow(null).optional(),
      scoreHalfHome: Joi.number().integer().min(0).allow(null).optional(),
      scoreHalfAway: Joi.number().integer().min(0).allow(null).optional(),
      notes: Joi.string().allow('', null).optional(),
      isFriendly: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static setLineupBody(data: ISetMatchLineupBody): ISetMatchLineupBody {
    const schema = Joi.object<ISetMatchLineupBody>({
      lineup: Joi.array()
        .items(
          Joi.object({
            clubMemberId: Joi.string().uuid().required(),
            position: Joi.string().allow('').optional(),
            isStarter: Joi.boolean().required(),
          }),
        )
        .min(1)
        .required(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static addEventBody(data: IAddMatchEventBody): IAddMatchEventBody {
    const schema = Joi.object<IAddMatchEventBody>({
      clubMemberId: Joi.string().uuid().allow(null).optional(),
      eventType: Joi.string()
        .valid(...Object.values(MatchEventType))
        .required(),
      subtype: Joi.string().allow('', null).optional(),
      minute: Joi.number().integer().min(0).allow(null).optional(),
      period: Joi.string().allow('', null).optional(),
      details: Joi.object().allow(null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
