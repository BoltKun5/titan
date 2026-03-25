import { Router } from 'express';
import conversationController from '../controllers/conversation.controller';
import auth from '../middlewares/auth';

const route = Router();

export const ConversationRouter = (app: Router): Router => {
  app.use('/mimas/conversations', route);

  route.get('/', auth, conversationController.list);

  route.get('/search', auth, conversationController.search);

  route.get('/total-unread', auth, conversationController.totalUnread);

  route.post('/', auth, conversationController.create);

  route.put('/:id/read', auth, conversationController.markAsRead);

  route.put('/:id/name', auth, conversationController.updateName);

  route.put('/:id/description', auth, conversationController.updateDescription);

  route.put('/:id/pin', auth, conversationController.togglePin);

  route.put('/:id/archive', auth, conversationController.toggleArchive);

  route.put('/:id/mute', auth, conversationController.toggleMute);

  route.put('/:id/ephemeral', auth, conversationController.setEphemeral);

  route.post('/:id/participants', auth, conversationController.addParticipants);

  route.delete('/:id/leave', auth, conversationController.leave);

  route.delete('/:id', auth, conversationController.deleteConversation);

  return route;
};
