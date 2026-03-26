import { LogScenario } from 'abyss_monitor_core';
import AppConfig from '../modules/app-config.module';
import { apiLoader } from './api.loader';
import { databaseLoader } from './database.loader';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../database';
import { SportConfig } from '../database';
import { UserRoleEnum, SportType } from 'titan_core';
import bcrypt from 'bcryptjs';

export const appLoader = async (): Promise<Sequelize> => {
  const connection = await databaseLoader();
  AppConfig.logger.log('DB loaded and connected!', {
    scenario: LogScenario.SYSTEM_STARTUP,
  });

  await seedDevUsers();
  await seedSportConfigs();

  apiLoader();
  AppConfig.logger.log('Express loaded', {
    scenario: LogScenario.SYSTEM_STARTUP,
  });

  return connection;
};

const DEV_USERS = [
  {
    firstName: 'Admin',
    lastName: 'Titan',
    shownName: 'Admin',
    mail: 'admin@titan.dev',
    role: UserRoleEnum.ADMIN,
  },
  {
    firstName: 'Lucas',
    lastName: 'Martin',
    shownName: 'Lucas M.',
    mail: 'lucas@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Emma',
    lastName: 'Bernard',
    shownName: 'Emma B.',
    mail: 'emma@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Hugo',
    lastName: 'Dupont',
    shownName: 'Hugo D.',
    mail: 'hugo@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Chloé',
    lastName: 'Leroy',
    shownName: 'Chloé L.',
    mail: 'chloe@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Nathan',
    lastName: 'Moreau',
    shownName: 'Nathan M.',
    mail: 'nathan@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Léa',
    lastName: 'Petit',
    shownName: 'Léa P.',
    mail: 'lea@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Théo',
    lastName: 'Roux',
    shownName: 'Théo R.',
    mail: 'theo@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Manon',
    lastName: 'Fournier',
    shownName: 'Manon F.',
    mail: 'manon@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
  {
    firstName: 'Enzo',
    lastName: 'Girard',
    shownName: 'Enzo G.',
    mail: 'enzo@titan.dev',
    role: UserRoleEnum.MEMBER,
  },
];

const seedDevUsers = async (): Promise<void> => {
  if (AppConfig.process.env === 'production') return;

  const hash = bcrypt.hashSync('password', 12);
  let created = 0;

  for (const u of DEV_USERS) {
    const existing = await User.findOne({ where: { mail: u.mail } });
    if (existing) continue;

    await User.create({
      mail: u.mail,
      password:
        u.mail === 'admin@titan.dev' ? bcrypt.hashSync('admin', 12) : hash,
      firstName: u.firstName,
      lastName: u.lastName,
      shownName: u.shownName,
      role: u.role,
      isActive: true,
    });
    created++;
  }

  if (created > 0) {
    AppConfig.logger.log(`${created} dev user(s) created`, {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  }
};

const SPORT_CONFIGS = [
  {
    sport: SportType.HANDBALL,
    positions: [
      'Gardien',
      'Pivot',
      'Ailier gauche',
      'Ailier droit',
      'Arrière gauche',
      'Arrière droit',
      'Demi-centre',
    ],
    goalSubtypes: ['6m', '9m', 'Aile', 'Contre-attaque', '7m'],
    sanctionTypes: [
      'Avertissement',
      'Exclusion 2min',
      'Disqualification',
      'Rapport',
    ],
    periods: ['1ère MT', '2ème MT'],
    rankingRules: {
      win: 3,
      draw: 1,
      loss: 0,
    },
  },
];

const seedSportConfigs = async (): Promise<void> => {
  let created = 0;

  for (const config of SPORT_CONFIGS) {
    const existing = await SportConfig.findOne({
      where: { sport: config.sport },
    });
    if (existing) continue;

    await SportConfig.create({
      sport: config.sport,
      positions: config.positions,
      goalSubtypes: config.goalSubtypes,
      sanctionTypes: config.sanctionTypes,
      periods: config.periods,
      rankingRules: config.rankingRules,
    });
    created++;
  }

  if (created > 0) {
    AppConfig.logger.log(`${created} sport config(s) seeded`, {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  }
};
