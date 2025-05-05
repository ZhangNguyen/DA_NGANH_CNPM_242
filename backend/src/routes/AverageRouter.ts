// import express from 'express';
// const Average = require('../controllers/AverageController');
// const middleware = require('../middleware/authMiddleware')
// const router = express.Router();
// router.get('/:type/:period', middleware.authMiddleware, Average.getAverage);
// export default router;
import express from 'express';
const { authMiddlewareClient } = require('../middleware/authMiddleware'); // Destructuring
const { getAverage } = require('../controllers/AverageController');

const router = express.Router();

router.get('/:type/:period', 
    authMiddlewareClient, // Sử dụng trực tiếp
    getAverage
);

export default router;