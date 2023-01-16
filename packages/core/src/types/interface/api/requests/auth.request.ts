export interface ISigninAuthBody {
  password: string;
  username: string;
}

export interface ISignupAuthBody {
  password: string;
  username: string;
  shownName: string;
}
