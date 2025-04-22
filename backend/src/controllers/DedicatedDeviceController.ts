import { Request, Response } from "express";
import { getDeviceById,getDevicesByUser } from "../services/DedicatedService";
const getAllDevices = async (req: Request, res: Response) => {
    try {
      const devices = await getDevicesByUser(req.user);
      res.json(devices);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
const getDevice = async (req: Request, res: Response) => {
    try {
      const device = await getDeviceById(req.params.id);
      if (!device) return res.status(404).json({ message: "Device not found" });
      res.json(device);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
module.exports = {getAllDevices,getDevice};