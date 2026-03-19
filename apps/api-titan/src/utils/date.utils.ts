import dayjs from 'dayjs';
import AppConfig from '../modules/app-config.module';

export const dateFormatted = (date = new Date()): string => {
  return dayjs(date).format(AppConfig.config.logger.prompt.dateFormat);
};
