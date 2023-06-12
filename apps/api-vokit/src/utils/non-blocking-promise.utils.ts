import { LoggerModel } from '../core';
import AppConfig from '../modules/app-config.module';
export const nonBlockingPromise = (promise: Promise<unknown>, logger?: LoggerModel): void => {
  if (promise) {
    promise.catch((error) => {
      if (logger) {
        logger.error(error);
      } else {
        AppConfig.logger.error(error);
      }
    });
  }
};
