import {ISigninAuthBody, ISignupAuthBody} from '../../local_core/types/types/interface';
import { HttpResponseError } from '../../modules/HttpResponseError';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: ISigninAuthBody): ISigninAuthBody {
    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string(),
      password: Joi.string()
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError(result.error.message);

    return { ...result.value };
  }

  static signupBody(data: ISignupAuthBody): ISignupAuthBody {
    const querySchema = Joi.object<ISignupAuthBody>({
      username: Joi.string().min(3).max(20),
      password: Joi.string().min(5).max(30),
      shownName: Joi.string().min(3).max(20)
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError(result.error.message);

    return { ...result.value };
  }
}
