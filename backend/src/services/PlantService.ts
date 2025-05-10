import Plant from '../models/PlantModel';
import DedicatedDevice from '../models/DedicatedDevice';
import {
  setCache,
  getCache,
  getTTL,
  buildCacheKey,
  deleteCache
} from '../services/CacheService';
const TTL = 250;
import History from '../models/History';

export const createPlant = async (pumpDeviceId: number | null, soilDeviceId: number | null, plantData: any, user: any) => {
  const userId = user.id;
  try {
    if (pumpDeviceId != null) {
      const pumpDevice = await DedicatedDevice.findOne({ _id: pumpDeviceId, devicetype: 'pump' });
      if (!pumpDevice) throw new Error("Pump device not found.");
      const pumpUsed = await Plant.findOne({ pumpDeviceId });
      if (pumpUsed) throw new Error("Pump device already in use.");
    }
    if (soilDeviceId != null) {
      const soilDevice = await DedicatedDevice.findOne({ _id: soilDeviceId, devicetype: 'soil' });
      if (!soilDevice) throw new Error("Soil device not found.");
      const soilUsed = await Plant.findOne({ soilDeviceId });
      if (soilUsed) throw new Error("Soil device already in use.");
    }
    const newPlant = await Plant.create({
      ...plantData,
      userId,
      ...(pumpDeviceId != null && { pumpDeviceId }),
      ...(soilDeviceId != null && { soilDeviceId }),
    });
    const listKey = buildCacheKey('plant', userId);
    const cachedList = await getCache(listKey);
    const ttl = await getTTL(listKey);
    if (cachedList && ttl) {
      cachedList.push(newPlant);
      await setCache(listKey, cachedList, ttl);
    }
    // else
    // {
    //   const allPlants = await Plant.find({ userId }).populate('pumpDeviceId').populate('soilDeviceId');
    //   await setCache(listKey, allPlants, TTL);
    // }
    return { status: 'success', message: 'Plant created successfully', data: newPlant };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Error creating plant' };
  }
};

export const getAllPlants = async (user: any) => {
  const userId = user.id;
  const listKey = buildCacheKey('plant', userId);
  try {
    const cachedPlants = await getCache(listKey);
    if (cachedPlants && cachedPlants.length > 0) {
      return { status: 'success', data: cachedPlants, source: 'cache' };
    }
    const plants = await Plant.find({ userId }).populate('pumpDeviceId').populate('soilDeviceId');
    if (!plants || plants.length === 0) {
      throw new Error('No plants found for this user.');
    }
    await setCache(listKey, plants, TTL);
    return { status: 'success', data: plants, source: 'db' };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Error retrieving plants' };
  }
};

export const updatePlant = async (id: string, plantData: any, user: any) => {
  const userId = user.id;
  const listKey = buildCacheKey('plant', userId);
  try {
    if (plantData.pumpDeviceId) {
      const pumpUsed = await Plant.findOne({ pumpDeviceId: plantData.pumpDeviceId, _id: { $ne: id } });
      if (pumpUsed) throw new Error("Pump device already assigned to another plant.");
    }
    if (plantData.soilDeviceId) {
      const soilUsed = await Plant.findOne({ soilDeviceId: plantData.soilDeviceId, _id: { $ne: id } });
      if (soilUsed) throw new Error("Soil device already assigned to another plant.");
    }
    const updatedPlant = await Plant.findOneAndUpdate({ _id: id, userId }, plantData, { new: true });
    if (!updatedPlant) throw new Error('Plant not found or not authorized.');
    const cachedList = await getCache(listKey);
    const ttl = await getTTL(listKey);
    if (cachedList && ttl) {
      const updatedList = cachedList.map((p: any) => p._id === id ? { ...p, ...plantData } : p);
      await setCache(listKey, updatedList, ttl);
    }
    const plantCacheKey = buildCacheKey('plant', userId, id);
    await setCache(plantCacheKey, updatedPlant, TTL);
    return { status: 'success', message: 'Plant updated successfully', data: updatedPlant };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Error updating plant' };
  }
};

export const deletePlant = async (id: string, user: any) => {
  const userId = user.id;
  const listKey = buildCacheKey('plant', userId);
  try {
    const deleted = await Plant.findOneAndDelete({ _id: id, userId });
    if (!deleted) throw new Error('Plant not found or not authorized.');
    const cachedList = await getCache(listKey);
    const ttl = await getTTL(listKey);
    if (cachedList && ttl) {
      const updatedList = cachedList.filter((p: any) => p._id !== id);
      await setCache(listKey, updatedList, ttl);
    }
    const plantCacheKey = buildCacheKey('plant', userId, id);
    await deleteCache(plantCacheKey);
    return { status: 'success', message: 'Plant deleted successfully' };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Error deleting plant' };
  }
};

export const getPlantById = async (id: string, user: any) => {
  const userId = user.id;
  const cacheKey = buildCacheKey('plant', userId, id);
  const cachedPlant = await getCache(cacheKey);
  if (cachedPlant) return cachedPlant;
  try {
    const plant = await Plant.findOne({ _id: id, userId }).populate('pumpDeviceId').populate('soilDeviceId');
    if (!plant) throw new Error('Plant not found.');
    await setCache(cacheKey, plant, TTL);
    return plant;
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Error retrieving plant' };
  }
};

export const getHistory = async () => {
  try {
    const history = await History.find({}).sort({ timeaction: -1 }).populate('actiondevice').populate('plantId');
    return { status: 'success', data: history };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
};
  