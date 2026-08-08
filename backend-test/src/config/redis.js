import Redis from 'ioredis';

let redisClient = null;
let _connectPromise = null;

if (process.env.REDIS_URL !== 'false') {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy: () => null,
  });
  redisClient.on('connect', () => console.log('Redis Connected'));
  redisClient.on('error', (err) => {
    console.warn('Redis error:', err && err.message);
    // queue behavior is optional — handled by services that use Redis
  });
}

// Centralized connect logic to avoid multiple concurrent connect calls
export const connectRedis = async () => {
  if (!redisClient) return null;
  if (_connectPromise) return _connectPromise;
  _connectPromise = redisClient.connect().catch((err) => {
    _connectPromise = null;
    throw err;
  });
  return _connectPromise;
};

export { redisClient };
