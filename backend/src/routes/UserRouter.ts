import express from 'express';
const router = express.Router();
const userController = require('../controllers/UserController');
const middleware = require('../middleware/authMiddleware')
router.get('/adafruit-info',middleware.authMiddlewareClient,userController.getAdaFruitInfoController)
router.post('/adafruit-info',middleware.authMiddlewareClient,userController.updateAdaFruitInfoController)
router.post('/sign-up',userController.createUser);
router.post('/sign-in',userController.loginUser);
router.get('/getUser',middleware.authMiddlewareClient,userController.getUser);
router.get('/refresh-token',userController.refresh_token);
export default router;
