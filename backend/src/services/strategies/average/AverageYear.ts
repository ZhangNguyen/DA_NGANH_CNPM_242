// import { AverageStrategy, AverageResult } from './AverageStrategy';
// import Sensor from '../../../models/SensorModel';
// import axios from 'axios';

// export class AverageYear implements AverageStrategy {
//   async calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult> {
//     const userId = user.id;
//     const referenceDate = options?.date || new Date();
//     const startOfYear = new Date(referenceDate.getFullYear(), 0, 1);
//     const endOfYear = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);

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

//         const yearData = data.filter((record: any) => {
//           const recordDate = new Date(record.created_at);
//           return recordDate >= startOfYear && recordDate <= endOfYear;
//         });

//         if (yearData.length) {
//           const sum = yearData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
//           totalValue += sum;
//           totalRecords += yearData.length;
//         }
//       } catch (error) {
//         console.error(`Error fetching data for sensor ${sensor.feedKey}:`, error);
//       }
//     }

//     if (totalRecords === 0) {
//       return { 
//         status: 'error', 
//         message: `No data found for year ${referenceDate.getFullYear()} for type ${type}` 
//       };
//     }

//     return {
//       status: 'success',
//       message: `Yearly average for ${type}`,
//       average: totalValue / totalRecords,
//       count: totalRecords,
//       period: `Year: ${referenceDate.getFullYear()}`
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

export class AverageYear implements AverageStrategy {
  async calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult> {
    const userId = user.id;
    const referenceDate = options?.date || new Date();
    const startOfYear = new Date(referenceDate.getFullYear(), 0, 1);
    const endOfYear = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);

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
              start_time: startOfYear.toISOString(),
              end_time: endOfYear.toISOString()
            }
          }
        );

        const yearData = data.filter((record: any) => {
          const recordDate = new Date(record.created_at);
          return recordDate >= startOfYear && recordDate <= endOfYear;
        });

        yearData.forEach((record: any) => {
          detailedData.push({
            timestamp: new Date(record.created_at),
            value: parseFloat(record.value),
            feedKey: sensor.feedKey,
            sensorId: sensor._id.toString()
          });
        });

        if (yearData.length) {
          const sum = yearData.reduce((acc: number, curr: any) => acc + parseFloat(curr.value), 0);
          totalValue += sum;
          totalRecords += yearData.length;
        }
      } catch (error) {
        console.error(`Error fetching data for sensor ${sensor.feedKey}:`, error);
      }
    }

    if (totalRecords === 0) {
      return { 
        status: 'error', 
        message: `No data found for year ${referenceDate.getFullYear()} for type ${type}` 
      };
    }

    return {
      status: 'success',
      message: `Yearly average for ${type}`,
      average: totalValue / totalRecords,
      count: totalRecords,
      period: `Year: ${referenceDate.getFullYear()}`,
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