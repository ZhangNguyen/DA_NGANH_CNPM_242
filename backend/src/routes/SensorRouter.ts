import express from 'express';
const Sensor = require('../controllers/SensorController');
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.get('/', middleware.authMiddlewareClient,Sensor.getAllDataSensorsController);
router.get('/:id', middleware.authMiddlewareClient,Sensor.getDataSensorByIdController);
router.get('/month/:type', middleware.authMiddlewareClient,Sensor.averageMonth);
router.get('/day/:type', middleware.authMiddlewareClient,Sensor.averageDay);

export default router;