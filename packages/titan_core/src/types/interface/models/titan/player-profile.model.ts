export type ITitanPlayerProfile = {
  id: string;
  federationPlayerId: string;
  clubAccountId: string;
  userId: string | null;
  customPhotoUrl: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  internalNotes: string | null;
  imageRightsConsented: boolean;
  imageRightsConsentDate: string | null;
  createdAt?: string;
  updatedAt?: string;
};
