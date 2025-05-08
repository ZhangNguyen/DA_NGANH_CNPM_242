import { set } from 'mongoose';
import Plant from '../models/PlantModel';
import DedicatedDevice from '../models/DedicatedDevice';
import {
  setCache,
  getCache,
  buildCacheKey,
  clearUserCache,
  getAllCache,
  deleteCache
} from '../services/CacheService';const TTL = 250; 
import History from '../models/History';

export const createPlant = async (
  pumpDeviceId: number | null,
  soilDeviceId: number | null,
  plantData: any,
  user: any
) => {
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

    const cacheKey = buildCacheKey('plant', userId, newPlant._id.toString());
    await setCache(cacheKey, newPlant, TTL);

    return {
      status: 'success',
      message: 'Plant created successfully',
      data: newPlant
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error creating plant'
    };
  }
};

export const getAllPlants = async (user: any) => {
  const userId = user.id;

  try {
    const pattern = buildCacheKey('plant', userId);

    // Lấy toàn bộ cây đã cache của user
    const cachedPlants = await getAllCache(pattern);
    if (cachedPlants && cachedPlants.length > 0) {
      return {
        status: 'success',
        source: 'cache',
        data: cachedPlants,
      };
    }

    // Nếu không có cache thì lấy từ DB
    // const plants = await Plant.find({ userId });
    const plants = await Plant.find({ userId })
    .populate('pumpDeviceId')
    .populate('soilDeviceId');
      if (!plants || plants.length === 0) {
      throw new Error('No plants found for this user.');
    }

    // Cache từng cây riêng biệt
    await Promise.all(plants.map(async (plant: any) => {
      const key = buildCacheKey('plant', userId, plant._id.toString());
      await setCache(key, plant, TTL);
    }));

    return plants;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error retrieving plants',
    };
  }
};

export const getPlantById = async (id: string, user: any) => {
  const userId = user.id;
  const cacheKey = buildCacheKey('plant', userId, id);
  const cachedPlant = await getCache(cacheKey);
  if (cachedPlant) {
    return cachedPlant;
  }
  try {
    const plant = await Plant.findOne({ _id: id, userId })
    .populate('pumpDeviceId')
    .populate('soilDeviceId');
      if (!plant) {
      throw new Error('Plant not found.');
    }
    await setCache(cacheKey, plant, TTL); // Cache the result for 5 minutes
    return plant;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error retrieving plant'
    };
  }
}
export const updatePlant = async (id: string, plantData: any, user: any) => {
  const userId = user.id;
  const cacheKey = buildCacheKey('plant', userId, id);
  try {
    if (plantData.pumpDeviceId) {
      const pumpUsed = await Plant.findOne({
        pumpDeviceId: plantData.pumpDeviceId,
        _id: { $ne: id }, // tránh tự kiểm
      });
      if (pumpUsed) throw new Error("Pump device already assigned to another plant.");
    }

    if (plantData.soilDeviceId) {
      const soilUsed = await Plant.findOne({
        soilDeviceId: plantData.soilDeviceId,
        _id: { $ne: id },
      });
      if (soilUsed) throw new Error("Soil device already assigned to another plant.");
    }
    const updatedPlant = await Plant.findOneAndUpdate(
      { _id: id, userId },
      plantData,
      { new: true }
    );

    if (!updatedPlant) {
      throw new Error('Plant not found or not authorized.');
    }

    await setCache(cacheKey, updatedPlant, TTL);

    return {
      status: 'success',
      message: 'Plant updated successfully',
      data: updatedPlant,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error updating plant',
    };
  }
};

export const deletePlant = async (id: string, user: any) => {
  const userId = user.id;
  const cacheKey = buildCacheKey('plant', userId, id);

  try {
    const deleted = await Plant.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      throw new Error('Plant not found or not authorized.');
    }

    // Xoá cache cây
    await deleteCache(cacheKey);

    return {
      status: 'success',
      message: 'Plant deleted successfully',
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error deleting plant',
    };
  }
};

export const getHistory = async () => {
  try {
      console.log('Fetching history...');
      const history = await History.find({}).sort({ timeaction: -1 }).populate('actiondevice').populate('plantId');
      console.log('Found history:', history);
      return {
          status: 'success',
          data: history
      };
  } catch (error: any) {
      console.log('Error fetching history:', error.message);
      return {
          status: 'error',
          message: error.message
      };
  }
};
