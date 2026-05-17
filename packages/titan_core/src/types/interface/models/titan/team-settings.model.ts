export type ITitanTeamSettings = {
  id: string;
  federationTeamId: string;
  clubAccountId: string;
  coachUserId: string | null;
  assistantCoachUserId: string | null;
  internalNotes: string | null;
  displayColor: string | null;
  createdAt?: string;
  updatedAt?: string;
};
