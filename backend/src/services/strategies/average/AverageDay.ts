import { AverageStrategy } from './AverageStrategy';
import Sensor from '../../../models/SensorModel';
import User from '../../../models/UserModel';
import axios from 'axios';

export class AverageDay implements AverageStrategy {
  async calculate(user: any, type: string) {
    const userId = user.id;
    const sensors = await Sensor.find({ user: userId, type });

    if (!sensors || sensors.length === 0) {
      return { status: 'error', message: `No sensors found for type ${type}` };
    }

    const { adafruit_username, adafruit_key } = user;
    let totalValue = 0, totalRecords = 0;

    for (const sensor of sensors) {
      const feedKey = sensor.feedKey;
      const { data } = await axios.get(`https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${feedKey}/data`);
      const today = new Date(); today.setHours(0, 0, 0, 0);

      const todayData = data.filter((record: any) => new Date(record.created_at) >= today);
      if (!todayData.length) continue;

      const sum = todayData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
      totalValue += sum;
      totalRecords += todayData.length;
    }

    if (totalRecords === 0) {
      return { status: 'error', message: `No data found today for type ${type}` };
    }

    return {
      status: 'success',
      message: `Day average for ${type} calculated`,
      average: totalValue / totalRecords
    };
  }
}