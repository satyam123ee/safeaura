import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
