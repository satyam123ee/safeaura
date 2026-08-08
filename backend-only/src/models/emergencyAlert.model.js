import mongoose from 'mongoose';
import { ALERT_TYPES, ALERT_STATUS } from '../constants.js';

const emergencyAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alertType: { type: String, enum: ALERT_TYPES, default: 'SOS' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: String,
    },
    description: String,
    mediaUrl: [String],
    status: { type: String, enum: ALERT_STATUS, default: 'ACTIVE' },
  },
  { timestamps: true }
);

emergencyAlertSchema.index({ location: '2dsphere' });

export default mongoose.model('EmergencyAlert', emergencyAlertSchema);
