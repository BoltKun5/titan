import { Service } from '../../core';
import {
  ClubMember,
  License,
  MedicalCertificate,
  Training,
  TrainingAttendance,
  Payment,
  User,
  TitanClubAccount,
  TitanPlayerProfile,
  FederationTeam,
  FederationTeamMember,
  FederationMatch,
  FederationPlayer,
  FederationPlayerSeasonStats,
} from '../../database';
import {
  FederationMatchStatus,
  ClubMemberStatus,
  LicenseStatus,
  PaymentStatus,
} from 'titan_core';
import { Op } from 'sequelize';

class DashboardService extends Service {
  // ---- Shared helpers ----

  private async getUpcomingMatchesForTeams(teamIds: string[], limit = 5) {
    if (teamIds.length === 0) return [];
    const matches = await FederationMatch.findAll({
      where: {
        [Op.or]: [
          { homeTeamId: { [Op.in]: teamIds } },
          { awayTeamId: { [Op.in]: teamIds } },
        ],
        status: FederationMatchStatus.SCHEDULED,
        dateUtc: { [Op.gte]: new Date() },
      },
      include: [
        { model: FederationTeam, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: FederationTeam, as: 'awayTeam', attributes: ['id', 'name'] },
      ],
      order: [['dateUtc', 'ASC']],
      limit,
    });
    return matches.map((m: any) => ({
      id: m.id,
      dateUtc: m.dateUtc,
      homeTeam: m.homeTeam?.name ?? '',
      awayTeam: m.awayTeam?.name ?? '',
      status: m.status,
    }));
  }

  private async getRecentResultsForTeams(teamIds: string[], limit = 5) {
    if (teamIds.length === 0) return [];
    const matches = await FederationMatch.findAll({
      where: {
        [Op.or]: [
          { homeTeamId: { [Op.in]: teamIds } },
          { awayTeamId: { [Op.in]: teamIds } },
        ],
        status: FederationMatchStatus.FINISHED,
      },
      include: [
        { model: FederationTeam, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: FederationTeam, as: 'awayTeam', attributes: ['id', 'name'] },
      ],
      order: [['dateUtc', 'DESC']],
      limit,
    });
    return matches.map((m: any) => ({
      id: m.id,
      dateUtc: m.dateUtc,
      homeTeam: m.homeTeam?.name ?? '',
      awayTeam: m.awayTeam?.name ?? '',
      scoreHome: m.scoreHome,
      scoreAway: m.scoreAway,
    }));
  }

  private async getUpcomingTrainingsForTeams(teamIds: string[], limit = 5) {
    if (teamIds.length === 0) return [];
    const today = new Date().toISOString().split('T')[0];
    const trainings = await Training.findAll({
      where: {
        federationTeamId: { [Op.in]: teamIds },
        date: { [Op.gte]: today },
        isCancelled: false,
      },
      include: [{ model: FederationTeam, attributes: ['id', 'name'] }],
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC'],
      ],
      limit,
    });
    return trainings.map((t: any) => ({
      id: t.id,
      date: t.date,
      startTime: t.startTime,
      endTime: t.endTime,
      teamName: t.team?.name ?? '',
    }));
  }

  private async getFederationTeamIdsForClubAccount(
    clubAccountId: string,
    seasonId?: string,
  ): Promise<string[]> {
    const account = await TitanClubAccount.findByPk(clubAccountId);
    if (!account) return [];
    const where: any = { clubId: account.federationClubId };
    if (seasonId) where.seasonId = seasonId;
    const teams = await FederationTeam.findAll({ where, attributes: ['id'] });
    return teams.map((t) => t.id);
  }

  // ---- Dirigeant (Manager/Admin) Dashboard ----

  async getDirigeantDashboard(clubAccountId: string, seasonId: string) {
    // Members
    const members = await ClubMember.findAll({
      where: { clubAccountId, seasonId, status: ClubMemberStatus.ACTIVE },
    });
    const memberIds = members.map((m) => m.id);

    // Licenses
    const licenses = await License.findAll({
      where: { clubMemberId: { [Op.in]: memberIds } },
    });
    const activeLicenses = licenses.filter(
      (l) => l.status === LicenseStatus.VALID,
    ).length;
    const expiredLicenses = licenses.filter(
      (l) => l.status === LicenseStatus.EXPIRED,
    ).length;

    // Payments / cotisations
    const payments = await Payment.findAll({
      where: { clubMemberId: { [Op.in]: memberIds } },
    });
    const cotisationsPaid = payments.filter(
      (p) => p.status === PaymentStatus.PAID,
    ).length;
    const cotisationsUnpaid = payments.filter(
      (p) =>
        p.status === PaymentStatus.UNPAID || p.status === PaymentStatus.OVERDUE,
    ).length;
    const totalCot = cotisationsPaid + cotisationsUnpaid;
    const subscriptionRate =
      totalCot > 0 ? Math.round((cotisationsPaid / totalCot) * 100) : 100;

    // Teams for this season
    const teamIds = await this.getFederationTeamIdsForClubAccount(
      clubAccountId,
      seasonId,
    );

    const upcomingMatches = await this.getUpcomingMatchesForTeams(teamIds);
    const recentResults = await this.getRecentResultsForTeams(teamIds);

    // Alerts
    const alerts: any[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Expired medical certs
    const expiredCerts = await MedicalCertificate.findAll({
      where: {
        clubMemberId: { [Op.in]: memberIds },
        expirationDate: { [Op.lt]: today },
      },
      include: [
        {
          model: ClubMember,
          include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        },
      ],
    });
    for (const cert of expiredCerts as any[]) {
      const user = cert.clubMember?.user;
      alerts.push({
        type: 'missing_certificate',
        message: 'Certificat médical expiré',
        memberId: cert.clubMemberId,
        memberName: user ? `${user.firstName} ${user.lastName}` : '',
      });
    }

    // Expired licenses
    const expiredLics = await License.findAll({
      where: {
        clubMemberId: { [Op.in]: memberIds },
        status: LicenseStatus.EXPIRED,
      },
      include: [
        {
          model: ClubMember,
          include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        },
      ],
    });
    for (const lic of expiredLics as any[]) {
      const user = lic.clubMember?.user;
      alerts.push({
        type: 'expired_license',
        message: 'Licence expirée',
        memberId: lic.clubMemberId,
        memberName: user ? `${user.firstName} ${user.lastName}` : '',
      });
    }

    // Unpaid fees
    const overduePayments = await Payment.findAll({
      where: {
        clubMemberId: { [Op.in]: memberIds },
        status: { [Op.in]: [PaymentStatus.UNPAID, PaymentStatus.OVERDUE] },
      },
      include: [
        {
          model: ClubMember,
          include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        },
      ],
    });
    for (const pay of overduePayments as any[]) {
      const user = pay.clubMember?.user;
      alerts.push({
        type: 'unpaid_fee',
        message: 'Cotisation impayée',
        memberId: pay.clubMemberId,
        memberName: user ? `${user.firstName} ${user.lastName}` : '',
      });
    }

    return {
      totalMembers: members.length,
      activeLicenses,
      expiredLicenses,
      cotisationsPaid,
      cotisationsUnpaid,
      subscriptionRate,
      upcomingMatches,
      recentResults,
      alerts,
    };
  }

  // ---- Entraîneur (Coach) Dashboard ----

  async getEntraineurDashboard(
    clubAccountId: string,
    userId: string,
    seasonId: string,
  ) {
    // Find teams where user is coach (via titan_team_settings)
    // Note: simpler version — return all teams for this club_account for now
    // (per-coach filtering can be added when titan_team_settings.coachUserId is populated)
    const teamIds = await this.getFederationTeamIdsForClubAccount(
      clubAccountId,
      seasonId,
    );

    const teams = await FederationTeam.findAll({
      where: { id: { [Op.in]: teamIds } },
      attributes: ['id', 'name'],
    });
    const teamsSummary = teams.map((t: any) => ({
      id: t.id,
      name: t.name,
      playerCount: 0, // computed below if needed
    }));

    // Compute player counts via federation_team_member
    if (teamIds.length > 0) {
      const memberCounts = await FederationTeamMember.findAll({
        where: { teamId: { [Op.in]: teamIds } },
        attributes: ['teamId'],
      });
      const countsMap: Record<string, number> = {};
      for (const m of memberCounts) {
        countsMap[m.teamId] = (countsMap[m.teamId] ?? 0) + 1;
      }
      for (const t of teamsSummary) {
        t.playerCount = countsMap[t.id] ?? 0;
      }
    }

    const upcomingMatches = await this.getUpcomingMatchesForTeams(teamIds, 10);
    const upcomingTrainings = await this.getUpcomingTrainingsForTeams(teamIds, 10);
    const recentResults = await this.getRecentResultsForTeams(teamIds, 5);

    // Training attendance rate for coach's teams
    let trainingAttendanceRate = 0;
    if (teamIds.length > 0) {
      const trainings = await Training.findAll({
        where: { federationTeamId: { [Op.in]: teamIds } },
        attributes: ['id'],
      });
      const trainingIds = trainings.map((t) => t.id);
      if (trainingIds.length > 0) {
        const totalAttendance = await TrainingAttendance.count({
          where: { trainingId: { [Op.in]: trainingIds } },
        });
        const presentCount = await TrainingAttendance.count({
          where: { trainingId: { [Op.in]: trainingIds }, isPresent: true },
        });
        trainingAttendanceRate =
          totalAttendance > 0
            ? Math.round((presentCount / totalAttendance) * 100)
            : 0;
      }
    }

    // Top scorer among club federation players for this season
    let topScorer: { playerName: string; goals: number } | null = null;
    if (teamIds.length > 0) {
      const topStats = await FederationPlayerSeasonStats.findAll({
        where: { seasonId },
        include: [
          { model: FederationPlayer, attributes: ['firstName', 'lastName'] },
        ],
        order: [['goals', 'DESC']],
        limit: 1,
      });
      if (topStats.length > 0) {
        const s = topStats[0] as any;
        topScorer = {
          playerName: `${s.player?.firstName ?? ''} ${s.player?.lastName ?? ''}`.trim(),
          goals: s.goals,
        };
      }
    }

    return {
      teams: teamsSummary,
      upcomingMatches,
      upcomingTrainings,
      recentResults,
      trainingAttendanceRate,
      topScorer,
    };
  }

  // ---- Joueur (Player) Dashboard ----

  async getJoueurDashboard(
    clubAccountId: string,
    userId: string,
    seasonId: string,
  ) {
    // Find user's club member + their federation player via profile link
    const member = await ClubMember.findOne({
      where: { clubAccountId, userId, seasonId },
    });

    // Resolve federation_team ids the user plays in (via federation_team_member)
    let teamIds: string[] = [];
    const profile = await TitanPlayerProfile.findOne({
      where: { clubAccountId, userId },
    });
    if (profile) {
      const memberships = await FederationTeamMember.findAll({
        where: { playerId: profile.federationPlayerId },
        attributes: ['teamId'],
      });
      teamIds = memberships.map((m) => m.teamId);
    }

    const upcomingMatches = await this.getUpcomingMatchesForTeams(teamIds, 10);
    const upcomingTrainings = await this.getUpcomingTrainingsForTeams(teamIds, 10);

    // Personal stats from federation_player_season_stats
    let personalStats = {
      goals: 0,
      assists: 0,
      saves: 0,
      matchesPlayed: 0,
    };
    if (profile) {
      const seasonStats = await FederationPlayerSeasonStats.findOne({
        where: { playerId: profile.federationPlayerId, seasonId },
      });
      if (seasonStats) {
        personalStats = {
          goals: seasonStats.goals,
          assists: seasonStats.assists,
          saves: seasonStats.saves ?? 0,
          matchesPlayed: seasonStats.matchesPlayed,
        };
      }
    }

    // Pending documents
    const pendingDocuments: {
      type: 'medical' | 'license' | 'payment';
      message: string;
    }[] = [];
    if (member) {
      const today = new Date().toISOString().split('T')[0];

      const certs = await MedicalCertificate.findAll({
        where: { clubMemberId: member.id },
        order: [['expirationDate', 'DESC']],
        limit: 1,
      });
      if (certs.length === 0) {
        pendingDocuments.push({
          type: 'medical',
          message: 'Aucun certificat médical fourni',
        });
      } else if (certs[0].expirationDate < today) {
        pendingDocuments.push({
          type: 'medical',
          message: 'Certificat médical expiré',
        });
      }

      const lics = await License.findAll({
        where: { clubMemberId: member.id },
        order: [['expirationDate', 'DESC']],
        limit: 1,
      });
      if (lics.length === 0) {
        pendingDocuments.push({
          type: 'license',
          message: 'Aucune licence enregistrée',
        });
      } else if (lics[0].status === LicenseStatus.EXPIRED) {
        pendingDocuments.push({ type: 'license', message: 'Licence expirée' });
      }

      const unpaidPayments = await Payment.findAll({
        where: {
          clubMemberId: member.id,
          status: { [Op.in]: [PaymentStatus.UNPAID, PaymentStatus.OVERDUE] },
        },
      });
      if (unpaidPayments.length > 0) {
        pendingDocuments.push({
          type: 'payment',
          message: `${unpaidPayments.length} cotisation(s) impayée(s)`,
        });
      }
    }

    return {
      upcomingMatches,
      upcomingTrainings,
      personalStats,
      pendingDocuments,
    };
  }
}

export default new DashboardService();
