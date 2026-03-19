export default {
  prompt: {
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
    prompt: {
      log: '',
      info: '[INFO]',
      warn: '[WARN]',
      error: '[ERROR]',
    },
  },
  webhook: {
    mainInfo: process.env.DISCORD_WEBHOOK_MAIN_INFO || '',
    info: process.env.DISCORD_WEBHOOK_INFO || '',
    api: process.env.DISCORD_WEBHOOK_API || '',
    error: process.env.DISCORD_WEBHOOK_ERROR || '',
  },
};
