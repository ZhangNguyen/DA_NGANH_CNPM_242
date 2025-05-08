
import { AverageStrategy } from './AverageStrategy';

export class AverageContext {
  private strategy: AverageStrategy;

  constructor(strategy: AverageStrategy) {
    this.strategy = strategy;
  }

  public async execute(user: any, type: string) {
    return this.strategy.calculate(user, type);
  }
}
