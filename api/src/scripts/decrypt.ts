import { parentPort, workerData } from 'worker_threads';
import crypto from 'crypto';
import Crypter from '../modules/Utils/Crypter';

const inputData = workerData as {
  password: string;
  algorithm: any;
};

let decipher: crypto.DecipherGCM;
let isFirstMessage = true;

parentPort.on('message', (data) => {
  if (isFirstMessage) {
    isFirstMessage = false;

    decipher = crypto.createDecipheriv(
      inputData.algorithm,
      Crypter.getCipherKey(inputData.password),
      data.slice(0, 16),
    );

    decipher.on('data', (data) => {
      parentPort.postMessage(data);
    });

    decipher.write(data.slice(16));
  } else if (data === 'end') {
    decipher.end();
    parentPort.close();
  } else decipher.write(data);
});
