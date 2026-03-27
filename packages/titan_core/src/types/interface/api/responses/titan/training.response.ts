import { ITraining, ITrainingAttendance } from '../../../models';

export interface ITrainingWithAttendance extends ITraining {
  attendance?: ITrainingAttendance[];
}

export interface ITrainingResponse {
  training: ITrainingWithAttendance;
}

export interface ITrainingListResponse {
  trainings: ITraining[];
}
