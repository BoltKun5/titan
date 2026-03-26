import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateTeamBody,
  IUpdateTeamBody,
  IAddTeamPlayerBody,
  GenderSection,
} from 'titan_core';

export default class TeamValidation {
  static createTeamBody(data: ICreateTeamBody): ICreateTeamBody {
    const schema = Joi.object<ICreateTeamBody>({
      seasonId: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(100).required(),
      category: Joi.string().allow('').optional(),
      division: Joi.string().allow('').optional(),
      pool: Joi.string().allow('').optional(),
      genderSection: Joi.string()
        
        
        .valid(...Object.values(GenderSection))
        .required(),
      federationTeamId: Joi.string().allow('').optional(),
      coachId: Joi.string().uuid().allow(null).optional(),
      assistantCoachId: Joi.string().uuid().allow(null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateTeamBody(data: IUpdateTeamBody): IUpdateTeamBody {
    const schema = Joi.object<IUpdateTeamBody>({
      name: Joi.string().min(1).max(100).optional(),
      category: Joi.string().allow('').optional(),
      division: Joi.string().allo
        w('').optional(),
        
      pool: Joi.string().allow('').optional(),
      genderSection: Joi.string()
        .valid(...Object.values(GenderSection))
        .optional(),
      federationTeamId: Joi.string().allow('').optional(),
      coachId: Joi.string().uuid().allow(null).optional(),
      assistantCoachId: Joi.string().uuid().allow(null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static addPlayerBody(data: IAddTeamPlayerBody): IAddTeamPlayerBody {
    const schema = Joi.object<IAddTeamPlayerBody>({
      clubMemberId: Joi.string().uuid().required(),
      position: Joi.string().allow('').optional(),
      jerseyNumber: Joi.number().integer().min(0).optional(),
      isCaptain: Joi.boolean().optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
