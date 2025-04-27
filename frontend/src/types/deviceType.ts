export type DeviceType = "pump" | "fan_level" | "RGB" | "soil" | "light";
export type SensorType = "light" | "humidity" | "temperature"

export interface Device {
    _id: number;
    name: string;
    devicetype: DeviceType;
    status: "active" | "deactive";
    value: number; // For controlling intensity, on/off state, etc.
}

export interface Sensor {
    _id: number;
    name: string;
    newestdata: number;
    status:  "active" | "deactive";
    type: SensorType;
}

export interface DeviceAndSensor {
    device: Device;
    sensor: Sensor;
}