import express from 'express';
const SharedDevice = require("../controllers/SharedDeviceController");
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.get('/', middleware.authMiddlewareClient, SharedDevice.getAllSharedDevices);
router.get('/:id', middleware.authMiddlewareClient, SharedDevice.getSharedDevice);
export default router;

