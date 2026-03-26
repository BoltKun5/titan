export type ITeamPlayer = {
  id: string;
  teamId: string;
  clubMemberId: string;
  position: string | null;
  jerseyNumber: number | null;
  isCaptain: boolean;
  createdAt?: string;
  updatedAt?: string;
};
