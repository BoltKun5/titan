import {
  IMainDashboardResponse,
  CryptionType,
  IMainDashboardData,
  Algorithm,
} from 'abyss_crypt_core';
import { Request, Response } from 'express';
import { IResponseLocals } from './../../../../local-core';

export default class DashboardController {
  static async main(
    req: Request<any, any, void>,
    res: Response<IMainDashboardResponse, IResponseLocals>,
  ): Promise<void> { }
}
