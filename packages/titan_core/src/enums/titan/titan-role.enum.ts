/** Titan-specific roles for club access control (separate from UserRoleEnum which is app-wide). */
export enum TitanRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  COACH = 'coach',
  PLAYER = 'player',
  PARENT = 'parent',
  VIEWER = 'viewer',
}
