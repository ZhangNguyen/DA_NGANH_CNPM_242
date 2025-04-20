import { SensorObserver } from "./SensorObsever";
import Sensor from "../../models/SensorModel";
import DedicatedDevice from "../../models/DedicatedDevice";

export class SaveToDbObserver implements SensorObserver {
  async update(sensor: any): Promise<void> {
    try {
      if (!sensor?.type || !sensor?.user) {
        console.warn("❗ Thiếu dữ liệu sensor hoặc user");
        return;
      }

      // Nếu là sensor thường: humidity, temperature, light
      if (["humidity", "temperature", "light"].includes(sensor.type)) {
        await Sensor.findOneAndUpdate(
          { _id: sensor._id },
          {
            $set: {
              newestdata: parseFloat(sensor.newestdata),
              timeUpdate: new Date(),
            },
          },
          { upsert: true, new: true }
        );
      }

      // Nếu là thiết bị soil
      if (sensor.type === "soil") {
        await DedicatedDevice.findOneAndUpdate(
          { _id: sensor._id, type: "soil" },
          {
            $set: {
              value: parseFloat(sensor.value),
              timeAction: new Date(),
            },
          },
          { new: true }
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi lưu sensor vào DB:", error);
    }
  }
}
