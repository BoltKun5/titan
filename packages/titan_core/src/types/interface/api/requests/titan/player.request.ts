export type ICreatePlayerBody = {
  firstName: string;
  lastName: string;
  photo?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  licenseNumber?: string | null;
  federationPlayerId?: string | null;
  position?: string | null;
  jerseyNumber?: number | null;
};

export type IUpdatePlayerBody = {
  firstName?: string;
  lastName?: string;
  photo?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  licenseNumber?: string | null;
  federationPlayerId?: string | null;
  position?: string | null;
  jerseyNumber?: number | null;
  isActive?: boolean;
};

export type ILinkPlayerUserBody = {
  userId: string;
};
