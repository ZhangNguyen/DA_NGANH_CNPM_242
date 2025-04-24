export type DeviceType = "pump" | "fan_level" | "RGB" | "soil" | "light" | "humid_id" | "temp";
  
export interface Device {
    _id: number;
    name: string;
    devicetype: DeviceType;
    status: "active" | "deactive";
    value: number; // For controlling intensity, on/off state, etc.
}