import User from "../../models/UserModel"
import { DeviceReceiver } from "./Receiver/DeviceReceiver";
import { CommandInvoker } from "./Invoker";
import { WaterCommand } from "./Concrete/WaterCommand";
import { RGBCommand } from "./Concrete/RGBCommand";
import { PoweroffCommand } from "./Concrete/PoweroffCommand";
import { LightCommand } from "./Concrete/LightCommand";
import { FanCommand } from "./Concrete/FanCommand";
export const Plant_IsWatering = async (deviceId: string,user: any,value: number) =>
{
    const {adafruit_username,adafruit_key} = user;
    const receiver = new DeviceReceiver(adafruit_username,adafruit_key);
    const command = new WaterCommand(receiver,deviceId);
    const invoker = new CommandInvoker();
    invoker.runCommand(command,value);
}
export const RGB = async (deviceId: string,user: any,value: number) =>
    {
        //rảnh thì cải tiến chỗ này dùng session lưu {adafruit_username,adafruit_key}nha 
        const {adafruit_username,adafruit_key} = user;
        const receiver = new DeviceReceiver(adafruit_username,adafruit_key);
        const command = new RGBCommand(receiver,deviceId);
        const invoker = new CommandInvoker();
        invoker.runCommand(command,value);
    }
export const Poweroff = async (deviceId: string,user: any,value: number) =>
        {
            //rảnh thì cải tiến chỗ này dùng session lưu {adafruit_username,adafruit_key}nha 
            const {adafruit_username,adafruit_key} = user;
            const receiver = new DeviceReceiver(adafruit_username,adafruit_key);
            const command = new PoweroffCommand(receiver,deviceId);
            const invoker = new CommandInvoker();
            invoker.runCommand(command,value);
        }
export const Light = async (deviceId: string,user: any,value: number) =>
            {
                //rảnh thì cải tiến chỗ này dùng session lưu {adafruit_username,adafruit_key}nha 
                const {adafruit_username,adafruit_key} = user;
                const receiver = new DeviceReceiver(adafruit_username,adafruit_key);
                const command = new LightCommand(receiver,deviceId);
                const invoker = new CommandInvoker();
                invoker.runCommand(command,value);
            }
export const Fan = async (deviceId: string,user: any,value: number) =>
                {
                    //rảnh thì cải tiến chỗ này dùng session lưu {adafruit_username,adafruit_key}nha 
                    const {adafruit_username,adafruit_key} = user;
                    const receiver = new DeviceReceiver(adafruit_username,adafruit_key);
                    const command = new FanCommand(receiver,deviceId);
                    const invoker = new CommandInvoker();
                    invoker.runCommand(command,value);
                }