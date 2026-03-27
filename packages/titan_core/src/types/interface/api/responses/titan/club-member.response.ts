import { IClubMember, ILicense, IMedicalCertificate } from '../../../models';
import { IUser } from '../../../models';

export interface IClubMemberWithDetails extends IClubMember {
  user?: Partial<IUser>;
  licenses?: ILicense[];
  medicalCertificates?: IMedicalCertificate[];
}

export interface IClubMemberResponse {
  member: IClubMemberWithDetails;
}

export interface IClubMemberListResponse {
  members: IClubMemberWithDetails[];
}

export interface ILicenseResponse {
  license: ILicense;
}

export interface IMedicalCertificateResponse {
  certificate: IMedicalCertificate;
}
