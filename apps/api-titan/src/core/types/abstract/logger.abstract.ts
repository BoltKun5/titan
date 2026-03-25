import { LogScenario, getRequestContext } from 'abyss_monitor_core';
import AppConfig from '../../../modules/app-config.module';

type ParamsError = {
  //
};

type ParamsInfo = {
  shouldLogIntoDiscord?: boolean;
};

type ParamsWarn = {
  shouldLogIntoDiscord?: boolean;
};
export class LoggerModel {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  private getCurrentRequestId(): string | undefined {
    try {
      return getRequestContext()?.requestId;
    } catch {
      return undefined;
    }
  }

  public async error(
    error: Error | string,
    options?: ParamsError,
  ): Promise<void> {
    AppConfig.logger.error(error, {
      context: this.name,
      scenario: LogScenario.API,
      requestId: this.getCurrentRequestId(),
      ...options,
    });
  }

  public async log(message: string): Promise<void> {
    AppConfig.logger.log(message, {
      context: this.name,
      scenario: LogScenario.API,
      requestId: this.getCurrentRequestId(),
    });
  }

  public async info(message: string, options?: ParamsInfo): Promise<void> {
    AppConfig.logger.info(message, {
      context: this.name,
      scenario: LogScenario.API,
      requestId: this.getCurrentRequestId(),
      ...options,
    });
  }

  public async warn(message: string, options?: ParamsWarn): Promise<void> {
    AppConfig.logger.warn(message, {
      context: this.name,
      scenario: LogScenario.API,
      requestId: this.getCurrentRequestId(),
      ...options,
    });
  }
}
