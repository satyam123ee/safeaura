import { Router } from 'express';
import { triggerSOS, listAlerts, cancelAlert } from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/sos', triggerSOS);
router.get('/', listAlerts);
router.patch('/:id/cancel', cancelAlert);

export default router;
