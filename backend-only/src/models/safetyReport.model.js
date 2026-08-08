import mongoose from 'mongoose';

const safetyReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    incidentType: { type: String, required: true },
    description: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      address: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SafetyReport', safetyReportSchema);
