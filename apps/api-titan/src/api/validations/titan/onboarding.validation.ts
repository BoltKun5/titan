import Joi from 'joi';
import { FederationCode } from 'titan_core';
import { HttpResponseError } from '../../../modules/http-response-error';

export default class OnboardingValidation {
  static searchQuery(query: any): { q: string; federation?: FederationCode } {
    const schema = Joi.object({
      q: Joi.string().trim().min(2).required(),
      federation: Joi.string()
        .valid(...Object.values(FederationCode))
        .optional(),
    });
    const { value, error } = schema.validate(query);
    if (error) throw HttpResponseError.createWrongValuesError();
    return value as { q: string; federation?: FederationCode };
  }

  static claimBody(body: any): {
    federationClubId: string;
    displayName?: string;
    subscriptionPlan?: 'free' | 'pro' | 'enterprise';
  } {
    const schema = Joi.object({
      federationClubId: Joi.string().uuid().required(),
      displayName: Joi.string().trim().max(255).optional(),
      subscriptionPlan: Joi.string().valid('free', 'pro', 'enterprise').optional(),
    });
    const { value, error } = schema.validate(body);
    if (error) throw HttpResponseError.createWrongValuesError();
    return value;
  }
}
