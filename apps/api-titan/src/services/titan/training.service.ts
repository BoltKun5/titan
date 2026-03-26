import { Service } from '../../core';
import { Training, TrainingAttendance } from '../../database';
import {
 
 
 ,

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

  async getById(trainingId: string): Promise<Training> {
    const training = await Training.findByPk(trainingId, {
      include: [{ model: TrainingAttendance }],
    });
    if (!traini
    ng) throw createErr
  o r(404, 'Training not foun,
  d');
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

    
   ,
  
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
