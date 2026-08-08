import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    // phone is optional to support OAuth users who may not provide a phone number
    phone: { type: String, required: false },
    // password is required only for local accounts (non-OAuth)
    password: { type: String, required: function () { return !this.provider; }, minlength: 6, select: false },
    // OAuth provider info
    provider: { type: String },
    providerId: { type: String },
    profilePicture: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    emergencyContacts: [{ name: String, phone: String, relation: String }],
    lastKnownLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      updatedAt: Date,
    },
    sosUsedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ lastKnownLocation: '2dsphere' });
// Sparse unique index for phone (only enforced when phone is present)
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
// Ensure a provider+providerId pair is unique for OAuth users
userSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  // OAuth accounts may not have a password; handle that case explicitly.
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
