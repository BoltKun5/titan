import { Request, Response } from 'express';
import Crypter from '../../modules/Utils/Crypter';
import busboy from 'busboy';
import FileValidation from '../validations/file.validation';
import { handleError } from '../../utils/error.utils';
import { CryptionService } from '../../services/cryption.service';
import {
  IEncryptFileQuery,
  IEncryptFileResponse,
  CryptionType,
  Code,
  ErrorType,
  IDecryptFileQuery,
  IDecryptFileResponse,
} from 'abyss_crypt_core';
import { IResponseLocals } from '../../local_core';

export default class FileController {
  static async encrypt(
    req: Request<any, any, void, IEncryptFileQuery>,
    res: Response<IEncryptFileResponse, IResponseLocals>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      req.query = FileValidation.encryptQuery(req.query);

      const bb = busboy({ headers: req.headers });
      let containFile = false;

      bb.on('file', async (name, file, _info) => {
        try {
          if (name !== 'file') return;

          containFile = true;

          res.setHeader('Content-Type', 'application/octet-stream');
          res.locals.cryption = await CryptionService.create({
            algorithm: req.query.algorithm,
            type: CryptionType.ENCRYPT,
          });

          const { byteSize } = await (Number(req.headers['content-length']) >= 5 ** 6 // 5 Mo
            ? Crypter.encrypt_w
            : Crypter.encrypt)({
            source: file,
            algorithm: req.query.algorithm,
            password: req.query.password,
            destination: res,
          });

          res.locals.byteSize = byteSize;

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      bb.on('close', () => {
        if (containFile) return;

        reject(
          handleError({
            code: Code.noFileProvided,
            type: ErrorType.resourceError,
          }),
        );
      });

      req.pipe(bb);
    });
  }

  static async decrypt(
    req: Request<any, any, void, IDecryptFileQuery>,
    res: Response<IDecryptFileResponse, IResponseLocals>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      req.query = FileValidation.decryptQuery(req.query);

      const bb = busboy({ headers: req.headers });
      let containFile = false;

      bb.on('file', async (name, file, _info) => {
        try {
          if (name !== 'file') return;

          containFile = true;

          res.setHeader('Content-Type', 'application/octet-stream');
          res.locals.cryption = await CryptionService.create({
            algorithm: req.query.algorithm,
            type: CryptionType.DECRYPT,
          });

          const { byteSize } = await (Number(req.headers['content-length']) >= 5 ** 6 // 5 Mo
            ? Crypter.decrypt_w
            : Crypter.decrypt)({
            source: file,
            algorithm: req.query.algorithm,
            password: req.query.password,
            destination: res,
          });

          res.locals.byteSize = byteSize;

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      bb.on('close', () => {
        if (containFile) return;

        reject(
          handleError({
            code: Code.noFileProvided,
            type: ErrorType.resourceError,
          }),
        );
      });

      req.pipe(bb);
    });
  }
}
