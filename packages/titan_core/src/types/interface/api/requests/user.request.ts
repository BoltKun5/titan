export interface IUpdateShownNameBody {
  shownName: string;
}

export interface IUpdateUserPasswordBody {
  password: string;
}

export interface IUpdateOptionBody {
  profilePicture?: string;
}

export interface IUpdateBioBody {
  bio: string;
}

export interface IGetUserByIdQuery {
  id?: string;
}
