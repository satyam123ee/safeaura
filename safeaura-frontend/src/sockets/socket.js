import { io } from 'socket.io-client';

export const connectSocket = () => {
  const token = localStorage.getItem('safeaura_token');
  return io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
};
