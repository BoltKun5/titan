import { Router } from 'express';
import trainingController from '../../controllers/titan/training.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanTrainingRouter = (app: Router): Router => {
  app.use('/titan', route);

  // Trainings (scoped to club)
  route.get('/clubs/:clubId/trainings', auth, trainingController.list);
  route.post('/clubs/:clubId/trainings', auth, trainingController.create);

  // Training operations
  route.get('/trainings/:trainingId', auth, trainingController.get);
  route.put('/trainings/:trainingId', auth, trainingController.update);
  route.delete('/trainings/:trainingId', auth, trainingController.remove);

  // Attendance
  route.put(
    '/trainings/:trainingId/attendance',
    auth,
    trainingController.markAttendance,
  );

  return route;
};
