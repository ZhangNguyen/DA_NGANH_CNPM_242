export interface SensorObserver {
    update(sensor:any): Promise<void>;
}
