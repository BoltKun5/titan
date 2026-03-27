import { Service } from '../../core';
import { Training, TrainingAttendance, Team, Venue } from '../../database';
import {
  ICreateTrainingBody,
  IUpdateTrainingBody,
  IMarkAttendanceBody,
} from 'titan_core';
import createError from 'http-errors';

class TrainingService extends Service {
  async create(body: ICreateTrainingBody): Promise<Training> {
    return Training.create({
      teamId: body.teamId,
      venueId: body.venueId ?? null,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      recurrence: body.recurrence,
      notes: body.notes ?? null,
    });
  }

  async getByTeam(teamId: string): Promise<Training[]> {
    return Training.findAll({ where: { teamId }, order: [['date', 'ASC']] });
  }

  async getByClub(clubId: string): Promise<Training[]> {
    const teams = await Team.findAll({ where: { clubId }, attributes: ['id'] });
    const teamIds = teams.map((t) => t.id);
    if (teamIds.length === 0) return [];

    return Training.findAll({
      where: { teamId: teamIds },
      include: [
        { model: Team, attributes: ['id', 'name'] },
        { model: Venue, attributes: ['id', 'name'] },
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
