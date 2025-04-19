import { SensorObserver } from "./SensorObsever";
import Plant from "../../models/PlantModel";
import DedicatedDevice from "../../models/DedicatedDevice";
import { SensorSubject } from "./SensorSubject";
import { getAllCache, buildCacheKey, setCache } from "../CacheService";
import Sensor from "../../models/SensorModel";
import { io } from "../../config/socket";
export class PlantStatusObserver implements SensorObserver {
  public async updateLimit(object: any, userID: string,plantID: string){
    const cacheKey = buildCacheKey('sensor', userID);
    let sensorList = await getAllCache(cacheKey) ?? [];
  
    if (sensorList.length === 0) {
      sensorList = await Sensor.find({ user: userID });
    }
  
    const dataLimit: { [key: string]: number | null } = {
      humidity: null,
      temperature: null,
      light: null,
      soil: null
    };
  
    // 1. Nếu object là sensor thường (có type là humidity, temperature, light)
    if (["humidity", "temperature", "light"].includes(object.type)) {
      dataLimit[object.type] = parseFloat(object.newestdata);
    }
  
    // 2. Nếu object là soil device
    if (object.type === "soil") {
      dataLimit.soil = parseFloat(object.newestdata);
    }
  
    // 3. Bổ sung các sensor còn thiếu (từ cache hoặc DB)
    for (const sensor of sensorList) {
      const { type, newestdata } = sensor;
      if (type in dataLimit && dataLimit[type] === null) {
        dataLimit[type] = parseFloat(newestdata);
      }
    }

    if (dataLimit.soil === null) {
      const plant = await Plant.findById(plantID).populate("deviceId");
      if (plant && plant.deviceId && plant.deviceId.devicetype === "soil") {
        const device: any = plant.deviceId; // vì populate
        if (device.value != null) {
          dataLimit.soil = parseFloat(device.value);
        }
        }
      }
    return dataLimit;
}
  private isSameArrayUnordered(a: string[], b: string[]): boolean {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
  
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
  
    return sortedA.every((val, index) => val === sortedB[index]);
  }
  
  async update(object: any): Promise<void> {
    const userId = object.user;
    const TTL = 250;
    const changedPlants: any[] = [];
    const plantCacheKey = buildCacheKey('plant',userId);
    let plants = await getAllCache(plantCacheKey) ?? [];
    if (!plants || plants.length === 0) {
      plants = await Plant.find({ userId }).populate('deviceId');
    }
    await Promise.all(plants.map(async (plant) => {
      const actions: string[] = [];
      const dataLimit = await this.updateLimit(object,userId,plant._id);
      const { temperature, humidity, light, soil } = dataLimit;
      if (
        temperature == null ||
        humidity == null ||
        light == null ||
        soil == null
      ) {
        console.warn(`⚠️ Thiếu sensor dữ liệu cho plant ${plant._id}`);
        return; // Bỏ qua cây này
      }
      const wateringScore = (temperature > 30 ? 1 : 0) +
      (light > 600 ? 1 : 0) +
      (soil < 40 ? 1.5 : 0) +
      (humidity < 50 ? 1 : 0);
      if (wateringScore >= 3)
      {
        actions.push("TUOI NUOC");
      }
      if (
        temperature > (plant.limitTemp?.max ?? 35) &&
        light > 600
      ) {
        actions.push("BAT QUAT");
      }
      let arr_status: string[] = [];
      if (actions.includes("TUOI NUOC")) arr_status.push("watering");
      if (actions.includes("BAT QUAT")) arr_status.push("fanning");
      if (arr_status.length === 0) arr_status.push("normal");
      if(!this.isSameArrayUnordered(arr_status,plant.status))
      {
        const updated = {
          plantID: plant._id,
          status: arr_status,
          updateAt: new Date(),
        }
        changedPlants.push(updated);
        const singlePlantKey = buildCacheKey('plant',userId,plant._id.toString());
        setCache(singlePlantKey,{...plant.toObject(),status: arr_status}, TTL);
        Plant.findByIdAndUpdate(plant._id, { status: arr_status });

      }
    }));
    if (changedPlants.length > 0) {
      io.to(userId.toString()).emit("plant-status-update", changedPlants);
    }
  }
  }

