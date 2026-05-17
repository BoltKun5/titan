import { Service } from '../../core';
import {
  Training, TrainingAttendance,
  FederationTeam, FederationVenue, TitanClubAccount,
} from '../../database';
import {
  ICreateTrainingBody,
  IUpdateTrainingBody,
  IMarkAttendanceBody,
} from 'titan_core';
import createError from 'http-errors';

class TrainingService extends Service {
  async create(body: ICreateTrainingBody): Promise<Training> {
    return Training.create({
      federationTeamId: body.federationTeamId,
      venueId: body.venueId ?? null,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      recurrence: body.recurrence,
      notes: body.notes ?? null,
    });
  }

  async getByTeam(federationTeamId: string): Promise<Training[]> {
    return Training.findAll({
      where: { federationTeamId },
      order: [['date', 'ASC']],
    });
  }

  async getByClub(clubAccountId: string): Promise<Training[]> {
    const clubAccount = await TitanClubAccount.findByPk(clubAccountId);
    if (!clubAccount) return [];

    const teams = await FederationTeam.findAll({
      where: { clubId: clubAccount.federationClubId },
      attributes: ['id'],
    });
    const teamIds = teams.map((t) => t.id);
    if (teamIds.length === 0) return [];

    return Training.findAll({
      where: { federationTeamId: teamIds },
      include: [
        { model: FederationTeam, attributes: ['id', 'name'] },
        { model: FederationVenue, attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });
  }

  async getById(trainingId: string): Promise<Training> {
    const training = await Training.findByPk(trainingId, {
      include: [{ model: TrainingAttendance }],
    });
    if (!training) throw createError(404, 'Training not found');
    return training;
  }

  async update(
    trainingId: string,
    body: IUpdateTrainingBody,
  ): Promise<Training> {
    const training = await Training.findByPk(trainingId);
    if (!training) throw createError(404, 'Training not found');
    await training.update(body);
    return training;
  }

  async delete(trainingId: string): Promise<void> {
    const training = await Training.findByPk(trainingId);
    if (!training) throw createError(404, 'Training not found');
    await training.destroy();
  }

  async markAttendance(
    trainingId: string,
    body: IMarkAttendanceBody,
  ): Promise<TrainingAttendance[]> {
    await TrainingAttendance.destroy({ where: { trainingId } });

    const entries = body.attendees.map((a) => ({
      trainingId,
      clubMemberId: a.clubMemberId,
      isPresent: a.isPresent,
    }));

    return TrainingAttendance.bulkCreate(entries);
  }
}

export default new TrainingService();
