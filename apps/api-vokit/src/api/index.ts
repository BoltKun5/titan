import { Router } from 'express';
import * as Routes from './routes';

export default (): Router => {
  const app = Router();

  for (const route in Routes) {
    Routes[route as keyof typeof Routes](app);
  }

  return app;
};
