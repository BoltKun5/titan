import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { clubService } from '../../../services/titan';
import ClubValidation from '../../validations/titan/club.validation';

class ClubController implements Controller {
  private static readonly logger = new LoggerModel(ClubController.name);

  async create(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.createClubBody(req.body);
    const club = await clubService.createClub(body, res.locals.currentUser.id);
    res.json({ data: club });
  }

  async get(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const club = await clubService.getClub(req.params.clubId);
    res.json({ data: club });
  }

  async update(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.updateClubBody(req.body);
    const club = await clubService.updateClub(req.params.clubId, body);
    res.json({ data: club });
  }

  async getUserClubs(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const clubs = await clubService.getUserClubs(res.locals.currentUser.id);
    res.json({ data: clubs });
  }

  async getSportConfig(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const club = await clubService.getClub(req.params.clubId);
    const config = await clubService.getSportConfig(club.sport);
    res.json({ data: config });
  }

  // --- Seasons ---

  async createSeason(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.createSeasonBody(req.body);
    const season = await clubService.createSeason(req.params.clubId, body);
    res.json({ data: season });
  }

  async getSeasons(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const seasons = await clubService.getSeasons(req.params.clubId);
    res.json({ data: seasons });
  }

  async updateSeason(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.updateSeasonBody(req.body);
    const season = await clubService.updateSeason(
      req.params.seasonId,
      req.params.clubId,
      body,
    );
    res.json({ data: season });
  }

  async deleteSeason(
    req: Request<{ clubId: string; seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await clubService.deleteSeason(req.params.seasonId, req.params.clubId);
    res.json({ data: null });
  }

  // --- Venues ---

  async createVenue(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.createVenueBody(req.body);
    const venue = await clubService.createVenue(req.params.clubId, body);
    res.json({ data: venue });
  }

  async getVenues(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const venues = await clubService.getVenues(req.params.clubId);
    res.json({ data: venues });
  }

  async updateVenue(
    req: Request<{ clubId: string; venueId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ClubValidation.updateVenueBody(req.body);
    const venue = await clubService.updateVenue(
      req.params.venueId,
      req.params.clubId,
      body,
    );
    res.json({ data: venue });
  }

  async deleteVenue(
    req: Request<{ clubId: string; venueId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await clubService.deleteVenue(req.params.venueId, req.params.clubId);
    res.json({ data: null });
  }
}

export default new ClubController();
