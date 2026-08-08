import dotenv from 'dotenv';
dotenv.config();

// Fail fast if critical secrets are missing — prevents unpredictable runtime errors later.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable not set. Exiting.');
  process.exit(1);
}

import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { redisClient } from './config/redis.js';
import { initSocket } from './sockets/index.js';
import CommunityAlert from './models/communityAlert.model.js';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

export const io = initSocket(server);

const seedCommunityAlerts = async () => {
  const count = await CommunityAlert.countDocuments();
  if (count > 0) return;

  await CommunityAlert.insertMany([
    {
      type: 'WARNING',
      title: 'Suspicious activity reported near MG Road',
      description: 'Multiple users reported feeling unsafe after dark.',
      location: { coordinates: [77.5946, 12.9716], address: 'MG Road, Bangalore' },
      likes: 24,
      isAnonymous: true,
    },
    {
      type: 'SAFE_ZONE',
      title: 'Well-lit area with security patrol',
      description: 'Regular police patrols in this area.',
      location: { coordinates: [77.6101, 12.9352], address: 'Koramangala, Bangalore' },
      likes: 18,
      isAnonymous: true,
    },
    {
      type: 'INFO',
      title: 'Women helpline awareness drive',
      description: 'Free safety workshops this weekend.',
      location: { coordinates: [77.566, 12.9784], address: 'Indiranagar, Bangalore' },
      likes: 42,
      isAnonymous: true,
    },
  ]);
  console.log('Seeded sample community alerts');
};

connectDB()
  .then(async () => {
    if (redisClient) {
      try {
        await redisClient.connect();
      } catch {
        console.warn('Redis not available — queue disabled');
      }
    }
    await seedCommunityAlerts();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
