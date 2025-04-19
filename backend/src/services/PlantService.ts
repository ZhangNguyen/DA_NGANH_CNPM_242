import { set } from 'mongoose';
import Plant from '../models/PlantModel';
import {
  setCache,
  getCache,
  buildCacheKey,
  clearUserCache,
  getAllCache,
  deleteCache
} from '../services/CacheService';const TTL = 250; 
export const createPlant = async (deviceId: any,plantData: any,user: any) => {
    try
    {
      const userId = user.id; 
      const existed = await Plant.findOne({ userId, type: plantData.type, location: plantData.location });
      if (existed) {
        throw new Error("Plant with this type and location already exists for user.");
      }
      const deviceInUse = await Plant.findOne({ deviceId });
      if (deviceInUse) {
        throw new Error("This device is already assigned to another plant.");
      }

      const newPlant = await Plant.create({
            ...plantData,
            userId,
            deviceId,
        });
      const cacheKey = buildCacheKey('plant', userId, newPlant._id.toString());
      await setCache(cacheKey, newPlant, TTL);
        return {
            status: 'success',
            message: 'Plant created successfully',
            data: newPlant
          };

    }
    catch (error: any) {
        return {
          status: 'error',
          message: error.message || 'Error creating plant'
        };
      }
}
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
    const plants = await Plant.find({ userId }).populate('deviceId');   
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
    const plant = await Plant.findOne({ _id: id, userId }).populate('deviceId'); 
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
    if (plantData.deviceId) {
      const deviceUsed = await Plant.findOne({
        deviceId: plantData.deviceId,
        _id: { $ne: id }, // Loại trừ cây hiện tại
      });
      if (deviceUsed) {
        throw new Error("Thiết bị này đã được gán cho một cây khác.");
      }
    }
    const updatedPlant = await Plant.findOneAndUpdate(
      { _id: id, userId },
      plantData,
      { new: true }
    );

    if (!updatedPlant) {
      throw new Error('Plant not found or not authorized.');
    }

    // Ghi đè lại cache
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


