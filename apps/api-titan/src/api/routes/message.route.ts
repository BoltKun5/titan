import { Router } from 'express';
import messageController from '../controllers/message.controller';
import auth from '../middlewares/auth';
import { uploadMessageFile } from '../middlewares/upload';

const route = Router();

export const MessageRouter = (app: Router): Router => {
  app.use('/mimas/conversations', route);

  route.get('/messages/search', auth, messageController.searchGlobal);

  route.get('/:conversationId/messages', auth, messageController.list);

  route.get('/:conversationId/messages/search', auth, messageController.search);

  route.post('/:conversationId/messages', auth, messageController.send);

  route.post(
    '/:conversationId/messages/upload',
    auth,
    uploadMessageFile.single('file'),
    messageController.uploadFile,
  );

  return route;
};
