import express from 'express';
const Client = require("../controllers/CommandController");
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.post('/watering/:deviceId', middleware.authMiddlewareClient, Client.WateringControl);
router.post('/RGB/:deviceId', middleware.authMiddlewareClient, Client.RGBControl);
router.post('/power/:deviceId', middleware.authMiddlewareClient, Client.PoweroffControl);
router.post('/light/:deviceId', middleware.authMiddlewareClient, Client.LightControl);
router.post('/fan/:deviceId', middleware.authMiddlewareClient, Client.FanControl);
export default router;