import axios from "axios"
import User from '../models/UserModel';
import Sensor from '../models/SensorModel';
import { AverageDay } from './strategies/average/AverageDay';
import { AverageMonth } from './strategies/average/AverageMonth';
import { AverageContext } from './strategies/average/AverageContext'
import redisClient from '../config/redisClient';
import {
  setCache,
  getCache,
  buildCacheKey,
  deleteCache
} from '../services/CacheService';const TTL = 250; 
const fetchFeedListFromAdafruit = async (adafruitUsername: string, adafruitKey: string) => {
    try {
      const response = await axios.get(
        `https://io.adafruit.com/api/v2/${adafruitUsername}/feeds`
      );
  
      const feedList = response.data.map((feed: any) => ({
        feedKey: feed.key,   // da.rgb, da.temp, ...
        name: feed.name      // RGB, Temp, etc.
      }));
  
      return feedList;
  
    } catch (error: any) {
      console.error('Error fetching feed list from Adafruit:', error.message);
      throw new Error('Cannot fetch feed list from Adafruit IO');
    }
  };
  const mapFeedNameToSensorType = (feedName: string): string | null => {
    const lowerName = feedName.toLowerCase();
    if (lowerName.includes('light')) {
      return 'light';
    }
  
    if (lowerName.includes('temp')) {
      return 'temperature';
    }
  
    if (lowerName.includes('hum')) {
      return 'humidity';
    }
    // if(lowerName.includes('soil'))
    // {
    //     return 'soil';
    // }
  
    return null;
  };
const fetchSensorDataAdafruit = async (adafruitUsername: string, adafruitKey: string, userId: string) => {
    try {
      // Lấy danh sách feed tự động
      const feedMappings = await fetchFeedListFromAdafruit(adafruitUsername, adafruitKey);
      if (!feedMappings || feedMappings.length === 0) {
        return { status: 'error', message: 'No feeds found on Adafruit IO' };
      }
  
      for (const feed of feedMappings) {
        let type = await mapFeedNameToSensorType(feed.name);
        if (!type) continue;
      
        const response = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruitUsername}/feeds/${feed.feedKey}/data/last`,
          {
            headers: {
              'X-AIO-Key': adafruitKey,
            }
          }
        );
      
        const dataList = response.data;
    
        await Sensor.findOneAndUpdate(
          { _id: dataList.feed_id},
          {
            _id: dataList.feed_id,
            name: feed.name,
            type: type,
            feedKey: feed.feedKey,
            status: 'active',
            user: userId,
            newestdata: dataList.value,
            timeUpdate: Date.now(),
          },
          { upsert: true, new: true }
        );
      }
      
  
      return { status: 'success', message: 'Sensor data fetched and updated' };
  
    } catch (error: any) {
      console.error('Error fetching sensor data from Adafruit:', error.message);
      throw new Error('Cannot fetch data from Adafruit IO');
    }
  };
  
export const getAllDataSensors = async(user: any) =>
{
    try{
        const userId = user.id;
        const {adafruit_username,adafruit_key} = user
        await fetchSensorDataAdafruit(adafruit_username, adafruit_key, userId);
        // 2. Truy vấn DB mới nhất
        const allSensors = await Sensor.find({ user: userId }).sort({ timeUpdate: -1 });
        const latestSensors: Record<string, any> = {};
        for (const sensor of allSensors) {
          const { _id } = sensor;
          if (!latestSensors[_id]) {
            latestSensors[_id] = sensor;
    
            // Redis cache theo id 
            const cacheKey = buildCacheKey('sensor', userId, _id.toString());
            await setCache(cacheKey, sensor, TTL);
          }
        }
        return Object.values(latestSensors);
    }
    catch (error: any) {
        return error
    }
}
export const getSensorById = async (user: any, sensorId: string) => {
    try {
      const userId = user.id;
      const cacheKey = buildCacheKey('sensor', userId, sensorId);
      const cachedSensor = await getCache(cacheKey);
      if (cachedSensor) {
        console.log("✅ Sensor from cache");
        return cachedSensor;
      }
      // 1. Kiểm tra sensor có tồn tại và thuộc về user không
      const sensor = await Sensor.findOne({
        _id: sensorId,user: userId
      });
  
      if (!sensor) {
        return {
          status: 'error',
          message: 'Sensor not found or you do not have permission'
        };
      }
      await setCache(cacheKey, sensor, TTL);
      return sensor;
    }
    catch (error: any) {
        console.error('Error fetching sensor by ID:', error.message);
        throw new Error('Cannot fetch sensor data');
      }
    }

export const getAverageDay = async (user: any, type: string) => {
  const context = new AverageContext(new AverageDay());
  return await context.execute(user, type);
};

export const getAverageMonth = async (user: any, type: string) => {
  const context = new AverageContext(new AverageMonth());
  return await context.execute(user, type);
};