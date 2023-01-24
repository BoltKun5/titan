import { IDeleteSetRenameAdminQuery } from 'vokit_core/src/types/interface/api/requests/admin.request';
import { IPostSetRenameAdminBody } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class AdminValidation {
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
}
