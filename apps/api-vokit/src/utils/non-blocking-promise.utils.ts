import { LoggerModel } from '../core';
import LoggerModule from '../modules/logger.module';

export const nonBlockingPromise = (promise: Promise<unknown>, logger?: LoggerModel): void => {
  if (promise) {
    promise.catch((error) => {
      if (logger) {
        logger.error(new Error(error));
      } else {
        LoggerModule.error(new Error(error));
      }
    });
  }
};
