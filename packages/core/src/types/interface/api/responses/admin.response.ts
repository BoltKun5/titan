import { IAdminConfig } from './../../models/admin-config.model';

export interface IDataImportAdminResponse {
  code: string;
}

export interface IGetSetRenameAdminResponse {
  renames: IAdminConfig[];
}

export interface IPostSetRenameAdminResponse {
  rename: IAdminConfig;
}

export interface IDeleteSetRenameAdminResponse {
  deletedId: string;
}
