import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { teamService } from '../../../services/titan';
import TeamValidation from '../../validations/titan/team.validation';

class TeamController implements Controller {
  private static readonly logger = new LoggerModel(TeamController.name);

  async create(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TeamValidation.createTeamBody(req.body);
    const team = await teamService.createTeam(req.params.clubId, body);
    res.json({ data: team });
  }

  async list(
    req: Request<{ clubId: string }, any, any, { seasonId?: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const teams = await teamService.getTeams(
      req.params.clubId,
      req.query.seasonId,
    );
    res.json({ data: teams });
  }

  async get(
    req: Request<{ teamId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const team = await teamService.getTeam(req.params.teamId);
    res.json({ data: team });
  }

  async update(
    req: Request<{ teamId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TeamValidation.updateTeamBody(req.body);
    const team = await teamService.updateTeam(req.params.teamId, body);
    res.json({ data: team });
  }

  async remove(
    req: Request<{ teamId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await teamService.deleteTeam(req.params.teamId);
    res.json({ data: null });
  }

  async addPlayer(
    req: Request<{ teamId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TeamValidation.addPlayerBody(req.body);
    const player = await teamService.addPlayer(req.params.teamId, body);
    res.json({ data: player });
  }

  async removePlayer(
    req: Request<{ teamId: string; playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await teamService.removePlayer(req.params.playerId);
    res.json({ data: null });
  }
}

export default new TeamController();
