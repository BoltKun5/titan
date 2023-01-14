import { IAdminConfig } from './../../models/admin-config.model';

export interface IDataImportAdminResponse {
  code: string;
}

export interface IGetSetRenameAdminResponse {
  data: IAdminConfig[];
}

export interface IPostSetRenameAdminResponse {
  data: IAdminConfig;
}

export interface IDeleteSetRenameAdminResponse {
  deletedId: string;
}
