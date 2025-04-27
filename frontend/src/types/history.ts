export interface ActionDevice {
    _id: number;
    type: string;
    devicetype: string;
    name: string;
    status: string;
    value: number;
    timeAction: string;
    feed_key: string;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
  
export interface Plant {
    _id: string;
    userId: string;
    type: string;
    location: string;
    limitWatering: number;
    limitTemp: number;
    status: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    pumpDeviceId: number;
}
  
export interface CommandHistoryItem {
    _id: string;
    value: number;
    actiondevice: ActionDevice;
    status: string;
    action: string;
    timeaction: string;
    plantId: Plant | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}