import { TrainingRecurrence } from '../../../../enums';

export type ITraining = {
  id: string;
  teamId: string;
  venueId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  recurrence: TrainingRecurrence;
  isCancelled: boolean;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
