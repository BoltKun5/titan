import { Router } from 'express';
import conversationController from '../controllers/conversation.controller';
import auth from '../middlewares/auth';

const route = Router();

export const ConversationRouter = (app: Router): Router => {
  app.use('/mimas/conversations', route);

  route.get('/', auth, conversationController.list);

  route.post('/', auth, conversationController.create);

  route.put('/:id/read', auth, conversationController.markAsRead);

  return route;
};
