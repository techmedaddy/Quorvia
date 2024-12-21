javascript
const { getRedisClient } = require('../config/redis.config');

class CacheService {
  constructor() {
    this.redisClient = getRedisClient();
  }

  async setCache(key, value, ttl = 3600) {
    try {
      if (!key || !value) {
        throw new Error('Cache key and value are required.');
      }
      await this.redisClient.set(key, JSON.stringify(value), {
        EX: ttl, // Expiry in seconds
      });
      console.log(`Cache set for key: ${key}`);
    } catch (error) {
      console.error('Error in setCache:', error.message);
      throw new Error(`Failed to set cache for key: ${key}. ${error.message}`);
    }
  }

  async getCache(key) {
    try {
      if (!key) {
        throw new Error('Cache key is required.');
      }
      const cachedValue = await this.redisClient.get(key);
      if (!cachedValue) {
        return null;
      }
      return JSON.parse(cachedValue);
    } catch (error) {
      console.error('Error in getCache:', error.message);
      throw new Error(`Failed to retrieve cache for key: ${key}. ${error.message}`);
    }
  }

  async deleteCache(key) {
    try {
      if (!key) {
        throw new Error('Cache key is required.');
      }
      await this.redisClient.del(key);
      console.log(`Cache deleted for key: ${key}`);
    } catch (error) {
      console.error('Error in deleteCache:', error.message);
      throw new Error(`Failed to delete cache for key: ${key}. ${error.message}`);
    }
  }

  async clearAllCache() {
    try {
      await this.redisClient.flushAll();
      console.log('All cache cleared.');
    } catch (error) {
      console.error('Error in clearAllCache:', error.message);
      throw new Error('Failed to clear all cache. Please try again later.');
    }
  }
}

module.exports = new CacheService();