import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { trainingService } from '../../../services/titan';
import TrainingValidation from '../../validations/titan/training.validation';

class TrainingController implements Controller {
  private static readonly logger = new LoggerModel(TrainingController.name);

  async create(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TrainingValidation.createBody(req.body);
    const training = await trainingService.create(body);
    res.json({ data: training });
  }

  async list(
    req: Request<{ clubId: string }, any, any, { teamId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const trainings = await trainingService.getByTeam(req.query.teamId);
    res.json({ data: trainings });
  }

  async get(
    req: Request<{ trainingId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const training = await trainingService.getById(req.params.trainingId);
    res.json({ data: training });
  }

  async update(
    req: Request<{ trainingId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TrainingValidation.updateBody(req.body);
    const training = await trainingService.update(req.params.trainingId, body);
    res.json({ data: training });
  }

  async remove(
    req: Request<{ trainingId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await trainingService.delete(req.params.trainingId);
    res.json({ data: null });
  }

  async markAttendance(
    req: Request<{ trainingId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = TrainingValidation.markAttendanceBody(req.body);
    await trainingService.markAttendance(req.params.trainingId, body);
    res.json({ data: null });
  }
}

export default new TrainingController();
