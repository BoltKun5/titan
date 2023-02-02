export interface IUserTagsBody {
  token: string;
}

export interface IUserTagsQuery {
  userId?: string;
}

export interface ICreateTagBody {
  name: string;
}
