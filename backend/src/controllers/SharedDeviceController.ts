import { Request, Response } from "express";
import { getSharedDeviceById,getSharedDevicesByUser} from "../services/SharedService";
const getAllSharedDevices = async (req: Request, res: Response) => {
    try {
      const devices = await getSharedDevicesByUser(req.user);
      res.json(devices);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getSharedDevice = async (req: Request, res: Response) => {
    try {
      const device = await getSharedDeviceById(req.params.id);
      if (!device) return res.status(404).json({ message: "Shared device not found" });
      res.json(device);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    getAllSharedDevices,
    getSharedDevice,
  };