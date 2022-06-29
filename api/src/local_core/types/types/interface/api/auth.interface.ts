import { ErrorType } from "abyss_core";
import { User } from "../../../../../database"

export interface ISigninAuthBody {
  password: string,
  username: string
}

export interface ISignupAuthBody {
  password: string,
  username: string,
  shownName: string,
}

export interface ISignupAuthResponse {
  user: User,
  token: string
}

export interface ISigninAuthResponse {
  user: User,
  token: string
}

export interface IResponse<T> {
  data: T;
  error?: IApiError | Error;
}

export interface IApiError {
  type: ErrorType;
  code: string;
  message: string;
  params?: string;
  field?: string;
}
