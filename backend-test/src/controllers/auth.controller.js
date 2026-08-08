import User from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

export const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    const user = await User.create({ fullName, email, phone, password });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  if (!googleClient) return res.status(501).json({ error: 'Google Sign-In not configured' });
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    // Prefer matching by providerId if available, fallback to email match
    let user = await User.findOne({ $or: [{ provider: 'google', providerId: payload.sub }, { email: payload.email }] });

    if (!user) {
      // Create a user record that records provider info instead of setting a local password.
      user = await User.create({
        fullName: payload.name,
        email: payload.email,
        provider: 'google',
        providerId: payload.sub,
        isVerified: true,
      });
    } else if (user && !user.provider) {
      // Existing local account with same email exists. Do not auto-link or overwrite credentials.
      // Consider returning an informative error so client can offer account linking.
      return res.status(409).json({ error: 'Account with this email exists. Please login with your credentials and link Google from profile.' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
