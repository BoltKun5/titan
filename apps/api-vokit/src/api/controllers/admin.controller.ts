import { IDeleteSetRenameAdminQuery } from './../../../../../packages/core/src/types/interface/api/requests/admin.request';
import {
  AdminConfigTypeEnum,
  IDataImportAdminResponse,
  IDeleteSetRenameAdminResponse,
  IGetSetRenameAdminResponse,
  IPostSetRenameAdminBody,
  IPostSetRenameAdminResponse,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import importDataService from '../../services/import-data.service';
import adminConfigService from '../../services/admin-config.service';
import AdminValidation from '../validations/admin.validation';
import { AdminConfig } from '../../database';

class AdminController implements Controller {
  private static readonly logger = new LoggerModel(AdminController.name);

  async forceImportData(
    req: Request<Record<string, never>, IDataImportAdminResponse, void>,
    res: Response<IDataImportAdminResponse, ILocals>,
  ): Promise<void> {
    await importDataService.forceImport();

    res.status(200);
  }

  async importTestData(
    req: Request<Record<string, never>, IDataImportAdminResponse, void>,
    res: Response<IDataImportAdminResponse, ILocals>,
  ): Promise<void> {
    await importDataService.importTestData();

    res.status(200);
  }

  async getSetRename(
    req: Request<Record<string, never>, IGetSetRenameAdminResponse, void>,
    res: Response<IGetSetRenameAdminResponse, ILocals>,
  ): Promise<void> {
    const renames = await adminConfigService.getSetRename();

    res.json({
      data: renames,
    });
  }

  async postSetRename(
    req: Request<Record<string, never>, IPostSetRenameAdminResponse, IPostSetRenameAdminBody>,
    res: Response<IPostSetRenameAdminResponse, ILocals>,
  ): Promise<void> {
    req.body = AdminValidation.postSetRenameBody(req.body);

    const [existing] = await AdminConfig.upsert({
      ...(req.body?.id ? { id: req.body.id } : {}),
      name: req.body.name,
      value: req.body.value,
      type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'],
    });

    res.json({
      data: existing,
    });
  }

  async deleteSetRename(
    req: Request<
      Record<string, never>,
      IDeleteSetRenameAdminResponse,
      void,
      IDeleteSetRenameAdminQuery
    >,
    res: Response<IDeleteSetRenameAdminResponse, ILocals>,
  ): Promise<void> {
    req.query = AdminValidation.deleteSetRenameQuery(req.query);

    await adminConfigService.deleteSetRename(req.query.id ?? '');

    res.status(200);
  }
}

export default new AdminController();
