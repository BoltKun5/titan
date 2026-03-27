export type IRecordPlayerMatchStatsBody = {
  playerId: string;
  matchId: string;
  isStarter?: boolean;
  minutesPlayed?: number | null;
  goals?: number;
  goalDetails?: Record<string, number> | null;
  assists?: number;
  saves?: number;
  saveDetails?: Record<string, number> | null;
  sanctions?: Record<string, number> | null;
  shotsAttempted?: number | null;
  penaltiesAttempted?: number | null;
  penaltiesScored?: number | null;
  rating?: number | null;
  customStats?: Record<string, any> | null;
};

export type IUpdatePlayerMatchStatsBody = {
  isStarter?: boolean;
  minutesPlayed?: number | null;
  goals?: number;
  goalDetails?: Record<string, number> | null;
  assists?: number;
  saves?: number;
  saveDetails?: Record<string, number> | null;
  sanctions?: Record<string, number> | null;
  shotsAttempted?: number | null;
  penaltiesAttempted?: number | null;
  penaltiesScored?: number | null;
  rating?: number | null;
  customStats?: Record<string, any> | null;
};
