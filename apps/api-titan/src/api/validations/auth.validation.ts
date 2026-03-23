import { ISigninAuthBody, ISignupAuthBody } from 'titan_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: ISigninAuthBody): ISigninAuthBody {
    const querySchema = Joi.object<ISigninAuthBody>({
      mail: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }

  static signupBody(data: ISignupAuthBody): ISignupAuthBody {
    const querySchema = Joi.object<ISignupAuthBody>({
      password: Joi.string().min(5),
      firstName: Joi.string().min(1).max(50),
      lastName: Joi.string().min(1).max(50),
      shownName: Joi.string().min(3).max(30),
      mail: Joi.string().email({ tlds: { allow: false } }),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignUpValidationError();

    return { ...result.value };
  }
}
