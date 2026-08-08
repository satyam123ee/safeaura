import mongoose from 'mongoose';
import { COMMUNITY_ALERT_TYPES } from '../constants.js';

const communityAlertSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: false },
    type: { type: String, enum: COMMUNITY_ALERT_TYPES, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: String,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

communityAlertSchema.index({ location: '2dsphere' });

export default mongoose.model('CommunityAlert', communityAlertSchema);
