import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { matchService } from '../../../services/titan';
import MatchValidation from '../../validations/titan/match.validation';

class MatchController implements Controller {
  private static readonly logger = new LoggerModel(MatchController.name);

  async create(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MatchValidation.createMatchBody(req.body);
    const match = await matchService.createMatch(body);
    res.json({ data: match });
  }

  async list(
    req: Request<
      
     
     
     
    
      { clubId: string },
      any,
      any,
      { teamId?: string; seasonId?: string }
    >,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const matches = await matchService.getMatches(
      req.query.teamId!,
      req.query.seasonId,
    );
    res.json({ data: matches });
  }

  async get(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const match = await matchService.getMatch(req.params.matchId);
    res.json({ data: match });
  }

  async update(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MatchValidation.updateMatchBody(req.body);
    const match = await matchService.updateMatch(req.params.matchId, body);
    res.json({ data: match });
  }

  async remove(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await matchService.deleteMatch(req.params.matchId);
    res.json({ data: null });
  }

  async setLineup(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MatchValidation.setLineupBody(req.body);
    await matchService.setLineup(req.params.matchId, body);
    res.json({ data: null });
  }

  async addEvent(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MatchValidation.addEventBody(req.body);
    const event = await matchService.addEvent(req.params.matchId, body);
    res.json({ data: event });
  }

  async deleteEvent(
    req: Request<{ matchId: string; eventId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await matchService.deleteEvent(req.params.eventId);
    res.json({ data: null });
  }
}

export default new MatchController();
