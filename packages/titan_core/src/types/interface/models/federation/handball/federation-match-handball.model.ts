export type IFederationMatchHandball = {
  matchId: string;
  scoreHalfHome: number | null;
  scoreHalfAway: number | null;
  hasExtraTime: boolean;
  scoreExtraHome: number | null;
  scoreExtraAway: number | null;
  hasShootout: boolean;
  scoreShootoutHome: number | null;
  scoreShootoutAway: number | null;
  matchDurationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
};
