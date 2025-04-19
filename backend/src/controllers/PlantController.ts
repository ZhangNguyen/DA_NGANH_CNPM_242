import { Request, Response } from "express";
import { createPlant,getAllPlants,getPlantById,updatePlant,deletePlant } from '../services/PlantService';
const createPlantController = async (req: Request, res: Response) => {
    try {
        const PlantData = {
            type: req.body.type,
            location: req.body.location,
            limitWatering: {
                min: req.body.limitWatering.min,
                max: req.body.limitWatering.max
            },
            limitTemp: {
                min: req.body.limitTemp.min,
                max: req.body.limitTemp.max
            },
        }
        const result = await createPlant(req.body.deviceId,PlantData, req.user);
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
            limitWatering: {
                min: req.body.limitWatering.min,
                max: req.body.limitWatering.max
            },
            limitTemp: {
                min: req.body.limitTemp.min,
                max: req.body.limitTemp.max
            },
            deviceId:req.body.deviceId
        }
        const result = await updatePlant(req.params.plantId, PlantData, req.user);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const deletePlantController = async (req: Request, res: Response) => {
    try {
        const result = await deletePlant(req.params.plantId, req.user);
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