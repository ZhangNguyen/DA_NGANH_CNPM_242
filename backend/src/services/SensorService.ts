import axios from "axios"
import User from '../models/UserModel';
import Sensor from '../models/SensorModel';

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
      console.log("OK");
      if (!feedMappings || feedMappings.length === 0) {
        return { status: 'error', message: 'No feeds found on Adafruit IO' };
      }
  
      for (const feed of feedMappings) {
        let type = await mapFeedNameToSensorType(feed.name);
        if (!type) continue;
      
        const response = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruitUsername}/feeds/${feed.feedKey}/data?limit=5`
        );
      
        const dataList = response.data;
        const latestData = dataList[0];
      
        await Sensor.findOneAndUpdate(
          { name: feed.name, user: userId },
          {
            name: feed.name,
            type: type,
            feedKey: feed.feedKey,
            status: 'active',
            user: userId,
            ...(latestData && { newestdata: parseFloat(latestData.value) })
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
        const UserModel = await User.findById(userId);
        const { adafruit_username, adafruit_key } = UserModel;
        console.log(adafruit_username, adafruit_key);
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
      const userId = user.id;
  
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
const fetchFeedData = async (adafruitUsername: string, adafruitKey: string, feedKey: string) => {
      try {
        const response = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruitUsername}/feeds/${feedKey}/data?limit=100`
        );
        return response.data;
      } catch (error: any) {
        console.error(`Error fetching data from Adafruit feed ${feedKey}:`, error.message);
        throw new Error('Cannot fetch data from Adafruit IO');
      }
    };
    
export const getAverageDay = async (user: any, type: string) => {
      try {
        const userId = user.id;
    
        // 1. Lấy sensor dựa theo type và user
        const sensors = await Sensor.find({ user: userId, type });
    
        if (!sensors) {
          return { status: 'error', message: `Sensor not found for type ${type}` };
        }
        const UserModel = await User.findById(userId);
        const { adafruit_username, adafruit_key } = UserModel;
        let totalValue = 0;
        let totalRecords = 0;
        for(const sensor of sensors) {
        const feedKey = sensor.feedKey; 
        const dataList = await fetchFeedData(adafruit_username, adafruit_key, feedKey);

        if (!dataList || dataList.length === 0) {
          return { status: 'error', message: `No data found for type ${type}` };
        }
        // 3. Lọc dữ liệu trong ngày hiện tại
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayData = dataList.filter((record: any) => {
          const recordDate = new Date(record.created_at);
          return recordDate >= today;
        });
        if (todayData.length === 0) {
          return { status: 'error', message: `No data for today for type ${type}` };
        }
        const sensorTotal = todayData.reduce((sum: number, item: any) => sum + parseFloat(item.value), 0);
        totalValue += sensorTotal;
        totalRecords += todayData.length;
    }
      if (totalRecords === 0) {
        return { status: 'error', message: `No data found today for type ${type}` };
      }

      const average = totalValue / totalRecords;

      return {
        status: 'success',
        message: `Day average for ${type} calculated`,
        average
      };    
      } catch (error: any) {
        console.error('Error calculating day average:', error.message);
        throw new Error('Cannot calculate day average');
      }
    };
    
    export const getAverageMonth = async (user: any, type: string) => {
      try {
        const userId = user.id;
        const sensors = await Sensor.find({ user: userId, type });
    
        if (!sensors || sensors.length === 0) {
          return { status: 'error', message: `No sensors found for type ${type}` };
        }
    
        const UserModel = await User.findById(userId);
        const { adafruit_username, adafruit_key } = UserModel;
    
        let totalValue = 0;
        let totalRecords = 0;
    
        for (const sensor of sensors) {
          const feedKey = sensor.feedKey; // Bắt buộc phải có feedKey
    
          const dataList = await fetchFeedData(adafruit_username, adafruit_key, feedKey);
          if (!dataList || dataList.length === 0) continue;
    
          const firstDayOfMonth = new Date();
          firstDayOfMonth.setDate(1);
          firstDayOfMonth.setHours(0, 0, 0, 0);
    
          const monthData = dataList.filter((record: any) => {
            const recordDate = new Date(record.created_at);
            return recordDate >= firstDayOfMonth;
          });
    
          if (monthData.length === 0) continue;
    
          const sensorTotal = monthData.reduce((sum: number, item: any) => sum + parseFloat(item.value), 0);
          totalValue += sensorTotal;
          totalRecords += monthData.length;
        }
    
        if (totalRecords === 0) {
          return { status: 'error', message: `No data found for this month for type ${type}` };
        }
    
        const average = totalValue / totalRecords;
    
        return {
          status: 'success',
          message: `Month average for ${type} calculated`,
          average
        };
    
      } catch (error: any) {
        console.error('Error calculating month average:', error.message);
        throw new Error('Cannot calculate month average');
      }
    };
    