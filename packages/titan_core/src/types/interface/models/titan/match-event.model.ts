import { MatchEventType } from '../../../../enums';

export type IMatchEvent = {
  id: string;
  matchId: string;
  clubMemberId: string | null;
  eventType: MatchEventType;
  /** Sport-specific subtype (e.g. "7m", "9m" for handball goals) */
  subtype: string | null;
  minute: number | null;
  period: string | null;
  details: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
};
