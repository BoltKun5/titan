import { IUser } from '../../models';

export interface ISignupAuthResponse {
  user: IUser;
  token: string;
}

export interface ISigninAuthResponse {
  user: IUser;
  token: string;
}
