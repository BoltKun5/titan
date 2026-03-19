export interface IPostSetRenameAdminBody {
  name: string;
  value: string;
  id?: string;
}

export interface IDeleteSetRenameAdminQuery {
  id?: string;
}

export interface IDeleteSetRenameAdminValidatedQuery {
  id: string;
}
