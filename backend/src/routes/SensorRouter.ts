import express from 'express';
const Sensor = require('../controllers/SensorController');
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.get('/', middleware.authMiddlewareClient,Sensor.getAllDataSensorsController);
router.get('/:id', middleware.authMiddlewareClient,Sensor.getDataSensorByIdController);
export default router;