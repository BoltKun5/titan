import { ISigninAuthBody, ISignupAuthBody } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: ISigninAuthBody): ISigninAuthBody {
    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string(),
      password: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignInValidationError();

    return { ...result.value };
  }

  static signupBody(data: ISignupAuthBody): ISignupAuthBody {
    const querySchema = Joi.object<ISignupAuthBody>({
      username: Joi.string().min(3).max(20),
      password: Joi.string().min(5).max(30),
      shownName: Joi.string().min(3).max(20),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignUpValidationError();

    return { ...result.value };
  }
}
