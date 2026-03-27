import { Service } from '../../core';
import {
  Match,
  MatchLineup,
  MatchEvent,
  ClubMember,
  Team,
} from '../../database';
import { User } from '../../database';
import {
  ICreateMatchBody,
  IUpdateMatchBody,
  ISetMatchLineupBody,
  IAddMatchEventBody,
} from 'titan_core';
import createError from 'http-errors';

class MatchService extends Service {
  async createMatch(body: ICreateMatchBody): Promise<Match> {
    return Match.create({
      teamId: body.teamId,
      seasonId: body.seasonId,
      venueId: body.venueId ?? null,
      opponent: body.opponent,
      date: body.date,
      location: body.location,
      isFriendly: body.isFriendly ?? false,
    });
  }

  async getMatches(teamId: string, seasonId?: string): Promise<Match[]> {
    const where: any = { teamId };
    if (seasonId) where.seasonId = seasonId;

    return Match.findAll({ where, order: [['date', 'ASC']] });
  }

  async getMatchesByClub(clubId: string, seasonId?: string): Promise<Match[]> {
    const teams = await Team.findAll({ where: { clubId }, attributes: ['id'] });
    const teamIds = teams.map((t) => t.id);
    if (teamIds.length === 0) return [];

    const where: any = { teamId: teamIds };
    if (seasonId) where.seasonId = seasonId;

    return Match.findAll({
      where,
      include: [{ model: Team, attributes: ['id', 'name'] }],
      order: [['date', 'ASC']],
    });
  }

  async getMatch(matchId: string): Promise<Match> {
    const match = await Match.findByPk(matchId, {
      include: [
        {
          model: MatchLineup,
          include: [
            {
              model: ClubMember,
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName', 'shownName'],
                },
              ],
            },
          ],
        },
        {
          model: MatchEvent,
          include: [
            {
              model: ClubMember,
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName', 'shownName'],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!match) throw createError(404, 'Match not found');
    return match;
  }

  async updateMatch(matchId: string, body: IUpdateMatchBody): Promise<Match> {
    const match = await Match.findByPk(matchId);
    if (!match) throw createError(404, 'Match not found');
    await match.update(body);
    return match;
  }

  async deleteMatch(matchId: string): Promise<void> {
    const match = await Match.findByPk(matchId);
    if (!match) throw createError(404, 'Match not found');
    await match.destroy();
  }

  // --- Lineup ---

  async setLineup(
    matchId: string,
    body: ISetMatchLineupBody,
  ): Promise<MatchLineup[]> {
    await MatchLineup.destroy({ where: { matchId } });

    const entries = body.lineup.map((p) => ({
      matchId,
      clubMemberId: p.clubMemberId,
      position: p.position ?? null,
      isStarter: p.isStarter,
    }));

    return MatchLineup.bulkCreate(entries);
  }

  // --- Events ---

  async addEvent(
    matchId: string,
    body: IAddMatchEventBody,
  ): Promise<MatchEvent> {
    return MatchEvent.create({
      matchId,
      clubMemberId: body.clubMemberId ?? null,
      eventType: body.eventType,
      subtype: body.subtype ?? null,
      minute: body.minute ?? null,
      period: body.period ?? null,
      details: body.details ?? null,
    });
  }

  async deleteEvent(eventId: string): Promise<void> {
    const event = await MatchEvent.findByPk(eventId);
    if (!event) throw createError(404, 'Event not found');
    await event.destroy();
  }
}

export default new MatchService();
