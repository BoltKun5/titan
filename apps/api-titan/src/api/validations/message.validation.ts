import { ISendMessageBody, MessageType } from 'titan_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class MessageValidation {
  static sendBody(data: ISendMessageBody): ISendMessageBody {
    const querySchema = Joi.object<ISendMessageBody>({
      content: Joi.string().min(1).max(5000),
      type: Joi.string()
        .valid(...Object.values(MessageType))
        .optional()
        .default(MessageType.TEXT),
      replyToId: Joi.string().uuid().optional().allow(null),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }

  static listParams(data: { conversationId: string }): {
    conversationId: string;
  } {
    const querySchema = Joi.object({
      conversationId: Joi.string().uuid(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }

  static listQuery(data: { page?: string; limit?: string }): {
    page: number;
    limit: number;
  } {
    const querySchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(50),
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError();

    return { ...result.value };
  }
}
