import { SensorObserver } from "./SensorObsever";
import Plant from "../../models/PlantModel";
import DedicatedDevice from "../../models/DedicatedDevice";
import { SensorSubject } from "./SensorSubject";
import { getAllCache, buildCacheKey, setCache } from "../CacheService";
import Sensor from "../../models/SensorModel";
import { io } from "../../config/socket";

export class PlantStatusObserver implements SensorObserver {
  public async updateLimit(object: any, userID: string, plantID: string) {
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

    if (["humidity", "temperature", "light"].includes(object.type)) {
      dataLimit[object.type] = parseFloat(object.newestdata);
    }

    if (object.type === "soil") {
      dataLimit.soil = parseFloat(object.newestdata);
    }

    for (const sensor of sensorList) {
      const { type, newestdata } = sensor;
      if (type in dataLimit && dataLimit[type] === null) {
        dataLimit[type] = parseFloat(newestdata);
      }
    }

    if (dataLimit.soil === null) {
      const plant = await Plant.findById(plantID).populate("soilDeviceId");
      if (plant && plant.soilDeviceId && plant.soilDeviceId.devicetype === "soil") {
        const device: any = plant.soilDeviceId;
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
    const plantCacheKey = buildCacheKey('plant', userId);
    let plants = await getAllCache(plantCacheKey) ?? [];

    if (!plants || plants.length === 0) {
      plants = await Plant.find({ userId })
        .populate('pumpDeviceId')
        .populate('soilDeviceId');
    }

    await Promise.all(plants.map(async (plant) => {
      const actions: string[] = [];
      const dataLimit = await this.updateLimit(object, userId, plant._id);
      const { temperature, humidity, light, soil } = dataLimit;

      if (temperature == null || humidity == null || light == null || soil == null) {
        console.warn(`⚠️ Thiếu sensor dữ liệu cho plant ${plant._id}`);
        return;
      }

      const getScore = (val: number, ranges: [number, number, number][]) => {
        for (const [min, max, score] of ranges) {
          if (val >= min && val < max) return score;
        }
        return 0;
      };

      const tempScore = getScore(temperature, [[0,10,5], [10,20,10], [20,30,15], [30,40,20], [40,50,25],[50,Infinity,50]]);
      const lightScore = getScore(light, [[0,5,1], [5,10,2], [10,15,3], [15,20,4], [20,25,5], [25,30,6]]);
      const soilScore = getScore(soil, [[0,5,30], [5,10,25], [10,15,20], [15,20,15], [20,25,10], [25,30,5],[30,Infinity,0]]);
      const humidityScore = getScore(humidity, [[0,5,15], [5,10,10], [10,15,5],[15,Infinity,0]]);
      const fanScore = getScore(temperature, [[50,Infinity,80],[40, 50, 40], [30,40,20], [20,30,10], [10,20,5]]);

      const wateringScore = tempScore + lightScore + soilScore + humidityScore;

      if (wateringScore > (plant.limitWatering ?? 60)) {
        actions.push("TUOI NUOC");
      }

      if (fanScore > (plant.limitTemp ?? 20)) {
        actions.push("BAT QUAT");
      }

      let arr_status: string[] = [];
      if (actions.includes("TUOI NUOC")) arr_status.push("watering");
      if (actions.includes("BAT QUAT")) arr_status.push("fanning");
      if (arr_status.length === 0) arr_status.push("normal");

      if (!this.isSameArrayUnordered(arr_status, plant.status)) {
        const updated = {
          plantID: plant._id,
          status: arr_status,
          updateAt: new Date(),
        };
        changedPlants.push(updated);
        const singlePlantKey = buildCacheKey('plant', userId, plant._id.toString());
        const plantData = typeof plant.toObject === 'function' ? plant.toObject() : plant;
        setCache(singlePlantKey, { ...plantData, status: arr_status }, TTL);
        await Plant.findByIdAndUpdate(plant._id, { status: arr_status });
      }
    }));

    if (changedPlants.length > 0) {
      io.to(userId.toString()).emit("plant-status-update", changedPlants);
    }
  }
}
