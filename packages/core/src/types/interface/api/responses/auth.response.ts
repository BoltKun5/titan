export interface ISignupAuthResponse {
  user: {
    shownName: string;
    id: string;
    role: number;
  };
  token: string;
}

export interface ISigninAuthResponse {
  user: {
    shownName: string;
    id: string;
    role: number;
  };
  token: string;
}
