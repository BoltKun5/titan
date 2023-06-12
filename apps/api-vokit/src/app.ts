import AppConfig from './modules/app-config.module';
import { AbyssMonitorCore, LogScenario } from 'abyss_monitor_core';
import { appLoader } from './loaders';
import { AbyssStorageCore } from 'abyss_storage_core';

export const startServer = async (): Promise<void> => {
  AbyssMonitorCore.setBaseUrl('https://monitor-staging-api.abyss-project.fr/api');
  AbyssMonitorCore.setApiKey(process.env.ACCOUNT_API_KEY || '');
  AbyssMonitorCore.setApiKeyUserApplication(process.env.USER_APPLICATION_API_KEY || '');
  AbyssMonitorCore.setUserApplicationId(process.env.APPLICATION_ID || '');

  AbyssStorageCore.setBaseUrl('https://storage-staging-api.abyss-project.fr/api');
  AbyssStorageCore.setApiKey(process.env.ACCOUNT_API_KEY || '');
  AbyssStorageCore.setApiKeyUserApplication(process.env.MONITOR_APPLICATION_API_KEY || '');

  AbyssMonitorCore.enableAxiosRetry();

  if (AppConfig.process.env !== 'development') {
    AbyssMonitorCore.StatsPublisher.start({
      logger: AppConfig.logger,
      processId: process.pid.toString(),
    });
  }

  AppConfig.sequelize = await appLoader();

  await AppConfig.logger.log('Abyss authentication configured', {
    scenario: LogScenario.SYSTEM_STARTUP,
  });
};
