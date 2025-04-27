import express from 'express';
const Plant = require('../controllers/PlantController');
const router = express.Router();
const middleware = require('../middleware/authMiddleware')
router.post('/', middleware.authMiddlewareClient, Plant.createPlantController); //create plant
router.get('/', middleware.authMiddlewareClient, Plant.getAllPlantsController); //get all plants
router.get('/:id', middleware.authMiddlewareClient, Plant.getPlantByIdController); //get plant by id
router.put('/:id', middleware.authMiddlewareClient, Plant.updatePlantController); //update plant by id
router.delete('/:id', middleware.authMiddlewareClient, Plant.deletePlantController); //delete plant by id
export default router;