/** Generic match event types. Sport-specific types (e.g. handball 6m, 9m) are stored in SportConfig. */
export enum MatchEventType {
  GOAL = 'goal',
  ASSIST = 'assist',
  SAVE = 'save',
  SANCTION = 'sanction',
  SUBSTITUTION = 'substitution',
  TIMEOUT = 'timeout',
}
