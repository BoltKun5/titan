import { Service } from '../../core';
import {
  Player,
  PlayerMatchStats,
  PlayerSeasonStats,
  TeamSeasonStats,
  Match,
  Team,
  Season,
} from '../../database';
import {
  IRecordPlayerMatchStatsBody,
  IUpdatePlayerMatchStatsBody,
} from 'titan_core';
import createError from 'http-errors';
import { fn, col, literal } from 'sequelize';

class StatsService extends Service {
  // --- Player Match Stats ---

  async recordMatchStats(
    body: IRecordPlayerMatchStatsBody,
  ): Promise<PlayerMatchStats> {
    const existing = await PlayerMatchStats.findOne({
      where: { playerId: body.playerId, matchId: body.matchId },
    });

    if (existing) {
      await existing.update(body);
      return existing;
    }

    return PlayerMatchStats.create({
      playerId: body.playerId,
      matchId: body.matchId,
      isStarter: body.isStarter ?? false,
      minutesPlayed: body.minutesPlayed ?? null,
      goals: body.goals ?? 0,
      goalDetails: body.goalDetails ?? null,
      assists: body.assists ?? 0,
      saves: body.saves ?? 0,
      saveDetails: body.saveDetails ?? null,
      sanctions: body.sanctions ?? null,
      shotsAttempted: body.shotsAttempted ?? null,
      penaltiesAttempted: body.penaltiesAttempted ?? null,
      penaltiesScored: body.penaltiesScored ?? null,
      rating: body.rating ?? null,
      customStats: body.customStats ?? null,
    });
  }

  async updateMatchStats(
    statsId: string,
    body: IUpdatePlayerMatchStatsBody,
  ): Promise<PlayerMatchStats> {
    const stats = await PlayerMatchStats.findByPk(statsId);
    if (!stats) throw createError(404, 'Match stats not found');
    await stats.update(body);
    return stats;
  }

  async getMatchStatsByPlayer(
    playerId: string,
    seasonId?: string,
  ): Promise<PlayerMatchStats[]> {
    const where: any = { playerId };
    const include: any[] = [
      {
        model: Match,
        attributes: [
          'id',
          'opponent',
          'date',
          'status',
          'scoreHome',
          'scoreAway',
        ],
        ...(seasonId ? { where: { seasonId } } : {}),
      },
    ];

    return PlayerMatchStats.findAll({
      where,
      include,
      order: [[Match, 'date', 'DESC']],
    });
  }

  async getMatchStatsByMatch(matchId: string): Promise<PlayerMatchStats[]> {
    return PlayerMatchStats.findAll({
      where: { matchId },
      include: [
        {
          model: Player,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'position',
            'jerseyNumber',
          ],
        },
      ],
      order: [['goals', 'DESC']],
    });
  }

  async deleteMatchStats(statsId: string): Promise<void> {
    const stats = await PlayerMatchStats.findByPk(statsId);
    if (!stats) throw createError(404, 'Match stats not found');
    await stats.destroy();
  }

  // --- Player Season Stats (aggregation) ---

  async recomputePlayerSeasonStats(
    playerId: string,
    seasonId: string,
    teamId?: string,
  ): Promise<PlayerSeasonStats> {
    const matchStats = await PlayerMatchStats.findAll({
      where: { playerId },
      include: [
        {
          model: Match,
          where: { seasonId },
          attributes: ['id'],
        },
      ],
    });

    const agg = {
      gamesPlayed: matchStats.length,
      gamesStarted: matchStats.filter((s) => s.isStarter).length,
      minutesPlayed: matchStats.reduce(
        (sum, s) => sum + (s.minutesPlayed ?? 0),
        0,
      ),
      goals: matchStats.reduce((sum, s) => sum + s.goals, 0),
      assists: matchStats.reduce((sum, s) => sum + s.assists, 0),
      saves: matchStats.reduce((sum, s) => sum + s.saves, 0),
      shotsAttempted: matchStats.reduce(
        (sum, s) => sum + (s.shotsAttempted ?? 0),
        0,
      ),
      penaltiesAttempted: matchStats.reduce(
        (sum, s) => sum + (s.penaltiesAttempted ?? 0),
        0,
      ),
      penaltiesScored: matchStats.reduce(
        (sum, s) => sum + (s.penaltiesScored ?? 0),
        0,
      ),
    };

    // Merge goalDetails from all matches
    const goalDetails: Record<string, number> = {};
    for (const s of matchStats) {
      if (s.goalDetails) {
        for (const [key, val] of Object.entries(s.goalDetails)) {
          goalDetails[key] = (goalDetails[key] ?? 0) + val;
        }
      }
    }

    // Merge saveDetails
    const saveDetails: Record<string, number> = {};
    for (const s of matchStats) {
      if (s.saveDetails) {
        for (const [key, val] of Object.entries(s.saveDetails)) {
          saveDetails[key] = (saveDetails[key] ?? 0) + val;
        }
      }
    }

    // Merge sanctions
    const sanctions: Record<string, number> = {};
    for (const s of matchStats) {
      if (s.sanctions) {
        for (const [key, val] of Object.entries(s.sanctions)) {
          sanctions[key] = (sanctions[key] ?? 0) + val;
        }
      }
    }

    const shootingPercentage =
      agg.shotsAttempted > 0 ? (agg.goals / agg.shotsAttempted) * 100 : null;
    const savePercentage = agg.saves > 0 ? null : null; // Need total shots faced, not available — leave null

    const existing = await PlayerSeasonStats.findOne({
      where: { playerId, seasonId },
    });

    const data = {
      playerId,
      seasonId,
      teamId: teamId ?? null,
      ...agg,
      goalDetails: Object.keys(goalDetails).length > 0 ? goalDetails : null,
      saveDetails: Object.keys(saveDetails).length > 0 ? saveDetails : null,
      sanctions: Object.keys(sanctions).length > 0 ? sanctions : null,
      shootingPercentage,
      savePercentage,
    };

    if (existing) {
      await existing.update(data);
      return existing;
    }

    return PlayerSeasonStats.create(data);
  }

  async getPlayerSeasonStats(playerId: string): Promise<PlayerSeasonStats[]> {
    return PlayerSeasonStats.findAll({
      where: { playerId },
      include: [
        { model: Season, attributes: ['id', 'label'] },
        { model: Team, attributes: ['id', 'name'] },
      ],
      order: [[Season, 'startDate', 'DESC']],
    });
  }

  // --- Team Season Stats ---

  async getTeamSeasonStats(
    teamId: string,
    seasonId: string,
  ): Promise<TeamSeasonStats | null> {
    return TeamSeasonStats.findOne({ where: { teamId, seasonId } });
  }

  async upsertTeamSeasonStats(
    teamId: string,
    seasonId: string,
    data: Partial<TeamSeasonStats>,
  ): Promise<TeamSeasonStats> {
    const existing = await TeamSeasonStats.findOne({
      where: { teamId, seasonId },
    });
    if (existing) {
      await existing.update(data);
      return existing;
    }
    return TeamSeasonStats.create({ teamId, seasonId, ...data } as any);
  }

  // --- Rankings ---

  async getTopScorers(
    clubId: string,
    seasonId: string,
    limit = 10,
  ): Promise<any[]> {
    return PlayerSeasonStats.findAll({
      where: { seasonId },
      include: [
        {
          model: Player,
          where: { clubId },
          attributes: ['id', 'firstName', 'lastName'],
        },
        { model: Team, attributes: ['id', 'name'] },
      ],
      order: [['goals', 'DESC']],
      limit,
    });
  }

  async getTopAssists(
    clubId: string,
    seasonId: string,
    limit = 10,
  ): Promise<any[]> {
    return PlayerSeasonStats.findAll({
      where: { seasonId },
      include: [
        {
          model: Player,
          where: { clubId },
          attributes: ['id', 'firstName', 'lastName'],
        },
        { model: Team, attributes: ['id', 'name'] },
      ],
      order: [['assists', 'DESC']],
      limit,
    });
  }

  async getTopSaves(
    clubId: string,
    seasonId: string,
    limit = 10,
  ): Promise<any[]> {
    return PlayerSeasonStats.findAll({
      where: { seasonId },
      include: [
        {
          model: Player,
          where: { clubId },
          attributes: ['id', 'firstName', 'lastName'],
        },
        { model: Team, attributes: ['id', 'name'] },
      ],
      order: [['saves', 'DESC']],
      limit,
    });
  }

  // --- Club overview ---

  async getClubStatsOverview(clubId: string, seasonId: string): Promise<any> {
    const players = await Player.findAll({ where: { clubId, isActive: true } });
    const teams = await Team.findAll({ where: { clubId, seasonId } });

    const teamStats = await TeamSeasonStats.findAll({
      where: { seasonId },
      include: [{ model: Team, where: { clubId }, attributes: ['id', 'name'] }],
    });

    const topScorers = await this.getTopScorers(clubId, seasonId, 5);
    const topAssists = await this.getTopAssists(clubId, seasonId, 5);

    return {
      totalPlayers: players.length,
      totalTeams: teams.length,
      teamStats: teamStats.map((ts: any) => ({
        teamId: ts.teamId,
        teamName: ts.team?.name,
        gamesPlayed: ts.gamesPlayed,
        wins: ts.wins,
        draws: ts.draws,
        losses: ts.losses,
        goalsFor: ts.goalsFor,
        goalsAgainst: ts.goalsAgainst,
      })),
      topScorers: topScorers.map((s: any) => ({
        playerId: s.playerId,
        playerName: `${s.player?.firstName} ${s.player?.lastName}`,
        teamName: s.team?.name ?? null,
        value: s.goals,
      })),
      topAssists: topAssists.map((s: any) => ({
        playerId: s.playerId,
        playerName: `${s.player?.firstName} ${s.player?.lastName}`,
        teamName: s.team?.name ?? null,
        value: s.assists,
      })),
    };
  }
}

export default new StatsService();
