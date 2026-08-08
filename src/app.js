import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import alertRoutes from './routes/alert.routes.js';
import communityAlertRoutes from './routes/communityAlert.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

app.use(helmet());
// Configure CORS securely: allow credentialed requests only when a specific CLIENT_URL is configured.
const clientUrl = process.env.CLIENT_URL;
if (clientUrl) {
  app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, mobile) with no origin
      if (!origin) return callback(null, true);
      callback(null, origin === clientUrl);
    },
    credentials: true,
  }));
} else {
  // No client URL configured: allow public, credential-less access
  app.use(cors({ origin: '*', credentials: false }));
}
app.use(compression());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/', (req, res) => res.json({ message: 'SafeAura API running' }));
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/community-alerts', communityAlertRoutes);
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

export default app;
