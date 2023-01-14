import { HttpResponseError } from './../modules/http-response-error';
import { IAdminConfig } from './../../../../packages/core/src/types/interface/models/admin-config.model';
import { EntityService } from '../core';
import { AdminConfig } from '../database/models/admin-config.model';
import { AdminConfigTypeEnum } from 'vokit_core';

export class ImportDataService extends EntityService<AdminConfig, IAdminConfig> {
  public async getSetRename(): Promise<AdminConfig[]> {
    try {
      const response = await AdminConfig.findAll({
        where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
        order: ['name'],
      });
      return response;
    } catch (e) {
      throw e;
    }
  }

  public async deleteSetRename(id: string): Promise<string> {
    try {
      const existing = await AdminConfig.findOne({
        where: { id },
      });

      if (!existing) {
        throw HttpResponseError.createNotFoundError();
      }

      await existing.destroy();
      return id;
    } catch (e) {
      throw e;
    }
  }
}

export default new ImportDataService();
