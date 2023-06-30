import { IPreSignupAuthBody, ISigninAuthBody, ISignupAuthBody } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: ISigninAuthBody): ISigninAuthBody {
    const querySchema = Joi.object<ISigninAuthBody>({
      mail: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignInValidationError();

    return { ...result.value };
  }

  static signupBody(data: ISignupAuthBody): ISignupAuthBody {
    const querySchema = Joi.object<ISignupAuthBody>({
      password: Joi.string().min(5),
      shownName: Joi.string().min(2).max(20),
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignUpValidationError();

    return { ...result.value };
  }

  static preSignupBody(data: IPreSignupAuthBody): IPreSignupAuthBody {
    const querySchema = Joi.object<IPreSignupAuthBody>({
      mail: Joi.string().email({ tlds: { allow: false } }),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createSignUpValidationError();

    return { ...result.value };
  }
}
