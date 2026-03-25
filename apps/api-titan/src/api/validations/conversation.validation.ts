import { ICreateConversationBody, ConversationType } from 'titan_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class ConversationValidation {
  static createBody(data: ICreateConversationBody): ICreateConversationBody {
    const querySchema = Joi.object<ICreateConversationBody>({
      participantIds: Joi.array().items(Joi.string().uuid()).min(1).max(100),
      name: Joi.string().max(100).allow(null, '').optional(),
      description: Joi.string().max(500).allow(null, '').optional(),
      type: Joi.string().valid(...Object.values(ConversationType)),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }

  static markAsReadParams(data: { id: string }): { id: string } {
    const querySchema = Joi.object({
      id: Joi.string().uuid(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }
}
