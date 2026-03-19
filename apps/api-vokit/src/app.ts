import AppConfig from './modules/app-config.module';
import { AbyssMonitorCore, LogScenario } from 'abyss_monitor_core';
import { appLoader } from './loaders';
import { AbyssStorageCore } from 'abyss_storage_core';

export const startServer = async (): Promise<void> => {
  AbyssMonitorCore.setConfig({
    applicationId: process.env.APPLICATION_ID || '',
    applicationApiKey: process.env.APPLICATION_API_KEY || '',
    applicationName: 'Vokit API',
    secretPublishToken: process.env.MONITOR_SECRET_PUBLISH_TOKEN || '',
    ...(AppConfig.process.env === 'production'
      ? {}
      : {
          baseURL: process.env.MONITOR_URL || '',
        }),
  });

  AbyssStorageCore.setConfig({
    ...(AppConfig.process.env === 'production'
      ? {}
      : {
          baseURL: process.env.STORAGE_URL || '',
        }),
    applicationApiKey: process.env.APPLICATION_API_KEY || '',
  });

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
