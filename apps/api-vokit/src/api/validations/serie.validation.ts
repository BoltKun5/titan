import { ICreateSetBody, IImportDataBody, ISerieUpdateBody, ISetUpdateBody } from 'vokit_core';
import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class SerieValidation {
  static updateSet(data: ISetUpdateBody): ISetUpdateBody {
    const querySchema = Joi.object<ISetUpdateBody>({
      code: Joi.string(),
      name: Joi.string(),
      id: Joi.string(),
      releaseDate: Joi.date(),
      cardSerieId: Joi.string(),
      imageId: Joi.string(),
      logoId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static createSet(data: ICreateSetBody): ICreateSetBody {
    const querySchema = Joi.object<ICreateSetBody>({
      cardSerieId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updateSerie(data: ISerieUpdateBody): ISerieUpdateBody {
    const querySchema = Joi.object<ISerieUpdateBody>({
      code: Joi.string(),
      name: Joi.string(),
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static importData(data: IImportDataBody): IImportDataBody {
    const querySchema = Joi.object<IImportDataBody>({
      data: Joi.array(),
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
