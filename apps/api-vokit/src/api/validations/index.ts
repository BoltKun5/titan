export * from './auth.validation';
export * from './admin.validation';
export * from './possession.validation';

import Joi from 'joi';

export function UIDQuery(): Joi.StringSchema {
  return Joi.string().min(36).max(36).required();
}
