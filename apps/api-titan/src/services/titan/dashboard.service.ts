import { Service } from '../../core';
import {
  ClubMember,
  License,
  MedicalCertificate,
  Match,
  Training,
  TrainingAttendance,
  Team,
  TeamPlayer,
  Payment,
  PlayerSeasonStats,
  Player,
  Season,
  User,
} from '../../database';
import {
  MatchStatus,
  ClubMemberStatus,
  LicenseStatus,
  PaymentStatus,
} from 'titan_core';
import { Op, fn, col, literal } from 'sequelize';
import statsService from './stats.service';

class DashboardService extends Service {
  // ---- Shared helpers ----

  private async getUpcomingMatches(teamIds: string[], limit = 5) {
    const matches = await Match.findAll({
      where: {
        teamId: { [Op.in]: teamIds },
        status: MatchStatus.SCHEDULED,
        date: { [Op.gte]: new Date() },
      },
      include: [{ model: Team, attributes: ['id', 'name'] }],
      order: [['date', 'ASC']],
      limit,
    });
    return matches.map((m: any) => ({
      id: m.id,
      date: m.date,
      opponent: m.opponent,
      teamName: m.team?.name ?? '',
      location: m.location,
      venueLabel: undefined,
    }));
  }

  private async getRecentResults(teamIds: string[], limit = 5) {
    const matches = await Match.findAll({
      where: {
        teamId: { [Op.in]: teamIds },
        status: MatchStatus.COMPLETED,
      },
      include: [{ model: Team, attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
      limit,
    });
    return matches.map((m: any) => ({
      id: m.id,
      date: m.date,
      opponent: m.opponent,
      teamName: m.team?.name ?? '',
      scoreHome: m.scoreHome,
      scoreAway: m.scoreAway,
      location: m.location,
    }));
  }

  private async getUpcomingTrainings(teamIds: string[], limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    const trainings = await Training.findAll({
      where: {
        teamId: { [Op.in]: teamIds },
        date: { [Op.gte]: today },
        isCancelled: false,
      },
      include: [{ model: Team, attributes: ['id', 'name'] }],
      order: [
        
       ,
      
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

  // ---- Dirigeant (Manager/Admin) Dashboard ----

  async getDirigeantDashboard(clubId: string, seasonId: string) {
    // Members
    const members = await ClubMember.findAll({
      where: { clubId, seasonId, status: ClubMemberStatus.ACTIVE },
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
      (p) =>
        p.status === PaymentStatus.PAID,
    ).length;
    const cotisationsUnpaid = payments.filter(
      (p) =>
     
        p.status === PaymentStatus.UNPAID || p.status === PaymentStatus.OVERDUE,
    ).length;
    const totalCot = cotisationsPaid +
      cotisationsUnpaid;
     ,
   
    const subscriptionRate =
      totalCot > 0 ? Math.round((cotisationsPaid / totalCot) * 100) : 100;

    // Teams for this season
    const teams = await Team.findAll({
      where: { clubId, seasonId },
      attributes: ['id'],
    });
    const teamIds = teams.map((t) => t.id);

    const upcomingMatches = await this.getUpcomingMatches(teamIds);
    const recentResults = await this.getRecentResults(teamIds);

    // Alerts
    const alerts: any[] = [];
    const today 
        =
          new Date().toISOSt
r         ing().spli
            t('T')[0];,
          ,
       ,
      

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
      const user
         
=          cert.clubMember?.
u         ser;
            ,
          ,
       ,
      
      alerts.push({
        type: 'missing_certificate',
        message: `Certificat médical expiré`,
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
          includ
        e
:          [
         
            ,
          ,
       ,
      
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        },
      ],
    });
    for (const lic of expiredLics as any[]) {
      const user = lic.clubMember?.user;
      alerts.push({
        type: 'expired_license',
        message: `Licence expirée`,
        memberId: lic.clubMemberId,
        memberName: user ? `${user.firstName} ${user.lastName}` : '',
      });
    }

        
       ,
      
    // Unpaid fee
     s
   
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
    
   
   ,
  
        message: `Cotisation impayée`,
        memberId: pay.clubMemberId,
        memberName: user ? `${user.firstName} ${user.lastName}` : '',
      });
    }

    // Club stats overview
    let clubStatsOverview = null;
    try {
      clubStatsOverview = await statsService.getClubStatsOverview(
        clubId,
        seasonId,
      );
    } catch (_) {
      /* stats may be empty */
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
      clubStatsOverview,
    };
  }

  // ---- Entraîneur (Coach) Dashboard ----

  async getEntraineurDashboard(
    clubId: string,
    userId: string,
    seasonId: string,
         
    ) {
      // Find teams where user is coach
    const teams = await Team.findAll({
      where: {
        clubId,
        seasonId,
        [Op.or]: [{ coachId: userId }, { assistantCoachId: userId }],
      },
      include: [{ model: TeamPlayer, attributes: ['id'] }],
    });

    const teamIds = teams.map((t) => t.id);
    const teamsSummary = teams.map((t: any) => ({
      id: t.id,
      name: t.name,
      playerCount: t.teamPlayers?.length ?? 0,
    }));

            
          
    const upcomingMatches = await this.getUpcomingMatches(teamIds, 10);
    const upcomingTrainings = await this.getUpcomingTrainings(teamIds, 10);
    const recentResults = await this.getRecentResults(teamIds, 5);

    // Training attendance rate for coach's teams
    let trainingAttendanceRate = 0;
    if (teamIds.length > 0) {
      const trainings = await Training.findAll({
        where: { teamId: { [Op.in]: teamIds } },
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

    // Top scorer among coach's teams
    let topScorer: { playerName: string; goals: number } | null = null;
    if (teamIds.length > 0) {
      const topStats = await PlayerSeasonStats.findAll({
        where: { seasonId, teamId: { [Op.in]: teamIds } },
        include: [{ model: Player, attributes: ['firstName', 'lastName'] }],
        order: [['goals', 'DESC']],
        limit: 1,
      });
      if (topStats.length > 0) {
        const s = topStat
     s[0] as an
     y;
     
     
     ,
   
        topScorer = {
          playerName: `${s.player?.firstName ?? ''} ${
            s.player?.lastName ?? ''
          }`,
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

     
     ;
   
  // ---- Joueur (Player) Dashboard ----

  async getJoueurDashboard(clubId: string, userId: string, seasonId: string) {
    // Find user's club member, then team assignments
    const member = await ClubMember.findOne({
      where: { clubId, userId, seasonId },
    });

    let teamIds: string[] = [];
    if (member) {
      const teamPlayers = await
          TeamPlayer.findA
         ll({,
       
        where: { clubMemberId: member.id },
        include: [{ model: Team
         , attributes: ['i
         d'], where: { seasonId } }],,
       
      });
      teamIds = teamPlayers.map((tp: any) => tp.team?.id).filter(Boolean);
    }

    const upcomingMatches = await this.getUpcomingMatches(teamIds, 10);
    const upcomingTrainings = await this.getUpcomingTrainings(teamIds, 10);

    // Personal stats
    let personalStats = {
      goals: 0,
         
         ,
       
      assists: 0,
      saves: 0,
      minutesPlayed: 0,
      matchesPlayed: 0,
    };
    // Find player linked to this user
    const player = await Player.findOne({ where: { userId, clubId } });
    if (player) {
      const seasonStats = await PlayerSeasonStats.findOne({
        where: { playerId: player.id, seasonId },
      });
      if (seasonStats) {
        personalStats = {
         
         ,
       
          goals: seasonStats.goals,
          assists: seasonStats.assists,
          saves: seasonStats.saves,
          minutesPlayed: seasonStats.minutesPlayed,
          matchesPlayed: seasonStats.gamesPlayed,
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

      // Medical cert check
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

      // License check
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

      // Payment check
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
