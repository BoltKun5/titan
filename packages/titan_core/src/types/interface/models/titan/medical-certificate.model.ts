export type IMedicalCertificate = {
  id: string;
  clubMemberId: string;
  fileUrl: string | null;
  isValid: boolean;
  issueDate: string;
  expirationDate: string;
  createdAt?: string;
  updatedAt?: string;
};
