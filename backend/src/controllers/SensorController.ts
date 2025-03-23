import { Request, Response } from "express";
import {getAllDataSensors,getSensorById,getAverageMonth,getAverageDay} from '../services/SensorService';
const getAllDataSensorsController = async (req: Request, res: Response) =>
{
    try{
        const result = await getAllDataSensors(req.user);
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const getDataSensorByIdController = async (req: Request, res: Response) =>
{
    try{
        const result = await getSensorById(req.user,req.params.id);
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const averageMonth = async(req: Request, res: Response) =>
{
    try{
        const result = await getAverageMonth(req.user,req.params.type);
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const averageDay = async(req: Request, res: Response) =>
    {
        try{
            const result = await getAverageDay(req.user,req.params.type);
            return res.status(200).json(result);
        }
        catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }
module.exports ={getAllDataSensorsController,getDataSensorByIdController,averageMonth,averageDay}