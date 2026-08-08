import TrustedContact from '../models/trustedContact.model.js';
import SafetyReport from '../models/safetyReport.model.js';

export const calculateSafetyScore = async (userId) => {
  const contactCount = await TrustedContact.countDocuments({ userId });
  const reportCount = await SafetyReport.countDocuments({ userId });
  let score = 50;
  score += Math.min(contactCount * 6, 30);
  score += Math.min(reportCount * 2, 10);
  score = Math.min(score, 100);
  return { score, contactCount, reportCount };
};
