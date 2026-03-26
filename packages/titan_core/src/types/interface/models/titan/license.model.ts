import { LicenseStatus } from '../../../../enums';

export type ILicense = {
  id: string;
  clubMemberId: string;
  licenseNumber: string;
  type: string | null;
  status: LicenseStatus;
  startDate: string;
  expirationDate: string;
  createdAt?: string;
  updatedAt?: string;
};
