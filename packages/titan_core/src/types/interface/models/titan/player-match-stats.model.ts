export type IPlayerMatchStats = {
  id: string;
  playerId: string;
  matchId: string;
  isStarter: boolean;
  minutesPlayed: number | null;
  goals: number;
  /** Breakdown by type, e.g. { "6m": 3, "9m": 2, "7m": 1 } */
  goalDetails: Record<string, number> | null;
  assists: number;
  saves: number;
  /** Breakdown by zone, e.g. { "left": 2, "center": 3 } */
  saveDetails: Record<string, number> | null;
  /** Sanctions breakdown, e.g. { "warnings": 1, "exclusions": 2 } */
  sanctions: Record<string, number> | null;
  shotsAttempted: number | null;
  penaltiesAttempted: number | null;
  penaltiesScored: number | null;
  /** Coach rating (0-10) */
  rating: number | null;
  /** Sport-specific extra data */
  customStats: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
};
