import AppConfig from './modules/app-config.module';
import { AbyssMonitorCore } from 'abyss_monitor_core';
import { appLoader } from './loaders';

export const startServer = async (): Promise<void> => {
  AbyssMonitorCore.setConfig({
    applicationId: process.env.APPLICATION_ID || '',
    applicationApiKey: process.env.APPLICATION_API_KEY || '',
    applicationName: 'Titan API',
    secretPublishToken: process.env.MONITOR_SECRET_PUBLISH_TOKEN || '',
    ...(AppConfig.process.env === 'production'
      ? {}
      : {
          baseURL: process.env.MONITOR_URL || '',
        }),
  });

  AbyssMonitorCore.enableAxiosRetry();

  AppConfig.sequelize = await appLoader();
};
