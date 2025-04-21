import express from 'express';
const DedicatedDevice = require("../controllers/DedicatedDeviceController");
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.get('/', middleware.authMiddlewareClient, DedicatedDevice.getAllDevices);
router.get('/:id', middleware.authMiddlewareClient, DedicatedDevice.getDevice);
export default router;

