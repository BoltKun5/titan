import AppConfig from '../modules/app-config.module';
import { WebhookClient, MessagePayload, WebhookCreateMessageOptions } from 'discord.js';

class DiscordWebhook {
  private abyssInfoWebhook: WebhookClient;
  private infoWebhook: WebhookClient;
  private apiWebhook: WebhookClient;
  private errorWebhook: WebhookClient;

  constructor() {
    this.abyssInfoWebhook = new WebhookClient({
      url: AppConfig.config.logger.webhook.mainInfo,
    });
    this.infoWebhook = new WebhookClient({
      url: AppConfig.config.logger.webhook.info,
    });
    this.apiWebhook = new WebhookClient({
      url: AppConfig.config.logger.webhook.api,
    });
    this.errorWebhook = new WebhookClient({
      url: AppConfig.config.logger.webhook.error,
    });
  }

  public async createErrorMessage(
    content: string | MessagePayload | WebhookCreateMessageOptions,
  ): Promise<void> {
    this.errorWebhook.send(content);
  }

  public async createInfoMessage(
    content: string | MessagePayload | WebhookCreateMessageOptions,
  ): Promise<void> {
    await Promise.all([this.abyssInfoWebhook.send(content), this.infoWebhook.send(content)]);
  }

  public async createApiMessage(
    content: string | MessagePayload | WebhookCreateMessageOptions,
  ): Promise<void> {
    await this.apiWebhook.send(content);
  }
}

export default new DiscordWebhook();
