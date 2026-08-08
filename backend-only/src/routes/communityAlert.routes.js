import { Router } from 'express';
import {
  createCommunityAlert,
  listCommunityAlerts,
  likeAlert,
} from '../controllers/communityAlert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/', createCommunityAlert);
router.get('/', listCommunityAlerts);
router.post('/:id/like', likeAlert);

export default router;
