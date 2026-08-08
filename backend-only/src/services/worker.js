import { redisClient, connectRedis } from '../config/redis.js';

if (redisClient) {
  import('bullmq').then(({ Worker }) => {
    connectRedis()
      .then(() => {
        new Worker(
          'notifications',
          async (job) => {
            console.log('Processing job:', job.name, job.data);
          },
          { connection: redisClient }
        );
        console.log('Notification worker started');
      })
      .catch(() => console.warn('Worker: Redis not available'));
  });
}
