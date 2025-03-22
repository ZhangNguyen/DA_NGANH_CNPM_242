import { Express } from 'express';
import UserRouter from './UserRouter';
import SensorRouter from './SensorRouter';

const routes = (app: Express) => {
  app.use('/api/users', UserRouter);
  app.use('/api/sensors', SensorRouter);
};

export default routes;
