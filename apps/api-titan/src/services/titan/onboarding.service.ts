import { Op } from 'sequelize';
import createError from 'http-errors';
import { Service } from '../../core';
import {
  FederationClub, Federation, TitanClubAccount,
} from '../../database';
import { FederationCode } from 'titan_core';

class OnboardingService extends Service {
  /**
   * Recherche des federation_club par nom partiel ou code externe.
   * Filtre optionnel par fédération.
   */
  async searchFederationClubs(
    query: string,
    federationCode?: FederationCode,
  ): Promise<FederationClub[]> {
    const federationWhere = federationCode ? { code: federationCode } : {};

    return FederationClub.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { shortName: { [Op.iLike]: `%${query}%` } },
          { externalId: query },
        ],
      } as any,
      include: [
        {
          model: Federation,
          where: federationWhere,
          required: true,
        },
      ],
      limit: 25,
      order: [['name', 'ASC']],
    });
  }

  /**
   * Vérifie qu'un federation_club existe et n'est pas déjà revendiqué.
   */
  async checkClaimAvailability(federationClubId: string): Promise<{
    federationClub: FederationClub;
    alreadyClaimed: boolean;
  }> {
    const federationClub = await FederationClub.findByPk(federationClubId);
    if (!federationClub) throw createError(404, 'Federation club not found');

    const existing = await TitanClubAccount.findOne({
      where: { federationClubId },
    });

    return {
      federationClub,
      alreadyClaimed: existing !== null,
    };
  }

  /**
   * Crée un titan_club_account rattaché à un federation_club.
   * Échoue si le club est déjà revendiqué.
   */
  async claimFederationClub(
    federationClubId: string,
    options: {
      displayName?: string;
      subscriptionPlan?: string;
    } = {},
  ): Promise<TitanClubAccount> {
    const { alreadyClaimed } = await this.checkClaimAvailability(federationClubId);
    if (alreadyClaimed) {
      throw createError(409, 'This federation club is already claimed on Titan');
    }

    const account = await TitanClubAccount.create({
      federationClubId,
      displayName: options.displayName ?? null,
      subscriptionPlan: options.subscriptionPlan ?? 'free',
      subscriptionStatus: 'active',
      subscribedAt: new Date().toISOString(),
    });

    this.logger.log(
      `Titan club account ${account.id} claimed federation_club ${federationClubId}`,
    );
    return account;
  }
}

export default new OnboardingService();
