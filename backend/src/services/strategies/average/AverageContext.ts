// import { AverageStrategy } from './AverageStrategy';

// export class AverageContext {
//   private strategy: AverageStrategy;

//   constructor(strategy: AverageStrategy) {
//     this.strategy = strategy;
//   }

//   public async execute(user: any, type: string) {
//     return this.strategy.calculate(user, type);
//   }
// }

import { AverageStrategy, AverageResult } from './AverageStrategy';

export class AverageContext {
  constructor(private strategy: AverageStrategy) {}

  public async execute(user: any, type: string, options?: { date?: Date }): Promise<AverageResult> {
    try {
      return await this.strategy.calculate(user, type, options);
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
}