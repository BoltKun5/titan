import * as dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV === 'PRODUCTION') {
  dotenv.config({ path: path.resolve('.env.production') });
} else if (process.env.NODE_ENV === 'STAGING') {
  dotenv.config({ path: path.resolve('.env.staging') });
} else {
  dotenv.config();
}

if (process.env.NODE_ENV === 'CI') {
  process.exit(0);
}

import AppConfig from './modules/app-config.module';
import { startServer } from './app';
import LoggerModule from './modules/logger.module';
import { LogType } from 'vokit_core';

(async () => {
  try {
    AppConfig.consoleSetup();
    await startServer();

    setTimeout(test, 1);
  } catch (error: any) {
    LoggerModule.error(error, { type: LogType.SYSTEM_STARTUP });
  }
})();

async function test() {
  try {
    console.time('seed');
    console.timeEnd('seed');
  } catch (error: any) {
    LoggerModule.error(error, { type: LogType.SYSTEM_STARTUP });
  }
}
