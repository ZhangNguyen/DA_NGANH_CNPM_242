import { Command } from "../Command";
import { DeviceReceiver } from "../Receiver/DeviceReceiver";
export class RGBCommand implements Command
{
    constructor(
        private receiver: DeviceReceiver,
        private deviceId: string
      ) {}
    async execute(value: number): Promise<void> {
        if (value !== 0 && value !== 1) {
            throw new Error("Invalid value for RGBCommand: must be 0 or 1");
          }
          await this.receiver.sendCommand(this.deviceId, value);
      }
}