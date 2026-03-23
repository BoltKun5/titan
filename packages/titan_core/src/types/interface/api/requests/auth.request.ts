export interface ISigninAuthBody {
  password: string;
  mail: string;
}

export interface ISignupAuthBody {
  password: string;
  firstName: string;
  lastName: string;
  shownName: string;
  id: string;
  mail: string;
}
