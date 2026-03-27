export type ITrainingAttendance = {
  id: string;
  trainingId: string;
  clubMemberId: string;
  isPresent: boolean;
  createdAt?: string;
};
