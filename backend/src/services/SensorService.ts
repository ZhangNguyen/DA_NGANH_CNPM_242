import axios from "axios"
import User from '../models/UserModel';
import Sensor from '../models/SensorModel';
import SensorHistory from "../models/SensorRecord";
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
    if(lowerName.includes('soil'))
    {
        return 'soil';
    }
  
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
        let type = await mapFeedNameToSensorType(feed.name)
        if (!type) {
          continue;
        }
        const response = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruitUsername}/feeds/${feed.feedKey}/data?limit=10`
        );
  
        const dataList = response.data;
  
        // Kiểm tra sensor đã có chưa
        let sensor = await Sensor.findOne({ name: feed.name, user: userId });
       
        if (!sensor) {
          // Tự động phân loại type nếu có logic riêng, tạm thời dùng name làm type
          sensor = await Sensor.create({
            name: feed.name,
            type: type,
            status: 'active',
            user: userId
          });
        }
  
        for (const record of dataList) {
          const value = parseFloat(record.value);
          const recordedAt = new Date(record.created_at);
  
          const exists = await SensorHistory.findOne({
            sensor: sensor._id,
            recordedAt: recordedAt
          });
  
          if (!exists) {
            await SensorHistory.create({
              sensor: sensor._id,
              value: value,
              recordedAt: recordedAt
            });
          }
        }
  
        const latestData = dataList[0];
        if (latestData) {
          await Sensor.findByIdAndUpdate(sensor._id, {
            newestdata: parseFloat(latestData.value)
          });
        }
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
        const userId = user.payload.id;
        const UserModel = await User.findById(userId);
        const { adafruit_username, adafruit_key } = UserModel;
        await fetchSensorDataAdafruit(adafruit_username, adafruit_key, userId);
        // Truy vấn mới nhất
        const sensor = await Sensor.find({user:userId}).sort({updatedAt:-1});
        return sensor;
    }
    catch (error: any) {
        return error
    }
}
export const getSensorById = async (user: any, sensorId: string) => {
    try {
      const userId = user.payload.id;
  
      // 1. Kiểm tra sensor có tồn tại và thuộc về user không
      const sensor = await Sensor.findOne({
        _id: sensorId,
        user: userId
      });
  
      if (!sensor) {
        return {
          status: 'error',
          message: 'Sensor not found or you do not have permission'
        };
      }
      return sensor;
    }
    catch (error: any) {
        console.error('Error fetching sensor by ID:', error.message);
        throw new Error('Cannot fetch sensor data');
      }
    }