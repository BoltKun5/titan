import { GenderSection } from '../../../../../enums';

export interface ICreateTeamBody {
  seasonId: string;
  name: string;
  category?: string;
  division?: string;
  pool?: string;
  genderSection: GenderSection;
  federationTeamId?: string;
  coachId?: string;
  assistantCoachId?: string;
}

export interface IUpdateTeamBody {
  name?: string;
  category?: string;
  division?: string;
  pool?: string;
  genderSection?: GenderSection;
  federationTeamId?: string;
  coachId?: string;
  assistantCoachId?: string;
}

export interface IAddTeamPlayerBody {
  clubMemberId: string;
  position?: string;
  jerseyNumber?: number;
  isCaptain?: boolean;
}
