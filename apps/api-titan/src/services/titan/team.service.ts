import { Service } from '../../core';
import { Team, TeamPlayer, ClubMember } from '../../database';
import { User } from '../../database';
import {
  ICreateTeamBody,
  IUpdateTeamBody,
  IAddTeamPlayerBody,
} from 'titan_core';
import createError from 'http-errors';

class TeamService extends Service {
  async createTeam(clubId: string, body: ICreateTeamBody): Promise<Team> {
    return Team.create({
      clubId,
      seasonId: body.seasonId,
      name: body.name,
      category: body.category ?? null,
      division: body.division ?? null,
      pool: body.pool ?? null,
      genderSection: body.genderSection,
      federationTeamId: body.federationTeamId ?? null,
      coachId: body.coachId ?? null,
      assistantCoachId: body.assistantCoachId ?? null,
    });
  }

  async getTeams(clubId: string, seasonId?: string): Promise<Team[]> {
    const where: any = { clubId };
    if (seasonId) where.seasonId = seasonId;

    return Team.findAll({ where, order: [['name', 'ASC']] });
  }

  async getTeam(teamId: string): Promise<Team> {
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: TeamPlayer,
          include: [
            {
              model: ClubMember,
              include: [
                {
                  model: User,
                  attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'shownName',
                    'avatarUrl',
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!team) throw createError(404, 'Team not found');
    return team;
  }

  async updateTeam(teamId: string, body: IUpdateTeamBody): Promise<Team> {
    const team = await Team.findByPk(teamId);
    if (!team) throw createError(404, 'Team not found');
    await team.update(body);
    return team;
  }

  async deleteTeam(teamId: string): Promise<void> {
    const team = await Team.findByPk(teamId);
    if (!team) throw createError(404, 'Team not found');
    await team.destroy();
  }

  // --- Team Players ---

  async addPlayer(
    teamId: string,
    body: IAddTeamPlayerBody,
  ): Promise<TeamPlayer> {
    const existing = await TeamPlayer.findOne({
      where: { teamId, clubMemberId: body.clubMemberId },
    });
    if (existing) throw createError(409, 'Player already in this team');

    return TeamPlayer.create({
      teamId,
      clubMemberId: body.clubMemberId,
      position: body.position ?? null,
      jerseyNumber: body.jerseyNumber ?? null,
      isCaptain: body.isCaptain ?? false,
    });
  }

  async removePlayer(teamId: string, clubMemberId: string): Promise<void> {
    const entry = await TeamPlayer.findOne({ where: { teamId, clubMemberId } });
    if (!entry) throw createError(404, 'Player not found in team');
    await entry.destroy();
  }
}

export default new TeamService();
