import { startServer } from './app';
import AppConfig from './modules/app-config';
import Logger from './modules/logger';
import 'module-alias/register';

(async () => {
  try {
    AppConfig.consoleSetup();
    await startServer();

    setTimeout(test, 1);
  } catch (error: any) {
    Logger.error(error);
  }
})();

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

async function test() {
  try {
    console.time('seed');

    console.timeEnd('seed');
  } catch (error: any) {
    Logger.error(error);
  }
}
