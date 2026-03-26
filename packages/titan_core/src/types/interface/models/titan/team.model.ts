import { GenderSection } from '../../../../enums';

export type ITeam = {
  id: string;
  clubId: string;
  seasonId: string;
  name: string;
  category: string | null;
  division: string | null;
  pool: string | null;
  genderSection: GenderSection;
  federationTeamId: string | null;
  coachId: string | null;
  assistantCoachId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
