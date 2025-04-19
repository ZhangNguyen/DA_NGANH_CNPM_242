import axios from "axios";
import ActionDevice from "../../../models/ActionDevice";
export class DeviceReceiver {
    constructor(
        private username: string,
        private aioKey: string
      ) {}
    async sendCommand(deviceId: string, value: number) {
      const device = await ActionDevice.findById(deviceId);
      if (!device || device.status === "inactive") {
        console.warn(`Device ${deviceId} is inactive or not found.`);
        return;
      }
      const feed_key = device.feed_key;
      const url = `https://io.adafruit.com/api/v2/${this.username}/feeds/${feed_key}/data`;
    await axios.post(url, { value }, {
      headers: { "X-AIO-Key": this.aioKey }
    });
    console.log(`✅ Sent ${value} → ${feed_key}`);
    }
  }
  