import { Service } from '../../core';
import {
  Club,
  Season,
  Venue,
  StaffRole,
  ClubMember,
  License,
  MedicalCertificate,
  SportConfig,
} from '../../database';
import { User } from '../../database';
import {
  ICreateClubBody,
  IUpdateClubBody,
  ICreateSeasonBody,
  IUpdateSeasonBody,
  ICreateVenueBody,
  IUpdateVenueBody,
  SportType,
} from 'titan_core';
import createError from 'http-errors';

class ClubService extends Service {
  async createClub(body: ICreateClubBody, userId: string): Promise<Club> {
    const club = await Club.create({
      name: body.name,
      sport: body.sport,
      logo: body.logo ?? null,
      colors: body.colors ?? null,
      address: body.address ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      federationId: body.federationId ?? null,
    });

    await StaffRole.create({
      clubId: club.id,
      userId,
      role: 'admin',
    });

    this.logger.log(
      `Club "${club.name}" created (${club.id}) by user ${userId}`,
    );
    return club;
  }

  async getClub(clubId: string): Promise<Club> {
    const club = await Club.findByPk(clubId, {
      include: [{ model: Season }, { model: Venue }],
    });
    if (!club) throw createError(404, 'Club not found');
    return club;
  }

  async updateClub(clubId: string, body: IUpdateClubBody): Promise<Club> {
    const club = await Club.findByPk(clubId);
    if (!club) throw createError(404, 'Club not found');
    await club.update(body);
    return club;
  }

  async getUserClubs(userId: string): Promise<Club[]> {
    const memberEntries = await ClubMember.findAll({ where: { userId } });
    const staffEntries = await StaffRole.findAll({ where: { userId } });

    const clubIds = [
      ...new Set([
        ...memberEntries.map((m) => m.clubId),
        ...staffEntries.map((s) => s.clubId),
      ]),
    ];

    if (clubIds.length === 0) return [];
    return Club.findAll({ where: { id: clubIds } });
  }

  // --- Seasons ---

  async createSeason(clubId: string, body: ICreateSeasonBody): Promise<Season> {
    if (body.isCurrent) {
      await Season.update({ isCurrent: false }, { where: { clubId } });
    }
    return Season.create({
      clubId,
      label: body.label,
      startDate: body.startDate,
      endDate: body.endDate,
      isCurrent: body.isCurrent ?? false,
    });
  }

  async getSeasons(clubId: string): Promise<Season[]> {
    return Season.findAll({
      where: { clubId },
      order: [['startDate', 'DESC']],
    });
  }

  async updateSeason(
    seasonId: string,
    clubId: string,
    body: IUpdateSeasonBody,
  ): Promise<Season> {
    const season = await Season.findOne({ where: { id: seasonId, clubId } });
    if (!season) throw createError(404, 'Season not found');

    if (body.isCurrent) {
      await Season.update({ isCurrent: false }, { where: { clubId } });
    }
    await season.update(body);
    return season;
  }

  async deleteSeason(seasonId: string, clubId: string): Promise<void> {
    const season = await Season.findOne({ where: { id: seasonId, clubId } });
    if (!season) throw createError(404, 'Season not found');
    await season.destroy();
  }

  // --- Venues ---

  async createVenue(clubId: string, body: ICreateVenueBody): Promise<Venue> {
    return Venue.create({
      clubId,
      name: body.name,
      address: body.address ?? null,
      capacity: body.capacity ?? null,
    });
  }

  async getVenues(clubId: string): Promise<Venue[]> {
    return Venue.findAll({ where: { clubId }, order: [['name', 'ASC']] });
  }

  async updateVenue(
    venueId: string,
    clubId: string,
    body: IUpdateVenueBody,
  ): Promise<Venue> {
    const venue = await Venue.findOne({ where: { id: venueId, clubId } });
    if (!venue) throw createError(404, 'Venue not found');
    await venue.update(body);
    return venue;
  }

  async deleteVenue(venueId: string, clubId: string): Promise<void> {
    const venue = await Venue.findOne({ where: { id: venueId, clubId } });
    if (!venue) throw createError(404, 'Venue not found');
    await venue.destroy();
  }

  // --- Sport Config ---

  async getSportConfig(sport: SportType): Promise<SportConfig | null> {
    return SportConfig.findOne({ where: { sport } });
  }
}

export default new ClubService();
