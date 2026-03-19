import * as dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'CI') {
  process.exit(0);
}

// import AppConfig from './modules/app-config.module';
// import { startServer } from './app';

(async () => {
  try {
    // AppConfig.init();
    // await startServer();

    test();
  } catch (error: any) {}
})();

async function test() {
  try {
    //
  } catch (error: any) {}
}
