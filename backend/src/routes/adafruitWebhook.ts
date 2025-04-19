// routes/adafruitWebhook.ts
import express from 'express';
const AdafruitWebhook = require('../controllers/WebHookController');
const router = express.Router();

router.post('webhook/adafruit', AdafruitWebhook.handleWebhook);
export default router;
