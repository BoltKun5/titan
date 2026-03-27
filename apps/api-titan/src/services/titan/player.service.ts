import { Service } from '../../core';
import { Player, PlayerMatchStats, PlayerSeasonStats } from '../../database';
import { User } from '../../database';
import { ICreatePlayerBody, IUpdatePlayerBody } from 'titan_core';
import createError from 'http-errors';

class PlayerService extends Service {
  async create(clubId: string, body: ICreatePlayerBody): Promise<Player> {
    const player = await Player.create({
      clubId,
      firstName: body.firstName,
      lastName: body.lastName,
      photo: body.photo ?? null,
      birthDate: body.birthDate ?? null,
      nationality: body.nationality ?? null,
      licenseNumber: body.licenseNumber ?? null,
      federationPlayerId: body.federationPlayerId ?? null,
      position: body.position ?? null,
      jerseyNumber: body.jerseyNumber ?? null,
    });

    this.logger.log(
      `Player "${player.firstName} ${player.lastName}" created (${player.id})`,
    );
    return player;
  }

  async getByClub(clubId: string, active?: boolean): Promise<Player[]> {
    const where: any = { clubId };
    if (active !== undefined) where.isActive = active;
    return Player.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'shownName'] }],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  async getById(playerId: string): Promise<Player> {
    const player = await Player.findByPk(playerId, {
      include: [
        { model: User, attributes: ['id', 'shownName'] },
        { model: PlayerSeasonStats },
      ],
    });
    if (!player) throw createError(404, 'Player not found');
    return player;
  }

  async findByLicense(
    clubId: string,
    licenseNumber: string,
  ): Promise<Player | null> {
    return Player.findOne({ where: { clubId, licenseNumber } });
  }

  async findByFederationId(
    clubId: string,
    federationPlayerId: string,
  ): Promise<Player | null> {
    return Player.findOne({ where: { clubId, federationPlayerId } });
  }

  async update(playerId: string, body: IUpdatePlayerBody): Promise<Player> {
    const player = await Player.findByPk(playerId);
    if (!player) throw createError(404, 'Player not found');
    await player.update(body);
    return player;
  }

  async delete(playerId: string): Promise<void> {
    const player = await Player.findByPk(playerId);
    if (!player) throw createError(404, 'Player not found');
    await player.destroy();
  }

  async linkUser(playerId: string, userId: string): Promise<Player> {
    const player = await Player.findByPk(playerId);
    if (!player) throw createError(404, 'Player not found');
    await player.update({ userId });
    this.logger.log(`Player ${playerId} linked to user ${userId}`);
    return player;
  }

  async unlinkUser(playerId: string): Promise<Player> {
    const player = await Player.findByPk(playerId);
    if (!player) throw createError(404, 'Player not found');
    await player.update({ userId: null });
    return player;
  }
}

export default new PlayerService();
