import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import { CardSerie, CardSet } from '../../database';
import { IGetAllSeriesResponse } from 'vokit_core';

class SerieController implements Controller {
  private static readonly logger = new LoggerModel(SerieController.name);

  async getAllSeries(
    req: Request<Record<string, never>, IGetAllSeriesResponse, void>,
    res: Response<IGetAllSeriesResponse, ILocals>,
  ): Promise<void> {
    const series = await CardSerie.findAll({
      include: [
        {
          model: CardSet,
          as: 'cardSets',
        },
      ],
      order: [[{ model: CardSet, as: 'cardSets' }, 'releaseDate', 'DESC']],
    });

    res.json({
      data: series,
    });
  }

  async createSet(): Promise<void> {
    await CardSet.create();
  }

  async createSerie(): Promise<void> {
    await CardSerie.create();
  }
}

export default new SerieController();
