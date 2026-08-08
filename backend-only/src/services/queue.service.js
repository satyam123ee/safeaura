import { redisClient, connectRedis } from '../config/redis.js';

let notificationQueue = null;

export const getNotificationQueue = async () => {
  if (notificationQueue) return notificationQueue;
  if (!redisClient) return null;
  try {
    await connectRedis();
    const { Queue } = await import('bullmq');
    // Passing the ioredis client instance is supported; reuse the client to avoid extra connections
    notificationQueue = new Queue('notifications', { connection: redisClient });
    return notificationQueue;
  } catch (err) {
    console.warn('Failed to create notification queue:', err && err.message);
    return null;
  }
};

export const queueSOSNotification = async (alertId, userId) => {
  const queue = await getNotificationQueue();
  if (queue) {
    await queue.add('sos-alert', { alertId, userId });
  } else {
    console.log('SOS triggered (no queue):', alertId);
  }
};
