const redis = require('redis');

let redisClient;

async function connectToRedis() {
  try {
    redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
      throw new Error('Failed to connect to Redis. Please check your Redis configuration.');
    });

    await redisClient.connect();
    console.log('Connected to Redis successfully.');
  } catch (error) {
    console.error('Error connecting to Redis:', error.message);
    throw new Error('Failed to connect to Redis. Please ensure the service is running and accessible.');
  }
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client is not initialized. Call connectToRedis first.');
  }
  return redisClient;
}

module.exports = {
  connectToRedis,
  getRedisClient,
};