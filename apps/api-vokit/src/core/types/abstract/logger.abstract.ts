import LoggerModule from '../../../modules/logger.module';
import { get as httpContextGet } from 'express-http-context';
import { LogType } from 'vokit_core';

type ParamsError = {
  type?: LogType;
};

type ParamsInfo = {
  type?: LogType;
  shouldLogIntoDiscord?: boolean;
};

type ParamsWarn = {
  type?: LogType;
  shouldLogIntoDiscord?: boolean;
};
export class LoggerModel {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  private getCurrentRequestId(): string | null {
    return httpContextGet('reqId') || null;
  }

  public async error(error: Error | string, options?: ParamsError): Promise<void> {
    LoggerModule.error(error, {
      context: this.name,
      requestId: this.getCurrentRequestId() || undefined,
      ...options,
    });
  }

  public async log(message: string): Promise<void> {
    LoggerModule.log(message, {
      context: this.name,
      requestId: this.getCurrentRequestId() || undefined,
    });
  }

  public async info(message: string, options?: ParamsInfo): Promise<void> {
    LoggerModule.info(message, {
      context: this.name,
      requestId: this.getCurrentRequestId() || undefined,
      shouldLogIntoDiscord: true,
      ...options,
    });
  }

  public async warn(message: string, options?: ParamsWarn): Promise<void> {
    LoggerModule.warn(message, {
      context: this.name,
      requestId: this.getCurrentRequestId() || undefined,
      shouldLogIntoDiscord: true,
      ...options,
    });
  }
}
