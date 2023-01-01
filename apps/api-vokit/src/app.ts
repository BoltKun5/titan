import AppConfig from './modules/app-config.module';
import LoggerModule from './modules/logger.module';

export async function startServer(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppConfig.sequelize = await require('./loaders').default();


  await LoggerModule.info('Abyss authentication configured');
}
