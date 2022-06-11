import { LogType } from 'abyss_crypt_core';
import { startServer } from './app';
import AppConfig from './modules/AppConfig';
import Logger from './modules/Logger';

(async () => {
  try {
    AppConfig.consoleSetup();
    await startServer();

    setTimeout(test, 1);
  } catch (error) {
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
})();

async function test() {
  try {
    console.time('seed');
    console.timeEnd('seed');
  } catch (error) {
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
}
