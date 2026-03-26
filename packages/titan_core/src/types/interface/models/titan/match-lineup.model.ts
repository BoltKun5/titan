export type IMatchLineup = {
  id: string;
  matchId: string;
  clubMemberId: string;
  position: string | null;
  isStarter: boolean;
  minutesPlayed: number | null;
  createdAt?: string;
  updatedAt?: string;
};
