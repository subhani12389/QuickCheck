const express = require('express');
const store = require('../db/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/admin/stats
 */
router.get('/stats', authMiddleware, requireRole(['admin']), (req, res) => {
  const allVerifications = store.getAllVerifications();
  const allCertificates = store.getAllCertificates();
  const allOrgs = store.getAllOrgs();
  const allLogs = store.getAllAuditLogs();

  const originalCount = allVerifications.filter(v => v.verdict === 'Original').length;
  const suspiciousCount = allVerifications.filter(v => v.verdict === 'Suspicious').length;
  const fakeCount = allVerifications.filter(v => v.verdict === 'Fake').length;

  return res.json({
    totalVerifications: allVerifications.length,
    originalCount,
    suspiciousCount,
    fakeCount,
    totalCertificates: allCertificates.length,
    totalOrganizations: allOrgs.length,
    totalAuditLogs: allLogs.length,
    verdictBreakdown: [
      { name: 'Original', value: originalCount, color: '#10b981' },
      { name: 'Suspicious', value: suspiciousCount, color: '#f59e0b' },
      { name: 'Fake', value: fakeCount, color: '#ef4444' }
    ]
  });
});

/**
 * GET /api/admin/orgs
 */
router.get('/orgs', authMiddleware, requireRole(['admin']), (req, res) => {
  const orgs = store.getAllOrgs();
  return res.json({ organizations: orgs });
});

/**
 * GET /api/admin/logs
 */
router.get('/logs', authMiddleware, requireRole(['admin']), (req, res) => {
  const logs = store.getAllAuditLogs();
  return res.json({ auditLogs: logs });
});

module.exports = router;
