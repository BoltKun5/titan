import { HandballPlayerPosition, FederationShootingHand } from '../../../../../enums';

export type IFederationPlayerHandball = {
  playerId: string;
  positions: HandballPlayerPosition[];
  shootingHand: FederationShootingHand | null;
  preferredJerseyNumber: number | null;
  createdAt?: string;
  updatedAt?: string;
};
