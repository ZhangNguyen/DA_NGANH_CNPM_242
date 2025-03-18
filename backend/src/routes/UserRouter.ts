const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const middleware = require('../middleware/authMiddleware')
router.post('/sign-up',userController.createUser);
router.post('/sign-in',userController.loginUser);
router.post('/refresh-token',userController.refresh_token);
module.exports = router;