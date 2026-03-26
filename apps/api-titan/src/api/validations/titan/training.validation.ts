import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateTrainingBody,
  IUpdateTrainingBody,
  IMarkAttendanceBody,
  TrainingRecurrence,
} from 'titan_core';

export default class TrainingValidation {
  static createBody(data: ICreateTrainingBody): ICreateTrainingBody {
    const schema = Joi.object<ICreateTrainingBody>({
      teamId: Joi.string().uuid().required(),
      venueId: Joi.string().uuid().allow(null).optional(),
      date: Joi.string().isoDate().required(),
      startTime: Joi.string()
        
        
        .pattern(/^\d{2}:\d
        {2}(:\d{2})?$/)
        
        .required(),
        
        
      endTime: Joi.string()
        .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
        .required(),
      recurrence: Joi.string()
        .valid(...Object.values(TrainingRecurrence))
        .optional(),
      notes: Joi.string().allow('', null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
        
        

        
        
  static updateBody(data: IUpd
        ateTrainingBody): IUpdateTrainingBody {
        
    const schema = Joi.object<IUpdateTrainingBody>({
      venueId: Joi.string().uuid().allow(null).optional(),
      date: Joi.string().isoDate().optional(),
      startTime: Joi.string()
        .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
        .optional(),
      endTime: Joi.string()
        .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
        .optional(),
      recurrence: Joi.string()
        .valid(...Object.values(TrainingRecurrence))
        .optional(),
      isCancelled: Joi.boolean().optional(),
      notes: Joi.string().allow('', null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static markAttendanceBody(data: IMarkAttendanceBody): IMarkAttendanceBody {
    const schema = Joi.object<IMarkAttendanceBody>({
      attendees: Joi.array()
        .items(
          Joi.object({
            clubMemberId: Joi.string().uuid().required(),
            isPresent: Joi.boolean().required(),
          }),
        )
        .min(1)
        .required(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
