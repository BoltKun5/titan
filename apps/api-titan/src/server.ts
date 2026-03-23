import * as dotenv from 'dotenv';
dotenv.config();

import AppConfig from './modules/app-config.module';
import { startServer } from './app';

if (process.env.NODE_ENV === 'CI') {
  process.exit(0);
}

(async () => {
  try {
    AppConfig.init();
    await startServer();
  } catch (error: any) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
