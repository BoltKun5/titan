import { User } from '../database';
import AppConfig from '../modules/app-config';
import jws from 'jsonwebtoken';

export const token = (user: User): string => {
  return jws.sign({ UUID: user.id }, AppConfig.config.app.auth.secretToken, {
    expiresIn: AppConfig.config.app.auth.expiration,
  });
};
