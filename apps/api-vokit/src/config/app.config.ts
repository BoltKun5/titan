export default {
  port: process.env.PORT || '',
  stackTraceLimit: 10,
  auth: {
    secretToken: process.env.AUTH_SECRET_TOKEN || '',
    expiration: '30d' || '',
  },
};
