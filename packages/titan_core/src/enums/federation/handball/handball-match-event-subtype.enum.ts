/**
 * Validates the `subtype` string field on federation_match_event for handball matches.
 * Used at write time by the scraper/services.
 */
export enum HandballMatchEventSubtype {
  // goal subtypes
  GOAL_6M = '6m',
  GOAL_7M = '7m',
  GOAL_9M = '9m',
  GOAL_WING = 'wing',
  GOAL_FASTBREAK = 'fastbreak',
  GOAL_PENALTY = 'penalty',
  // sanctions
  SANCTION_2MIN = '2min',
  SANCTION_YELLOW = 'yellow',
  SANCTION_RED = 'red',
  SANCTION_BLUE = 'blue',
  SANCTION_DISQUALIFICATION = 'disqualification',
  // other
  TIMEOUT = 'timeout',
  SUBSTITUTION = 'substitution',
}
