import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateFeePlanBody,
  IRecordPaymentBody,
  ICreateBudgetEntryBody,
  PaymentMethod,
  BudgetEntryType,
  BudgetCategory,
} from 'titan_core';

export default class FinanceValidation {
  static createFeePlanBody(data: ICreateFeePlanBody): ICreateFeePlanBody {
    const schema = Joi.object<ICreateFeePlanBody>({
      seasonId: Joi.string().uuid().required(),
      category: Joi.string().min(1).required(),
      amount: Joi.number().min(0).required(),
      installments: Joi.number().integer().min(1).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static recordPaymentBody(data: IRecordPaymentBody): IRecordPaymentBody {
    const schema = Joi.object<IRecordPaymentBody>({
      clubMemberId: Joi.string().uuid().required(),
      feePlanId: Joi.string().uuid().required(),
      amount: Joi.number().min(0).required(),
      method: Joi.string()
        
        
        .valid(...Object.values(PaymentMethod))
        .optional(),
      dueDate: Joi.string().isoDate().optional(),
      notes: Joi.string().allow('', null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
    ,
  

  static createBudgetEntryBody(
    data: ICreateBudgetE
        ntryBody,
        
  ): ICreateBudgetEntryBody 
        {
        
    const schema = Joi.object<ICreateBudgetEntryBody>({
      seasonId: Joi.string().uuid().required(),
      type: Joi.string()
        .valid(...Object.values(BudgetEntryType))
        .required(),
      category: Joi.string()
        .valid(...Object.values(BudgetCategory))
        .required(),
      label: Joi.string().min(1).required(),
      amount: Joi.number().min(0).required(),
      date: Joi.string().isoDate().required(),
      notes: Joi.string().allow('', null).optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
