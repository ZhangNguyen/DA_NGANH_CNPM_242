import { getCache, setCache } from "./CacheService";
import { io } from "../config/socket";
import Sensor from "../models/SensorModel";
import DedicatedDevice from "../models/DedicatedDevice";
import { SaveToDbObserver } from "./Obsever/SaveToDbObsever";
import { SensorSubject } from "./Obsever/SensorSubject";
import { PlantStatusObserver } from "./Obsever/PlantStatusObsever";
const TTL = 250;
const sensorSubject = new SensorSubject();
sensorSubject.attach(new SaveToDbObserver());
sensorSubject.attach(new PlantStatusObserver());
export const handleWebhookService = async (payload: any) => {
  try {
    // Xử lý SENSOR

    const data = Array.isArray(payload) ? payload[0] : payload;
    const { feed_id, value } = data;
    const updateValue = parseFloat(value);
    const now = new Date();
    const sensorCacheKey = `sensor:${feed_id}`;
    let sensor = await getCache(sensorCacheKey);
    if (!sensor) {
      sensor = await Sensor.findOne({ _id: Number(feed_id) });
    }
    if (sensor) {
      const updatedSensor = {
        ...sensor.toObject?.() || sensor,
        newestdata: updateValue,
        timeUpdate: now,
      };
      const iotouser = sensor.user.toString();
      io.to(iotouser).emit("sensor_update", updatedSensor);
     
      await sensorSubject.notify(updatedSensor);
      await setCache(sensorCacheKey, updatedSensor, TTL);
      return;
    }

    // Xử lý DEDICATED DEVICE (soil)
    const soilCacheKey = `soil:${feed_id}`;
    let soilDevice = await getCache(soilCacheKey);

    if (!soilDevice) {
      soilDevice = await DedicatedDevice.findOne({ _id: feed_id, devicetype: 'soil' }).populate('user');
    }

    if (soilDevice) {
      const updatedSoil = {
        ...soilDevice.toObject?.() || soilDevice,
        value: updateValue,
        timeAction: now,
      };
      const iotouser = soilDevice.user._id.toString();

      io.to(iotouser).emit("soil_update", updatedSoil);
      // io.to(`user:${soilDevice.user}`).emit("soil_update", updatedSoil);
      await sensorSubject.notify(updatedSoil);
      await setCache(soilCacheKey, updatedSoil, TTL);
      return;
    }

    // Nếu không phải sensor cũng không phải soil
    throw new Error("Device not found or unsupported type");
  } catch (error: any) {
    console.error("Webhook handling error:", error.message);
  }
};
