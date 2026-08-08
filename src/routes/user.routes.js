import { Router } from 'express';
import { getSafetyScore } from '../controllers/user.controller.js';
import { findNearbyPolice } from '../services/places.service.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/safety-score', getSafetyScore);
router.get('/nearby-police', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
    const stations = await findNearbyPolice(parseFloat(lat), parseFloat(lng));
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
