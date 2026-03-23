import { Router } from 'express';
import messageController from '../controllers/message.controller';
import auth from '../middlewares/auth';

const route = Router();

export const MessageRouter = (app: Router): Router => {
  app.use('/mimas/conversations', route);

  route.get('/:conversationId/messages', auth, messageController.list);

  route.post('/:conversationId/messages', auth, messageController.send);

  return route;
};
