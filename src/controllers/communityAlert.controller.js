import CommunityAlert from '../models/communityAlert.model.js';

export const createCommunityAlert = async (req, res) => {
  try {
    const { title, type, latitude, longitude, address, description, isAnonymous } = req.body;
    const alert = await CommunityAlert.create({
      postedBy: isAnonymous ? null : req.userId,
      isAnonymous,
      type,
      title,
      description,
      location: { coordinates: [longitude, latitude], address },
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listCommunityAlerts = async (req, res) => {
  const { filter } = req.query;
  let query = {};

  if (filter === 'warnings') query.type = 'WARNING';
  else if (filter === 'safe_zones') query.type = 'SAFE_ZONE';
  else if (filter === 'nearby') {
    const user = await (await import('../models/user.model.js')).default.findById(req.userId);
    if (user?.lastKnownLocation?.coordinates?.[0]) {
      const [lng, lat] = user.lastKnownLocation.coordinates;
      query = {
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 5000,
          },
        },
      };
    }
  }

  const alerts = await CommunityAlert.find(query).sort({ createdAt: -1 }).limit(50);
  res.json(alerts);
};

export const likeAlert = async (req, res) => {
  const alert = await CommunityAlert.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  res.json(alert);
};
