import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  IRecordPlayerMatchStatsBody,
  IUpdatePlayerMatchStatsBody,
} from 'titan_core';

export default class StatsValidation {
  static recordMatchStatsBody(
    data: IRecordPlayerMatchStatsBody,
  ): IRecordPlayerMatchStatsBody {
    const schema = Joi.object<IRecordPlayerMatchStatsBody>({
      playerId: Joi.string().uuid().required(),
      matchId: Joi.string().uuid().required(),
      isStarter: Joi.boolean().optional(),
      minutesPlayed: Joi.number().integer().min(0).allow(null).optional(),
      goals: Joi.number().integer().min(0).optional(),
      goalDetails: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      assists: Joi.number().integer().min(0).optional(),
      saves: Joi.number().integer().min(0).optional(),
      saveDetails: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      sanctions: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      shotsAttempted: Joi.number().integer().min(0).allow(null).optional(),
      penaltiesAttempted: Joi.number().integer().min(0).allow(null).optional(),
      penaltiesScored: Joi.number().integer().min(0).allow(null).optional(),
      rating: Joi.number().min(0).max(10).allow(null).optional(),
      customStats: Joi.object().allow(null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateMatchStatsBody(
    data: IUpdatePlayerMatchStatsBody,
  ): IUpdatePlayerMatchStatsBody {
    const schema = Joi.object<IUpdatePlayerMatchStatsBody>({
      isStarter: Joi.boolean().optional(),
      minutesPlayed: Joi.number().integer().min(0).allow(null).optional(),
      goals: Joi.number().integer().min(0).optional(),
      goalDetails: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      assists: Joi.number().integer().min(0).optional(),
      saves: Joi.number().integer().min(0).optional(),
      saveDetails: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      sanctions: Joi.object()
        .pattern(Joi.string(), Joi.number().integer().min(0))
        .allow(null)
        .optional(),
      shotsAttempted: Joi.number().integer().min(0).allow(null).optional(),
      penaltiesAttempted: Joi.number().integer().min(0).allow(null).optional(),
      penaltiesScored: Joi.number().integer().min(0).allow(null).optional(),
      rating: Joi.number().min(0).max(10).allow(null).optional(),
      customStats: Joi.object().allow(null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
