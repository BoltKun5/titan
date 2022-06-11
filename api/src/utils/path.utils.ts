import AppConfig from '../modules/AppConfig';
import path from 'path';

export const pathToTmp = (fileId?: string): string => {
  return path.join(AppConfig.pathTmp, fileId ?? '');
};
