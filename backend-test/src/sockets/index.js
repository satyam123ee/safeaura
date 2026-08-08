import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerLocationHandlers } from './location.socket.js';

export const initSocket = (server) => {
  // Configure socket CORS securely. Allow credentials only when CLIENT_URL is configured.
  const clientUrl = process.env.CLIENT_URL;
  const io = new Server(server, {
    cors: clientUrl
      ? { origin: (origin, callback) => { if (!origin) return callback(null, true); callback(null, origin === clientUrl); }, credentials: true }
      : { origin: '*', credentials: false },
  });

  io.use((socket, next) => {
    // Validate server-side configuration first
    if (!process.env.JWT_SECRET) {
      return next(new Error('Server not configured: auth unavailable'));
    }

    const token = socket.handshake?.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.userId);
    socket.join(socket.userId);
    registerLocationHandlers(io, socket);
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.userId));
  });

  return io;
};
