// export interface AverageStrategy {
//     calculate(user: any, type: string): Promise<any>;
//   }

// export interface AverageStrategy {
//   calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult>;
// }

// export interface AverageResult {
//   status: 'success' | 'error';
//   message: string;
//   average?: number;
//   count?: number;
//   period?: string;
// }
export interface StatisticDataPoint {
  timestamp: Date;
  value: number;
  feedKey: string;
  sensorId: string;
  sensorName?: string;
  location?: string;
}

export interface StatisticsSummary {
  min: number;
  max: number;
  median: number;
  firstQuartile?: number;
  thirdQuartile?: number;
  standardDeviation?: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AverageResult {
  status: 'success' | 'error';
  message: string;
  average?: number;
  count?: number;
  period?: string;
  timeRange?: TimeRange;
  statistics?: {
    total: number;
    dataPoints: StatisticDataPoint[];
    summary: StatisticsSummary;
    hourlyAverages?: { hour: number; average: number }[];
    trends?: {
      increasing: boolean;
      rate?: number;
    };
  };
  metadata?: {
    sensorType: string;
    unit?: string;
    precision?: number;
  };
}

export interface AverageStrategy {
  calculate(user: any, type: string, options?: { date?: Date }): Promise<AverageResult>;
}