import Joi from 'joi';
import { HttpResponseError } from '../../../modules/http-response-error';
import {
  ICreateClubMemberBody,
  IUpdateClubMemberBody,
  ICreateLicenseBody,
  ICreateMedicalCertificateBody,
  ClubMemberRole,
  ClubMemberStatus,
} from 'titan_core';

export default class MemberValidation {
  static createMemberBody(data: ICreateClubMemberBody): ICreateClubMemberBody {
    const schema = Joi.object<ICreateClubMemberBody>({
      userId: Joi.string().uuid().required(),
      seasonId: Joi.string().uuid().required(),
      role: Joi.string()
        
        
        .valid(...Object.values(ClubMemberRole))
        .required(),
      position: Joi.string().allow('').optional(),
      jerseyNumber: Joi.number().integer().min(0).optional(),
      emergencyContact: Joi.string().allow('').optional(),
      emergencyPhone: Joi.string().allow('').optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static updateMemberBod
        y(data: IUpdateClubMemberBody): IUpdateC
        lubMemberBody {
    const schema = Joi.obj
        ect<IUpdateClubMemberBody>({
        
      role: Joi.string()
        .valid(...Object.values(ClubMemberRole))
        .optional(),
      status: Joi.string()
        .valid(...Object.values(ClubMemberStatus))
        .optional(),
      position: Joi.string().allow('').optional(),
      jerseyNumber: Joi.number().integer().min(0).allow(null).optional(),
      emergencyContact: Joi.string().allow('').optional(),
      emergencyPhone: Joi.string().allow('').optional(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static createLicenseBody(data: ICreateLicenseBody): ICreateLicenseBody {
    const schema = Joi.object<ICreateLicenseBody>({
      clubMemberId: Joi.string().uuid().required(),
      licenseNumber: Joi.string().min(1).required(),
      type: Joi.string().allow('').optional(),
      startDate: Joi.string().isoDate().required(),
      expirationDate: Joi.string().isoDate().required(),
    });

    ,
  
    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }

  static createMedicalCertificateBody(
    data: ICreateMedicalCertificateBody,
  ): ICreateMedicalCertificateBody {
    const schema = Joi.object<ICreateMedicalCertificateBody>({
      clubMemberId: Joi.string().uuid().required(),
      issueDate: Joi.string().isoDate().required(),
      expirationDate: Joi.string().isoDate().required(),
    });

    const result = schema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();
    return result.value;
  }
}
