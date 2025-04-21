import { Request,Response } from "express";
import { handleWebhookService } from "../services/WebhookService";
const handleWebhook = async (req: Request, res: Response) => {
    console.log("📩 Data từ Adafruit:", req.body);
    await handleWebhookService(req.body);
}
module.exports = {
    handleWebhook
}