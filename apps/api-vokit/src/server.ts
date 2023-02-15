require('express-async-errors');
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';
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
import axios from 'axios';

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

    const getAllTGCardImg = async () => {
      const searchId = 'CEC';
      const writeId = 'CEC';

      for (let i = 101; i <= 271; i++) {
        const URL = `https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/${searchId}/${searchId}_${String(
          i,
        ).padStart(3, '0')}_R_FR_LG.png`;
        try {
          if (fs.existsSync(`./img/${writeId}/${i}.jpg`)) {
            continue;
          }
          const res = await axios.get(URL, {
            responseType: 'arraybuffer',
          });
          if (!res.data) continue;
          if (!fs.existsSync(`./img/${writeId}`)) fs.mkdirSync(`./img/${writeId}`);
          fs.writeFileSync(
            `./img/${writeId}/${String(i).padStart(3, '0')}.jpg`,
            Buffer.from(res.data as any),
          );
          console.log(i);
        } catch (e) {
          // console.log(URL)
          continue;
        }
      }
    };

    const getAllCardImg = async () => {
      const searchId = 'SK';
      const writeId = 'SK';
      for (let i = 151; i <= 182; i++) {
        const URL = `https://www.pokecardex.com/assets/images/sets/${searchId}/HD/${i}.jpg`;
        try {
          if (fs.existsSync(`./img/${writeId}/${i}.jpg`)) {
            continue;
          }
          const res = await axios.get(URL, {
            responseType: 'arraybuffer',
          });
          if (!res.data) continue;
          if (!fs.existsSync(`./img`)) fs.mkdirSync(`./img`);
          if (!fs.existsSync(`./img/${writeId}`)) fs.mkdirSync(`./img/${writeId}`);
          fs.writeFileSync(`./img/${writeId}/H${i - 150}.jpg`, Buffer.from(res.data as any));
        } catch (e) {
          console.log(URL);
          continue;
        }
      }
    };

    // getAllCardImg();

    // getAllTGCardImg();

    console.timeEnd('seed');
  } catch (error: any) {
    LoggerModule.error(error, { type: LogType.SYSTEM_STARTUP });
  }
}
