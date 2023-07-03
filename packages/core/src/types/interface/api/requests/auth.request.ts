export interface ISigninAuthBody {
  password: string;
  mail: string;
}

export interface ISignupAuthBody {
  password: string;
  shownName: string;
  id: string;
  mail: string;
}

export interface IRenewPasswordBody {
  mail: string;
}
