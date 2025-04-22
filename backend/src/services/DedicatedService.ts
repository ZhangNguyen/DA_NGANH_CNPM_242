import DedicatedDevice from "../models/DedicatedDevice";
import axios from "axios";
import User from "../models/UserModel";
export const fetchDevicesFromAdafruit = async (user: any) => {
    try{
    const { adafruit_username, adafruit_key } = user;
    const res = await axios.get(`https://io.adafruit.com/api/v2/${adafruit_username}/feeds`, {
        headers: {
          "X-AIO-Key": adafruit_key
        }
      });
    const feeds = res.data;
    for (const feed of feeds) {
        let type: string | null = null;
  
        const name = feed.name.toLowerCase();
        if (name.includes("pump")) type = "pump";
        if (name.includes("soil")) type = "soil";
  
        if (!type) continue;
  
        const latestData = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${feed.key}/data/last`,
          { headers: { "X-AIO-Key": adafruit_key } }
        );
  
        await DedicatedDevice.findOneAndUpdate(
          { _id: latestData.data.feed_id},
          {
            _id: latestData.data.feed_id,
            devicetype: type,
            value: parseFloat(latestData.data.value),
            user: user.id,
            feed_key: feed.key,
            name: feed.name,
            status: 'active',
          },
          { upsert: true, new: true }
        );
      }
  
      return { status: "success", message: "Devices fetched from Adafruit" };
    } catch (err: any) {
      console.error(" Error fetching devices from Adafruit:", err.message);
      throw new Error("Failed to fetch devices from Adafruit");
    }
  };


export const getDevicesByUser = async (user: any) => {
    try{
    await fetchDevicesFromAdafruit(user);
    const devices = await DedicatedDevice.find({ user: user.id });
    return devices;
  }
  catch (error: any) {
    console.error('❌ Error in getDevicesByUser:', error.message);
    throw new Error('Failed to fetch dedicated devices');
  }
}
  export const getDeviceById = async (id: string) => {
    return await DedicatedDevice.findOne({ _id: id});
  };