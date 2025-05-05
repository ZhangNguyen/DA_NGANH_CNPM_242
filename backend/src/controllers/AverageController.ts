import { Request, Response, NextFunction } from 'express';
import { AverageContext } from '../services/strategies/average/AverageContext';
import { AverageStrategyFactory } from '../services/strategies/average/AverageStrategyFactory';

// Chuyển từ class sang object export
module.exports = {
    getAverage: async (req: Request, res: Response, next: NextFunction) => {
        const { type, period } = req.params;
        const { date } = req.query;
        
        try {
            const referenceDate = date ? new Date(date as string) : new Date();
            if (isNaN(referenceDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            const strategy = AverageStrategyFactory.createStrategy(period as 'day' | 'month' | 'year');
            const context = new AverageContext(strategy);
            const result = await context.execute(req.user, type, { date: referenceDate });

            if (result.status === 'error') {
                return res.status(404).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};
