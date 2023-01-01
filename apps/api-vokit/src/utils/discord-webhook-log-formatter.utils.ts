import { WebhookCreateMessageOptions } from 'discord.js';
import { upperFirst } from 'lodash';
import { APIMethod } from 'vokit_core';

export const HIGHLIGHT = '```';

export enum DISCORD_EMBED_COLORS {
  red = 0xff0000,
  green = 0x4bb543,
  blue = 0x00ccff,
  orange = 0xffa500,
  grey = 0x808080,
}

export const generateDiscordHighlightBlock = (content: string): string => {
  return `${HIGHLIGHT}\n${content}\n${HIGHLIGHT}`;
};

export const generateDiscordHighlightBlockWithColor = (
  color: keyof typeof DISCORD_EMBED_COLORS,
  message: string,
): string => {
  if (color === 'green') {
    return `${HIGHLIGHT}diff\n+ ${message}\n${HIGHLIGHT}`;
  } else if (color === 'red') {
    return `${HIGHLIGHT}diff\n- ${message}\n${HIGHLIGHT}`;
  } else if (color === 'orange') {
    return `${HIGHLIGHT}fix\n${message}\n${HIGHLIGHT}`;
  } else if (color === 'blue') {
    return `${HIGHLIGHT}ini\n[${message}]\n${HIGHLIGHT}`;
  } else {
    return `${HIGHLIGHT}${message}${HIGHLIGHT}`;
  }
};

export const getBlockColorByResultCode = (
  resultCode: number,
): keyof typeof DISCORD_EMBED_COLORS => {
  if (resultCode >= 100 && resultCode <= 199) {
    return 'blue';
  } else if (resultCode >= 200 && resultCode <= 299) {
    return 'green';
  } else if (resultCode >= 300 && resultCode <= 399) {
    return 'grey';
  } else if (resultCode >= 400 && resultCode <= 499) {
    return 'orange';
  } else if (resultCode >= 500 && resultCode <= 599) {
    return 'red';
  }
  return 'grey';
};

export const getAPIEmbedColor = (
  color: keyof typeof DISCORD_EMBED_COLORS,
): DISCORD_EMBED_COLORS => {
  if (['blue', 'green'].includes(color)) {
    return DISCORD_EMBED_COLORS.green;
  } else if (['orange'].includes(color)) {
    return DISCORD_EMBED_COLORS.orange;
  } else if (['red'].includes(color)) {
    return DISCORD_EMBED_COLORS.red;
  } else {
    return DISCORD_EMBED_COLORS.grey;
  }
};

export type ParamsGenerateDiscordApiLogMessageContent = {
  name: string;
  authenticatedUserOrMethod: string;
  controller: string;
  endpoint: string;
  httpResultCode: number;
  method: APIMethod;
  requestIps: string[];
  requestId: string;
  processId: string;
  durationInMs: number;
  requestStartDate: Date;
  responseBody?: Record<string, unknown>;
};

export const generateDiscordApiLogMessageContent = (
  params: ParamsGenerateDiscordApiLogMessageContent,
): WebhookCreateMessageOptions => {
  const color = getBlockColorByResultCode(params.httpResultCode);

  let durationColor: keyof typeof DISCORD_EMBED_COLORS;
  if (params.durationInMs < 50) durationColor = 'green';
  else if (params.durationInMs < 150) durationColor = 'orange';
  else durationColor = 'red';

  return {
    embeds: [
      {
        color: getAPIEmbedColor(color),
        author: {
          name: `${params.name} - API`,
        },
        fields: [
          {
            name: `Request ID`,
            value: generateDiscordHighlightBlock(params.requestId),
            inline: true,
          },
          {
            name: `Process ID`,
            value: generateDiscordHighlightBlock(params.processId),
            inline: true,
          },
          {
            name: `User`,
            value: generateDiscordHighlightBlock(params.authenticatedUserOrMethod),
          },
          {
            name: `Method`,
            value: `${generateDiscordHighlightBlockWithColor(
              'blue',
              APIMethod[params.method].toUpperCase(),
            )}`,
            inline: true,
          },
          {
            name: `Code`,
            value: generateDiscordHighlightBlockWithColor(color, params.httpResultCode.toString()),
            inline: true,
          },
          {
            name: `Duration`,
            value: generateDiscordHighlightBlockWithColor(
              durationColor,
              `${params.durationInMs}ms`,
            ),
            inline: true,
          },
          {
            name: `Controller`,
            value: generateDiscordHighlightBlock(
              upperFirst(params.controller || 'Unknown Controller'),
            ),
            inline: true,
          },
          {
            name: `Endpoint`,
            value: generateDiscordHighlightBlock(params.endpoint),
            inline: true,
          },
          {
            name: `Client IPs`,
            value: generateDiscordHighlightBlock(params.requestIps.join('\n')),
          },
          ...(params.httpResultCode < 200 || params.httpResultCode > 399
            ? [{ name: `Error`, value: `${JSON.stringify(params.responseBody)}` }]
            : []),
        ],
        footer: {
          text: `${new Date().toUTCString()}`,
        },
      },
    ],
  };
};
