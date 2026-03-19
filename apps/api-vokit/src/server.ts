import * as dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'CI') {
  process.exit(0);
}

import AppConfig from './modules/app-config.module';
import { startServer } from './app';
import { LogScenario } from 'abyss_monitor_core';

(async () => {
  try {
    AppConfig.init();
    await startServer();

    AppConfig.logger.info(
      `Server successfully started on port ${AppConfig.config.app.port} with processId ${process.pid}`,
      { scenario: LogScenario.SYSTEM_STARTUP },
    );

    test();
  } catch (error: any) {
    AppConfig.logger.error(error, {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  }
})();

async function test() {
  try {
    console.time('seed');

    console.timeEnd('seed');
  } catch (error: any) {
    AppConfig.logger.error(error, { scenario: LogScenario.SYSTEM_STARTUP });
  }
}
