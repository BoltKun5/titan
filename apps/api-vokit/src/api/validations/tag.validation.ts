import { ICreateTagBody, IUserTagsQuery } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class TagValidation {
  static createTag(data: ICreateTagBody): ICreateTagBody {
    const querySchema = Joi.object<ICreateTagBody>({
      name: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static getTags(data: IUserTagsQuery): IUserTagsQuery {
    const querySchema = Joi.object<IUserTagsQuery>({
      userId: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
