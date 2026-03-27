import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { statsService } from '../../../services/titan';
import StatsValidation from '../../validations/titan/stats.validation';

class StatsController implements Controller {
  private static readonly logger = new LoggerModel(StatsController.name);

  // --- Player Match Stats ---

  async recordMatchStats(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = StatsValidation.recordMatchStatsBody(req.body);
    const stats = await statsService.recordMatchStats(body);
    res.json({ data: stats });
  }

  async updateMatchStats(
    req: Request<{ statsId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = StatsValidation.updateMatchStatsBody(req.body);
    const stats = await statsService.updateMatchStats(req.params.statsId, body);
    res.json({ data: stats });
  }

  async deleteMatchStats(
    req: Request<{ statsId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await statsService.deleteMatchStats(req.params.statsId);
    res.json({ data: null });
  }

  async getMatchStatsByPlayer(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const seasonId = req.query.seasonId as string | undefined;
    const stats = await statsService.getMatchStatsByPlayer(
      req.params.playerId,
      seasonId,
    );
    res.json({ data: stats });
  }

  async getMatchStatsByMatch(
    req: Request<{ matchId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const stats = await statsService.getMatchStatsByMatch(req.params.matchId);
    res.json({ data: stats });
  }

  // --- Player Season Stats ---

  async recomputePlayerSeasonStats(
    req: Request<{ playerId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const teamId = req.query.teamId as string | undefined;
    const stats = await statsService.recomputePlayerSeasonStats(
      req.params.playerId,
      req.params.seasonId,
      teamId,
    );
    res.json({ data: stats });
  }

  async getPlayerSeasonStats(
    req: Request<{ playerId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const stats = await statsService.getPlayerSeasonStats(req.params.playerId);
    res.json({ data: stats });
  }

  // --- Team Season Stats ---

  async getTeamSeasonStats(
    req: Request<{ teamId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const stats = await statsService.getTeamSeasonStats(
      req.params.teamId,
      req.params.seasonId,
    );
    res.json({ data: stats });
  }

  async upsertTeamSeasonStats(
    req: Request<{ teamId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const stats = await statsService.upsertTeamSeasonStats(
      req.params.teamId,
      req.params.seasonId,
      req.body,
    );
    res.json({ data: stats });
  }

  // --- Rankings ---

  async getTopScorers(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const stats = await statsService.getTopScorers(
      req.params.clubId,
      req.params.seasonId,
      limit,
    );
    res.json({ data: stats });
  }

  async getTopAssists(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const stats = await statsService.getTopAssists(
      req.params.clubId,
      req.params.seasonId,
      limit,
    );
    res.json({ data: stats });
  }

  async getTopSaves(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const stats = await statsService.getTopSaves(
      req.params.clubId,
      req.params.seasonId,
      limit,
    );
    res.json({ data: stats });
  }

  // --- Club Overview ---

  async getClubStatsOverview(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const overview = await statsService.getClubStatsOverview(
      req.params.clubId,
      req.params.seasonId,
    );
    res.json({ data: overview });
  }
}

export default new StatsController();
