import mongoose from 'mongoose';

const trustedContactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, default: 'Friend' },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('TrustedContact', trustedContactSchema);
