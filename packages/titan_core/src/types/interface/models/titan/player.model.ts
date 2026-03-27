export type IPlayer = {
  id: string;
  clubId: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  birthDate: string | null;
  nationality: string | null;
  licenseNumber: string | null;
  federationPlayerId: string | null;
  position: string | null;
  jerseyNumber: number | null;
  isActive: boolean;
  /** Linked Mimas user — null until manually associated */
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
