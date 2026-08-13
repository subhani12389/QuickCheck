const express = require('express');
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/user/history
 */
router.get('/history', authMiddleware, (req, res) => {
  const userVerifications = store.getVerificationsByUser(req.user.id);
  return res.json({ verifications: userVerifications });
});

/**
 * GET /api/user/stats
 */
router.get('/stats', authMiddleware, (req, res) => {
  const userVerifications = store.getVerificationsByUser(req.user.id);
  
  const total = userVerifications.length;
  const original = userVerifications.filter(v => v.verdict === 'Original').length;
  const suspicious = userVerifications.filter(v => v.verdict === 'Suspicious').length;
  const fake = userVerifications.filter(v => v.verdict === 'Fake').length;

  return res.json({
    totalVerifications: total,
    originalCount: original,
    suspiciousCount: suspicious,
    fakeCount: fake,
    recentVerifications: userVerifications.slice(0, 5)
  });
});

module.exports = router;
