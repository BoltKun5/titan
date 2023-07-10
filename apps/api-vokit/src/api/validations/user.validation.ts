import {
  IDeleteSetRenameAdminQuery,
  IPostSetRenameAdminBody,
  IUpdateOptionBody,
  IUpdateShownNameBody,
  IUpdateUserPasswordBody,
} from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class UserValidation {
  static postSetRenameBody(data: IPostSetRenameAdminBody): IPostSetRenameAdminBody {
    const querySchema = Joi.object<IPostSetRenameAdminBody>({
      value: Joi.string(),
      name: Joi.string(),
      id: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteSetRenameQuery(data: IDeleteSetRenameAdminQuery): IDeleteSetRenameAdminQuery {
    const querySchema = Joi.object<IDeleteSetRenameAdminQuery>({
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

  static updatePasswordBody(data: IUpdateUserPasswordBody): IUpdateUserPasswordBody {
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
}
