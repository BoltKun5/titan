/**
 * Generic event categories. The per-sport `subtype` (string) is validated
 * by the corresponding SportModule.matchEventSubtypes.
 */
export enum FederationMatchEventType {
  GOAL = 'goal',
  SAVE = 'save',
  SANCTION = 'sanction',
  SUBSTITUTION = 'substitution',
  TIMEOUT = 'timeout',
  ASSIST = 'assist',
  TECHNICAL_FAULT = 'technical_fault',
  OTHER = 'other',
}
