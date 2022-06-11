import { Code, ErrorType } from 'abyss_crypt_core';
import crypto from 'crypto';
import { createWriteStream, WriteStream } from 'fs-extra';
import { Readable, Writable } from 'throttle';
import { Worker } from 'worker_threads';
import { handleError } from '../../utils/error.utils';
import { pathToTmp } from '../../utils/path.utils';
import AppConfig from '../AppConfig';

type ParamsEncrypt = {
  source: Readable;
  destination: Writable;
} & ParamsCreateCipher;

type ResultEncrypt = {
  byteSize: number;
};

type ParamsCreateCipher = {
  password: string;
  algorithm: any;
};

type ResultCreateCipher = {
  cipher: crypto.CipherGCM;
  vector: Buffer;
};

type ParamsDecrypt = {
  source: Readable;
  destination: Writable;
} & ParamsCreateCipher;

type ResultDecrypt = {
  byteSize: number;
};

export default class Crypter {
  static getCipherKey(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64').substring(0, 32);
  }

  static createCipher(params: ParamsCreateCipher): ResultCreateCipher {
    const { password, algorithm } = params;

    const initVect = crypto.randomBytes(16);
    const cipherKey = Crypter.getCipherKey(password);
    return { cipher: crypto.createCipheriv(algorithm, cipherKey, initVect), vector: initVect };
  }

  static async encrypt_w(params: ParamsEncrypt): Promise<ResultEncrypt> {
    return new Promise(async (resolve, reject) => {
      const { source, password, algorithm, destination } = params;
      let byteSize = 0;

      let writer: WriteStream;
      if (AppConfig.process.isDev) writer = createWriteStream(pathToTmp('crypted.png'));

      const worker = new Worker(
        __dirname + `../../../scripts/encrypt.${AppConfig.process.isDev ? 'ts' : 'js'}`,
        {
          workerData: {
            algorithm: algorithm,
            password: password,
          },
        },
      );

      source.on('data', (data) => {
        worker.postMessage(data);
        byteSize += data.byteLength;
      });

      worker.on('message', (data) => {
        destination.write(data);
        if (AppConfig.process.isDev) writer.write(data);
      });

      worker.on('error', reject);

      source.on('end', () => worker.postMessage('end'));

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(
            handleError({
              code: Code.threadError,
              type: ErrorType.apiError,
            }),
          );
        }

        if (AppConfig.process.isDev) writer.end();
        destination.end();
        return resolve({ byteSize });
      });
    });
  }

  static async decrypt_w(params: ParamsDecrypt): Promise<ResultDecrypt> {
    return new Promise(async (resolve, reject) => {
      const { source, password, algorithm, destination } = params;
      let byteSize = 0;

      let writer: WriteStream;
      if (AppConfig.process.isDev) writer = createWriteStream(pathToTmp('uncrypted.png'));

      const worker = new Worker(__dirname + '../../../scripts/decrypt.ts', {
        workerData: {
          algorithm: algorithm,
          password: password,
        },
      });

      source.on('data', (data) => {
        worker.postMessage(data);
        byteSize += data.byteLength;
      });

      worker.on('message', (data) => {
        destination.write(data);
        if (AppConfig.process.isDev) writer.write(data);
      });

      worker.on('error', reject);

      source.on('end', () => worker.postMessage('end'));

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(
            handleError({
              code: Code.threadError,
              type: ErrorType.apiError,
            }),
          );
        }

        if (AppConfig.process.isDev) writer.end();
        destination.end();
        return resolve({ byteSize });
      });
    });
  }

  static async encrypt(params: ParamsEncrypt): Promise<ResultEncrypt> {
    return new Promise(async (resolve, reject) => {
      const { source, password, algorithm, destination } = params;
      let byteSize = 0;

      const { cipher, vector } = Crypter.createCipher({
        algorithm,
        password,
      });

      source.on('data', (data: Buffer) => (byteSize += data.byteLength));
      cipher.write(vector);

      cipher.on('error', reject);
      source.pipe(cipher).pipe(destination);

      if (AppConfig.process.isDev) cipher.pipe(createWriteStream(pathToTmp('crypted.png')));

      source.on('end', () => resolve({ byteSize }));
    });
  }

  static async decrypt(params: ParamsDecrypt): Promise<ResultDecrypt> {
    const { source, destination, password, algorithm } = params;

    return new Promise(async (resolve, reject) => {
      let byteSize = 0;
      let decipher: crypto.Decipher;

      source.on('data', (data: Buffer) => {
        if (!byteSize) {
          decipher = crypto.createDecipheriv(
            algorithm,
            Crypter.getCipherKey(password),
            data.slice(0, 16),
          );

          decipher.on('error', reject);
          destination.on('finish', () => resolve({ byteSize }));

          if (AppConfig.process.isDev) decipher.pipe(createWriteStream(pathToTmp('uncrypted.png')));

          decipher.pipe(destination);
          decipher.write(data.slice(16));
        } else decipher.write(data);

        byteSize += data.byteLength;
      });

      source.on('end', () => decipher.end());
    });
  }
}
