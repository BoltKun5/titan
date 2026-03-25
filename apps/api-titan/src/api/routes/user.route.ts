import { Router } from 'express';
import userController from '../controllers/user.controller';
import auth from '../middlewares/auth';
import { uploadAvatar } from '../middlewares/upload';

const route = Router();

export const UserRouter = (app: Router): Router => {
  app.use('/user', route);

  route.get('/me', auth, userController.me);

  route.get('/search', auth, userController.search);

  route.get('/get-by-id', auth, userController.getById);

  route.post('/update-options', auth, userController.updateOption);

  route.post('/update-password', auth, userController.updatePassword);

  route.post('/update-shown-name', auth, userController.updateShownName);

  route.post('/update-bio', auth, userController.updateBio);

  route.post(
    '/upload-avatar',
    auth,
    uploadAvatar.single('avatar'),
    userController.uploadAvatar,
  );

  return route;
};
