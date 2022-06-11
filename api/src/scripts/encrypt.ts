import { parentPort, workerData } from 'worker_threads';
import Crypter from '../modules/Utils/Crypter';

const inputData = workerData as {
  password: string;
  algorithm: any;
};

const { cipher, vector } = Crypter.createCipher({
  password: inputData.password,
  algorithm: inputData.algorithm,
});

cipher.on('data', (data) => {
  parentPort.postMessage(data);
});

parentPort.on('message', (data) => {
  if (data === 'end') {
    cipher.end();
    parentPort.close();
  } else cipher.write(data);
});

cipher.write(vector);
