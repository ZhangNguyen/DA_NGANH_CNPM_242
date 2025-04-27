import { DeviceType, SensorType } from "./deviceType"

// Define interfaces for socket data
export interface SensorData {
  _id?: number;
  type?: SensorType;
  newestdata?: number;
}

export interface SoilData {
  _id?: number;
  devicetype?: DeviceType;
  type?: string;
  value?: number;
}

export interface PlantStatusData {
  // Define properties for plant status updates
  [key: string]: any;
}