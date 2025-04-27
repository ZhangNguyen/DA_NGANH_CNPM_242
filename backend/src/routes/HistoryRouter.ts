import express from 'express';
const Plant = require('../controllers/PlantController');
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.get('/', middleware.authMiddlewareClient, Plant.getHistoryController);
export default router;