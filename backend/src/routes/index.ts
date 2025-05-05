import { Express } from 'express';
import UserRouter from './UserRouter';
import SensorRouter from './SensorRouter';
import PlantRouter from './PlantRouter';
import AdafruitWebhookRouter from './adafruitWebhook';
import CommandRouter from './CommandRouter';
import DedicatedRouter from "./DedicatedRouter";
import SharedRouter from "./SharedDeviceRouter";
import HistoryRouter from "./HistoryRouter";
import AverageRouter from "./AverageRouter";
const routes = (app: Express) => {
  app.use('/api/users', UserRouter);
  app.use('/api/sensors', SensorRouter);
  app.use('/api/plants', PlantRouter);
  app.use('/api/command', CommandRouter);
  app.use('/api/dedicated',DedicatedRouter);
  app.use('/api/shared',SharedRouter);
  app.use('/api/history',HistoryRouter);
  app.use('/', AdafruitWebhookRouter);
  app.use('/api/average',AverageRouter);
};

export default routes;
