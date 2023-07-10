import { Router } from 'express';
import auth from '../middlewares/auth';
import tagController from '../controllers/tag.controller';
import facultativeAuth from '../middlewares/facultative-auth';

const route = Router();

export const TagRouter = (app: Router): Router => {
  app.use('/tag', route);

  route.get('', facultativeAuth, tagController.getTags);

  route.post('', auth, tagController.createTag);

  route.delete('', auth, tagController.deleteTag);

  return route;
};
