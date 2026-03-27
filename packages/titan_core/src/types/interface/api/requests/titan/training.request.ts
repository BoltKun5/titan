import { TrainingRecurrence } from '../../../../../enums';

export interface ICreateTrainingBody {
  teamId: string;
  venueId?: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence?: TrainingRecurrence;
  notes?: string;
}

export interface IUpdateTrainingBody {
  venueId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  recurrence?: TrainingRecurrence;
  isCancelled?: boolean;
  notes?: string;
}

export interface IMarkAttendanceBody {
  attendees: {
    clubMemberId: string;
    isPresent: boolean;
  }[];
}
