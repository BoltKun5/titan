import { ClubMemberRole, ClubMemberStatus } from '../../../../../enums';

export interface ICreateClubMemberBody {
  userId: string;
  seasonId: string;
  role: ClubMemberRole;
  position?: string;
  jerseyNumber?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface IUpdateClubMemberBody {
  role?: ClubMemberRole;
  status?: ClubMemberStatus;
  position?: string;
  jerseyNumber?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface ICreateLicenseBody {
  clubMemberId: string;
  licenseNumber: string;
  type?: string;
  startDate: string;
  expirationDate: string;
}

export interface ICreateMedicalCertificateBody {
  clubMemberId: string;
  issueDate: string;
  expirationDate: string;
}
