import { createClient } from 'redis';
import {REDIS_URL} from './envConfig';
const redisClient = createClient({url: REDIS_URL});

redisClient.on('error', (err) => console.error(' Redis Client Error:', err));
redisClient.on('connect', () => console.log(' Redis connected successfully'));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

export default redisClient;
