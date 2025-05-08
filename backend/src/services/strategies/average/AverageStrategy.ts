export interface AverageStrategy {
  calculate(user: any, type: string): Promise<any>;
}
