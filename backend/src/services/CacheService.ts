import redisClient from "../config/redisClient";
export const setCache = async (key: string, value: any, expiration: number) => {
    try {
        await redisClient.setEx(key, expiration, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting cache:", error);
    }
}
// Get cache by specific key
export const getCache = async (key: string) => {
    try {
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
        console.error("Error getting cache:", error);
        return null;
    }
}
export const buildCacheKey = (prefix: string, userId: string, id?: string) => {
    return id
      ? `${prefix}:user:${userId}:${id}`          // specific plant
      : `${prefix}:user:${userId}:*`;             // all plants of user
  };
// Delete a specific cache key
export const deleteCache = async (key: string) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error("Error deleting cache:", error);
    }
}
// Clear for userID
export const clearUserCache = async (prefix: string, userId: string) => {
    try {
      const pattern = buildCacheKey(prefix, userId);
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error("Error clearing user cache:", error);
    }
  };
export const getAllCache = async (key:string) => {
    try {
        const keys = await redisClient.keys(key);
        if (keys.length > 0) {
            const values = await Promise.all(keys.map(async (k) => {
                const value = await redisClient.get(k);
                return value ? JSON.parse(value) : null;
            }));
            return values.filter(value => value !== null);
        }
    }
    catch (error) {
        console.error("Error getting all cache:", error);
    }
}
    