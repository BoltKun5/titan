export type ITitanClubAccount = {
  id: string;
  federationClubId: string;
  displayName: string | null;
  brandingColors: string[] | null;
  brandingLogoUrl: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscribedAt: string;
  cancelledAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};
