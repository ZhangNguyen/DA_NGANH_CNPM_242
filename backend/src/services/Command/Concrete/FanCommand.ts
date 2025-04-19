import { Command } from "../Command";
import { DeviceReceiver } from "../Receiver/DeviceReceiver";
export class FanCommand implements Command
{
    constructor(
        private receiver: DeviceReceiver,
        private deviceId: string
      ) {}
    async execute(value: number): Promise<void> {
          await this.receiver.sendCommand(this.deviceId, value);
      }
}