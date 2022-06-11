import {
  IMainDashboardResponse,
  CryptionType,
  IMainDashboardData,
  Algorithm,
} from 'abyss_crypt_core';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Cryption } from '../../database';
import { IResponseLocals } from '../../local_core';

export default class DashboardController {
  static async main(
    req: Request<any, any, void>,
    res: Response<IMainDashboardResponse, IResponseLocals>,
  ): Promise<void> {
    const result = await Promise.all([
      Cryption.findAll({
        attributes: [
          [Sequelize.literal(`COUNT(*)`), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('byteSize')), 'totalBytes'],
          [Sequelize.fn('AVG', Sequelize.col('byteSize')), 'averageBytes'],
          [Sequelize.fn('SUM', Sequelize.col('durationMs')), 'totalDurationMs'],
          [Sequelize.fn('AVG', Sequelize.col('durationMs')), 'averageDurationMs'],
          [Sequelize.fn('MAX', Sequelize.col('durationMs')), 'longestDurationMs'],
        ],
        raw: true,
        where: {
          endDate: {
            [Op.not]: null,
          },
          type: CryptionType.ENCRYPT,
        },
      }),
      Cryption.findAll({
        attributes: [
          [Sequelize.literal(`COUNT(*)`), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('byteSize')), 'totalBytes'],
          [Sequelize.fn('AVG', Sequelize.col('byteSize')), 'averageBytes'],
          [Sequelize.fn('SUM', Sequelize.col('durationMs')), 'totalDurationMs'],
          [Sequelize.fn('AVG', Sequelize.col('durationMs')), 'averageDurationMs'],
          [Sequelize.fn('MAX', Sequelize.col('durationMs')), 'longestDurationMs'],
        ],
        raw: true,
        where: {
          endDate: {
            [Op.not]: null,
          },
          type: CryptionType.DECRYPT,
        },
      }),
      Cryption.count({
        where: {
          endDate: null,
        },
      }),
    ]);

    const encryption = result[0][0] as unknown as IMainDashboardData['encryption'];
    const decryption = result[1][0] as unknown as IMainDashboardData['decryption'];

    res.json({
      data: {
        encryption: {
          count: Number(encryption.count ?? 0),
          totalBytes: Number(encryption.totalBytes ?? 0),
          averageBytes: Number(encryption.averageBytes ?? 0),
          averageDurationMs: Number(encryption.averageDurationMs ?? 0),
          totalDurationMs: Number(encryption.totalDurationMs ?? 0),
          longestDurationMs: Number(encryption.longestDurationMs ?? 0),
          mostUsedAlgorithm: Algorithm.AES_256,
        },
        decryption: {
          count: Number(decryption.count ?? 0),
          totalBytes: Number(decryption.totalBytes ?? 0),
          averageBytes: Number(decryption.averageBytes ?? 0),
          averageDurationMs: Number(decryption.averageDurationMs ?? 0),
          totalDurationMs: Number(decryption.totalDurationMs ?? 0),
          longestDurationMs: Number(decryption.longestDurationMs ?? 0),
          mostUsedAlgorithm: Algorithm.AES_256,
        },
        currentCryption: result[2] ?? 0,
      },
    });
  }
}
