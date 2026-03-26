import { SportType } from '../../../../enums';

export type ISportConfig = {
  id: string;
  sport: SportType;
  /** JSON containing positions for this sport (e.g. handball: pivot, ailier gauche, etc.) */
  positions: string[];
  /** JSON containing goal/score subtypes (e.g. handball: 6m, 9m, aile, contre-attaque, 7m) */
  goalSubtypes: string[];
  /** JSON containing sanction types (e.g. handball: 2min, carton jaune, disqualification) */
  sanctionTypes: string[];
  /** JSON containing match periods (e.g. handball: ["1ère MT", "2ème MT"]) */
  periods: string[];
  /** Sport-specific ranking rules as JSON */
  rankingRules: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
};
