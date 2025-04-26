import { DeviceType } from "./deviceType"

// Define interfaces for socket data
export interface SensorData {
  _id?: number;
  devicetype?: DeviceType;
  type?: string;
  value?: number;
  // Add any other fields you might receive
}

export interface SoilData {
  _id?: number;
  devicetype?: DeviceType;
  type?: string;
  value?: number;
  // Add any other fields you might receive
}

export interface PlantStatusData {
  // Define properties for plant status updates
  [key: string]: any;
}