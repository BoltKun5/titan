import {
  IGetUserByIdQuery,
  IUpdateOptionBody,
  IUpdateShownNameBody,
  IUpdateUserPasswordBody,
  IUpdateBioBody,
} from 'titan_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class UserValidation {
  static getByIdQuery(data: IGetUserByIdQuery): IGetUserByIdQuery {
    const querySchema = Joi.object<IGetUserByIdQuery>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updateShownNameBody(data: IUpdateShownNameBody): IUpdateShownNameBody {
    const querySchema = Joi.object<IUpdateShownNameBody>({
      shownName: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updatePasswordBody(
    data: IUpdateUserPasswordBody,
  ): IUpdateUserPasswordBody {
    const querySchema = Joi.object<IUpdateUserPasswordBody>({
      password: Joi.string().min(5),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updateOptionBody(data: IUpdateOptionBody): IUpdateOptionBody {
    const querySchema = Joi.object<IUpdateOptionBody>({
      profilePicture: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updateBioBody(data: IUpdateBioBody): IUpdateBioBody {
    const querySchema = Joi.object<IUpdateBioBody>({
      bio: Joi.string().max(500).allow(''),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
