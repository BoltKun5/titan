import Joi from 'joi';
import { HttpResponseError } from '../../modules/HttpResponseError';
import { enumToStringValue } from 'abyss_core';
import { IEncryptFileQuery, Algorithm, IDecryptFileQuery } from 'abyss_crypt_core';

export default class FileValidation {
  static encryptQuery(data: IEncryptFileQuery): IEncryptFileQuery {
    const querySchema = Joi.object<IEncryptFileQuery>({
      algorithm: Joi.valid(...enumToStringValue(Algorithm)).optional(),
      password: Joi.string().min(1),
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError(result.error.message);

    return { ...result.value };
  }

  static decryptQuery(data: IDecryptFileQuery): IDecryptFileQuery {
    const querySchema = Joi.object<IDecryptFileQuery>({
      algorithm: Joi.valid(...enumToStringValue(Algorithm)).optional(),
      password: Joi.string().min(1),
    });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createValidationError(result.error.message);

    return { ...result.value };
  }
}
