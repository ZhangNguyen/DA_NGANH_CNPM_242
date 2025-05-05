// AverageStrategyFactory.ts
import { AverageStrategy } from './AverageStrategy';
import { AverageDay } from './AverageDay';
import { AverageMonth } from './AverageMonth';
import { AverageYear } from './AverageYear';

export class AverageStrategyFactory {
  static createStrategy(period: 'day' | 'month' | 'year'): AverageStrategy {
    switch (period) {
      case 'day':
        return new AverageDay();
      case 'month':
        return new AverageMonth();
      case 'year':
        return new AverageYear();
      default:
        throw new Error(`Unsupported period: ${period}`);
    }
  }
}