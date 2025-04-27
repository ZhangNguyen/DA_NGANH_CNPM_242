import { Request, Response } from "express";
import { Plant_IsWatering,RGB,Poweroff,Light,Fan } from "../services/Command/Client";
import Plant from '../models/PlantModel';
import Shared from '../models/SharedDevice';
import Dedicated from '../models/DedicatedDevice';
// const WateringControl = async (req: Request, res: Response) => {
//     try {
//         await Plant_IsWatering(req.params.deviceId,req.user,req.body.value);
//         // return res.status(200).json({ status: "success", message: "Đã tưới hoặc không tưới nước" });
        
//     } catch (err: any) {
//       res.status(500).json({ error: err.message });
//     }
//   };
import History from '../models/History'; 
const mongoose = require('mongoose');
const WateringControl = async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.params; 
        const { value } = req.body;
        const user = req.user;

        await Plant_IsWatering(deviceId, user, value);

        const plant = await Plant.findOne({ 
            pumpDeviceId: deviceId, 
            userId: user.id 
        });
        
        if (!plant) {
            throw new Error('Không tìm thấy cây trồng liên quan đến thiết bị này');
        }
        const newHistory = await History.create({
            plantId: plant._id,
            action: "PUMP",
            status: "success",
            value: value,
            timeaction: new Date(),
            actiondevice: deviceId
        });

        return res.status(200).json({ 
            status: "success", 
            message: "Đã tưới nước thành công",
            history: newHistory 
        });
    } catch (err: any) {
        console.error('Lỗi khi tưới cây:', err);
        res.status(500).json({ error: err.message });
    }
};
// const RGBControl = async (req: Request, res: Response) => {
//     try {
//         await RGB(req.params.deviceId,req.user,req.body.value);
//         return res.status(200).json({ status: "success", message: "Đã thay đổi RGB" });

//     } catch (err: any) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  const RGBControl = async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.params; 
        const { value } = req.body;
        const user = req.user;

        await RGB(deviceId, user, value);

        const shared = await Shared.findOne({ 
            _id: deviceId,
            devicetype : "RGB",
        });

        if (!shared) {
            throw new Error('Không tìm thấy RGB thiết bị này');
        }

        const newHistory = await History.create({
            plantId: null,
            action: "RGB",
            status: "success",
            value: value,
            timeaction: new Date(),
            actiondevice: deviceId
        });
        return res.status(200).json({ status: "success", message: "Đã thay đổi RGB" });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
// const PoweroffControl = async (req: Request, res: Response) => {
// try {
//     await Poweroff(req.params.deviceId,req.user,req.body.value);
//     return res.status(200).json({ status: "success", message: "Thiết bị đã tắt" });

// } catch (err: any) {
//     res.status(500).json({ error: err.message });
// }
// };
const PoweroffControl = async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.params; 
        const { value } = req.body;
        const user = req.user;

        await Poweroff(deviceId, user, value);

        const shared = await Shared.findOne({ 
            _id: deviceId
        });
        const dedicated = await Dedicated.findOne({ 
            _id: deviceId
        });
        if (!dedicated && !shared) {
            throw new Error('Không tìm thấy thiết bị này');
        }

        const newHistory = await History.create({
            plantId: null,
            action: "SHUTDOWN",
            status: "success",
            value: value,
            timeaction: new Date(),
            actiondevice: deviceId
        });

        return res.status(200).json({ status: "success", message: "Thiết bị đã tắt" });
    
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
    };
// const LightControl = async (req: Request, res: Response) => {
//     try {
//         await Light(req.params.deviceId,req.user,req.body.value);
//         return res.status(200).json({ status: "success", message: "Đã điều chỉnh ánh sáng" });

//     } catch (err: any) {
//         res.status(500).json({ error: err.message });
//     }
//     };
const LightControl = async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.params; 
        const { value } = req.body;
        const user = req.user;

        await Light(deviceId, user, value);

        const shared = await Shared.findOne({ 
            _id: deviceId,
            devicetype : "light",
        });

        if (!shared) {
            throw new Error('Không tìm thấy light thiết bị này');
        }

        const newHistory = await History.create({
            plantId: null,
            action: "LIGHT",
            status: "success",
            value: value,
            timeaction: new Date(),
            actiondevice: deviceId
        });
        return res.status(200).json({ status: "success", message: "Đã điều chỉnh ánh sáng" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
    };
// const FanControl = async (req: Request, res: Response) => {
//   try {
//       await Fan(req.params.deviceId,req.user,req.body.value);
//       return res.status(200).json({ status: "success", message: "Quạt đã bật" });

//   } catch (err: any) {
//       res.status(500).json({ error: err.message });
//   }
//   };
const FanControl = async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.params; 
        const { value } = req.body;
        const user = req.user;

        await Fan(deviceId, user, value);

        const shared = await Shared.findOne({ 
            _id: Number(deviceId), 
            devicetype : "fan_level",
        });

        if (!shared) {
            throw new Error('Không tìm thấy thiết bị này');
        }

        const newHistory = await History.create({
            plantId: null,
            action: "FAN",
            status: "success",
            value: value,
            timeaction: new Date(),
            actiondevice: deviceId 
        });
        return res.status(200).json({ status: "success", message: "Quạt đã bật" });
  
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
    };
module.exports = {WateringControl,RGBControl,PoweroffControl,LightControl,FanControl};