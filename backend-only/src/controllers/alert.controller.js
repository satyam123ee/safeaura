import EmergencyAlert from '../models/emergencyAlert.model.js';
import User from '../models/user.model.js';
import { queueSOSNotification } from '../services/queue.service.js';

export const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, address, description } = req.body;
    const alert = await EmergencyAlert.create({
      userId: req.userId,
      alertType: 'SOS',
      location: { coordinates: [longitude, latitude], address },
      description,
    });
    await User.findByIdAndUpdate(req.userId, { $inc: { sosUsedCount: 1 } });
    await queueSOSNotification(alert._id, req.userId);
    res.status(201).json({ message: 'SOS sent to trusted contacts', alert });
  } catch (err) {
    next(err);
  }
};

export const listAlerts = async (req, res) => {
  const alerts = await EmergencyAlert.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(alerts);
};

export const cancelAlert = async (req, res) => {
  const alert = await EmergencyAlert.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: 'CANCELLED' },
    { new: true }
  );
  res.json(alert);
};
