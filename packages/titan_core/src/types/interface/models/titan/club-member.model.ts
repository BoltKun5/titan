import { ClubMemberRole, ClubMemberStatus } from '../../../../enums';

export type IClubMember = {
  id: string;
  clubId: string;
  userId: string;
  seasonId: string;
  role: ClubMemberRole;
  status: ClubMemberStatus;
  position: string | null;
  jerseyNumber: number | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  joinedAt: string;
  createdAt?: string;
  updatedAt?: string;
};
