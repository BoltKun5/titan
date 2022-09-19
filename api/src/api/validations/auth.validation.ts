import { ISigninAuthBody, ISignupAuthBody } from './../../../../local-core';
import { HttpResponseError } from '../../modules/HttpResponseError';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: ISigninAuthBody): ISigninAuthBody {
    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string(),
      password: Joi.string(),
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignInValidationError();

    return { ...result.value };
  }

  static signupBody(data: ISignupAuthBody): ISignupAuthBody {
    const querySchema = Joi.object<ISignupAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
      shownName: Joi.string().min(3).max(20).required(),
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignUpValidationError();

    return { ...result.value };
  }
}
