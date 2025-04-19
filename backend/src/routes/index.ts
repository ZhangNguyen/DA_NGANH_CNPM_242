import { Express } from 'express';
import UserRouter from './UserRouter';
import SensorRouter from './SensorRouter';
import PlantRouter from './PlantRouter';
import AdafruitWebhookRouter from './adafruitWebhook';
const routes = (app: Express) => {
  app.use('/api/users', UserRouter);
  app.use('/api/sensors', SensorRouter);
  app.use('/api/plants', PlantRouter);
  app.use('/', AdafruitWebhookRouter);
};

export default routes;
