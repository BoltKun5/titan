import { IGetPreSignedQuery, IUpdatePasswordBody } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class PreSignedValidation {
  static getQuery(data: IGetPreSignedQuery): IGetPreSignedQuery {
    const querySchema = Joi.object<IGetPreSignedQuery>({
      token: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }

  static updatePasswordBody(data: IUpdatePasswordBody): IUpdatePasswordBody {
    const querySchema = Joi.object<IUpdatePasswordBody>({
      token: Joi.string(),
      password: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }
}
