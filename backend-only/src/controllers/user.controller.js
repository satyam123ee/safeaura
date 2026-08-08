import { calculateSafetyScore } from '../services/safetyScore.service.js';

export const getSafetyScore = async (req, res) => {
  const result = await calculateSafetyScore(req.userId);
  res.json(result);
};
