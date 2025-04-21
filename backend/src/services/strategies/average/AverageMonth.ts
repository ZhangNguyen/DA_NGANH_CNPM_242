// strategies/average/AverageMonth.ts
import { AverageStrategy } from './AverageStrategy';
import Sensor from '../../../models/SensorModel';
import User from '../../../models/UserModel';
import axios from 'axios';

export class AverageMonth implements AverageStrategy {
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
      const firstDayOfMonth = new Date(); firstDayOfMonth.setDate(1); firstDayOfMonth.setHours(0, 0, 0, 0);

      const monthData = data.filter((record: any) => new Date(record.created_at) >= firstDayOfMonth);
      if (!monthData.length) continue;

      const sum = monthData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
      totalValue += sum;
      totalRecords += monthData.length;
    }

    if (totalRecords === 0) {
      return { status: 'error', message: `No data found this month for type ${type}` };
    }

    return {
      status: 'success',
      message: `Month average for ${type} calculated`,
      average: totalValue / totalRecords
    };
  }
}
