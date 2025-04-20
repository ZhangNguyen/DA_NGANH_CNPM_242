import { Request, Response } from "express";
import { Plant_IsWatering,RGB,Poweroff,Light,Fan } from "../services/Command/Client";
const WateringControl = async (req: Request, res: Response) => {
    try {
        await Plant_IsWatering(req.params.deviceId,req.user,req.body.value);
        return res.status(200).json({ status: "success", message: "Đã tưới hoặc không tưới nước" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
const RGBControl = async (req: Request, res: Response) => {
    try {
        await RGB(req.params.deviceId,req.user,req.body.value);
        return res.status(200).json({ status: "success", message: "Đã thay đổi RGB" });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
const PoweroffControl = async (req: Request, res: Response) => {
try {
    await Poweroff(req.params.deviceId,req.user,req.body.value);
    return res.status(200).json({ status: "success", message: "Thiết bị đã tắt" });

} catch (err: any) {
    res.status(500).json({ error: err.message });
}
};
const LightControl = async (req: Request, res: Response) => {
    try {
        await Light(req.params.deviceId,req.user,req.body.value);
        return res.status(200).json({ status: "success", message: "Đã điều chỉnh ánh sáng" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
    };
const FanControl = async (req: Request, res: Response) => {
  try {
      await Fan(req.params.deviceId,req.user,req.body.value);
      return res.status(200).json({ status: "success", message: "Quạt đã bật" });

  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
  };
    
module.exports = {WateringControl,RGBControl,PoweroffControl,LightControl,FanControl};