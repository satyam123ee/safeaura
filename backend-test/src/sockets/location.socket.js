import User from '../models/user.model.js';

export const registerLocationHandlers = (io, socket) => {
  socket.on('location:update', async ({ lat, lng }) => {
    await User.findByIdAndUpdate(socket.userId, {
      lastKnownLocation: { coordinates: [lng, lat], updatedAt: new Date() },
    });
    io.to(socket.userId).emit('location:broadcast', { userId: socket.userId, lat, lng });
  });
};
