import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { playerService } from '../../../services/titan';
import PlayerValidation from '../../validations/titan/player.validation';

class PlayerController implements Controller {
  private static readonly logger = new LoggerModel(PlayerController.name);

  async create(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = PlayerValidation.createPlayerBody(req.body);
    const player = await playerService.create(req.params.clubId, body);
    res.json({ data: player });
  }

  async getByClub(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const active =
      req.query.active !== undefined ? req.query.active === 'true' : undefined;
    const players = await playerService.getByClub(req.params.clubId, active);
    res.json({ data: players });
  }

  async getById(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const player = await playerService.getById(req.params.playerId);
    res.json({ data: player });
  }

  async update(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = PlayerValidation.updatePlayerBody(req.body);
    const player = await playerService.update(req.params.playerId, body);
    res.json({ data: player });
  }

  async delete(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await playerService.delete(req.params.playerId);
    res.json({ data: null });
  }

  async findByLicense(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const licenseNumber = req.query.licenseNumber as string;
    const player = await playerService.findByLicense(
      req.params.clubId,
      licenseNumber,
    );
    res.json({ data: player });
  }

  async findByFederationId(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const federationPlayerId = req.query.federationPlayerId as string;
    const player = await playerService.findByFederationId(
      req.params.clubId,
      federationPlayerId,
    );
    res.json({ data: player });
  }

  async linkUser(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = PlayerValidation.linkPlayerUserBody(req.body);
    const player = await playerService.linkUser(
      req.params.playerId,
      body.userId,
    );
    res.json({ data: player });
  }

  async unlinkUser(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const player = await playerService.unlinkUser(req.params.playerId);
    res.json({ data: player });
  }
}

export default new PlayerController();
