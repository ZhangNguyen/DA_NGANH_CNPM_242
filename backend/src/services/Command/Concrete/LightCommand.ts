import { Command } from "../Command";
import { DeviceReceiver } from "../Receiver/DeviceReceiver";
export class LightCommand implements Command
{
    constructor(
        private receiver: DeviceReceiver,
        private deviceId: string
      ) {}
    async execute(value: number): Promise<void> {
          await this.receiver.sendCommand(this.deviceId, value);
      }
}