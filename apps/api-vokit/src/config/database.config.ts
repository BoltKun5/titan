import { Dialect } from 'sequelize/types';

export default {
  host: process.env.DATABASE_HOST || '',
  port: parseInt(process.env.DATABASE_PORT || '0'),
  username: process.env.DATABASE_USERNAME || '',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || '',
  dialect: (process.env.DATABASE_DIALECT || '') as Dialect,
};
