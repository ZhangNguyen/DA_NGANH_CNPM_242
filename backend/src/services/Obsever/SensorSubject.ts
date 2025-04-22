import { SensorObserver } from "./SensorObsever";
import { get } from "http";
export class SensorSubject{
    private observers: SensorObserver[] = [];
    // private dataLimit: any = {
    //     soil: null,
    //     temperature: null,
    //     light: null
    //   };    
    public attach(observer: SensorObserver){
        this.observers.push(observer);
    }
    public detach(observer: SensorObserver){
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    

    public async notify(sensor: any): Promise<void>{
        const promises = this.observers.map(obsever =>{
            obsever.update(sensor);
        })
        await Promise.all(promises);
    }
}