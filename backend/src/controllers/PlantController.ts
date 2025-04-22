import { Request, Response } from "express";
import { createPlant,getAllPlants,getPlantById,updatePlant,deletePlant } from '../services/PlantService';
const createPlantController = async (req: Request, res: Response) => {
    try {
        const PlantData = {
            type: req.body.type,
            location: req.body.location,
            limitWatering: req.body.limitWatering,
            limitTemp: req.body.limitTemp,
        }
        const pumpDeviceId = req.body.pumpDeviceId ? Number(req.body.pumpDeviceId) : null;
        const soilDeviceId = req.body.soilDeviceId ? Number(req.body.soilDeviceId) : null;
        const result = await createPlant(pumpDeviceId, soilDeviceId, PlantData, req.user);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const getAllPlantsController = async (req: Request, res: Response) => {
    try {
        const result = await getAllPlants(req.user);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const getPlantByIdController = async (req: Request, res: Response) => {
    try {
        const result = await getPlantById(req.params.plantId, req.user);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const updatePlantController = async (req: Request, res: Response) => {
    try{
        const PlantData = {
            type: req.body.type,
            location: req.body.location,
            limitWatering: req.body.limitWatering,
            limitTemp:req.body.limitTemp,
            pumpDeviceId:req.body.pumpDeviceId,
            soilDeviceId:req.body.soilDeviceId
        }
        const result = await updatePlant(req.params.id, PlantData, req.user);
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const deletePlantController = async (req: Request, res: Response) => {
    try {
        const result = await deletePlant(req.params.id, req.user);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
module.exports = {
    createPlantController,
    getAllPlantsController,
    getPlantByIdController,
    updatePlantController,
    deletePlantController
};