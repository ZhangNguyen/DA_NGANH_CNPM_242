// // strategies/average/AverageMonth.ts
// import { AverageStrategy } from './AverageStrategy';
// import Sensor from '../../../models/SensorModel';
// import User from '../../../models/UserModel';
// import axios from 'axios';

// export class AverageMonth implements AverageStrategy {
//   async calculate(user: any, type: string) {
//     const userId = user.id;
//     const sensors = await Sensor.find({ user: userId, type });

//     if (!sensors || sensors.length === 0) {
//       return { status: 'error', message: `No sensors found for type ${type}` };
//     }

//     const { adafruit_username, adafruit_key } = user;
//     let totalValue = 0, totalRecords = 0;

//     for (const sensor of sensors) {
//       const feedKey = sensor.feedKey;
//       const { data } = await axios.get(`https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${feedKey}/data`);
//       const firstDayOfMonth = new Date(); firstDayOfMonth.setDate(1); firstDayOfMonth.setHours(0, 0, 0, 0);

//       const monthData = data.filter((record: any) => new Date(record.created_at) >= firstDayOfMonth);
//       if (!monthData.length) continue;

//       const sum = monthData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
//       totalValue += sum;
//       totalRecords += monthData.length;
//     }

//     if (totalRecords === 0) {
//       return { status: 'error', message: `No data found this month for type ${type}` };
//     }

//     return {
//       status: 'success',
//       message: `Month average for ${type} calculated`,
//       average: totalValue / totalRecords
//     };
//   }
// }



// import { AverageStrategy, AverageResult } from './AverageStrategy';
// import Sensor from '../../../models/SensorModel';
// import axios from 'axios';

// export class AverageMonth implements AverageStrategy {
//   async calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult> {
//     const userId = user.id;
//     const referenceDate = options?.date || new Date();
//     const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
//     const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);

//     const sensors = await Sensor.find({ user: userId, type });
//     if (!sensors.length) {
//       return { status: 'error', message: `No sensors found for type ${type}` };
//     }

//     const { adafruit_username, adafruit_key } = user;
//     let totalValue = 0, totalRecords = 0;

//     for (const sensor of sensors) {
//       try {
//         const { data } = await axios.get(
//           `https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${sensor.feedKey}/data`,
//           { headers: { 'X-AIO-Key': adafruit_key } }
//         );

//         const monthData = data.filter((record: any) => {
//           const recordDate = new Date(record.created_at);
//           return recordDate >= startOfMonth && recordDate <= endOfMonth;
//         });

//         if (monthData.length) {
//           const sum = monthData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
//           totalValue += sum;
//           totalRecords += monthData.length;
//         }
//       } catch (error) {
//         console.error(`Error fetching data for sensor ${sensor.feedKey}:`, error);
//       }
//     }

//     if (totalRecords === 0) {
//       return { 
//         status: 'error', 
//         message: `No data found for ${referenceDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })} for type ${type}` 
//       };
//     }

//     return {
//       status: 'success',
//       message: `Monthly average for ${type}`,
//       average: totalValue / totalRecords,
//       count: totalRecords,
//       period: `Month: ${referenceDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
//     };
//   }
// }


import { AverageStrategy, AverageResult } from './AverageStrategy';
import Sensor from '../../../models/SensorModel';
import axios from 'axios';

interface StatisticData {
  timestamp: Date;
  value: number;
  feedKey: string;
  sensorId: string;
}

export class AverageMonth implements AverageStrategy {
  async calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult> {
    const userId = user.id;
    const referenceDate = options?.date || new Date();
    const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const sensors = await Sensor.find({ user: userId, type });
    if (!sensors.length) {
      return { status: 'error', message: `No sensors found for type ${type}` };
    }

    const { adafruit_username, adafruit_key } = user;
    let totalValue = 0, totalRecords = 0;
    const detailedData: StatisticData[] = [];

    for (const sensor of sensors) {
      try {
        const { data } = await axios.get(
          `https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${sensor.feedKey}/data`,
          { 
            headers: { 'X-AIO-Key': adafruit_key },
            params: {
              start_time: startOfMonth.toISOString(),
              end_time: endOfMonth.toISOString()
            }
          }
        );

        const monthData = data.filter((record: any) => {
          const recordDate = new Date(record.created_at);
          return recordDate >= startOfMonth && recordDate <= endOfMonth;
        });

        monthData.forEach((record: any) => {
          detailedData.push({
            timestamp: new Date(record.created_at),
            value: parseFloat(record.value),
            feedKey: sensor.feedKey,
            sensorId: sensor._id.toString()
          });
        });

        if (monthData.length) {
          const sum = monthData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
          totalValue += sum;
          totalRecords += monthData.length;
        }
      } catch (error) {
        console.error(`Error fetching data for sensor ${sensor.feedKey}:`, error);
      }
    }

    if (totalRecords === 0) {
      return { 
        status: 'error', 
        message: `No data found for ${referenceDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })} for type ${type}` 
      };
    }

    return {
      status: 'success',
      message: `Monthly average for ${type}`,
      average: totalValue / totalRecords,
      count: totalRecords,
      period: `Month: ${referenceDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`,
      statistics: {
        total: totalValue,
        dataPoints: detailedData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        summary: {
          min: Math.min(...detailedData.map(d => d.value)),
          max: Math.max(...detailedData.map(d => d.value)),
          median: this.calculateMedian(detailedData.map(d => d.value))
        }
      }
    };
  }

  private calculateMedian(values: number[]): number {
    if (!values.length) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0 
      ? (sorted[middle - 1] + sorted[middle]) / 2 
      : sorted[middle];
  }
}