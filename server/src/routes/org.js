const express = require('express');
const crypto = require('crypto');
const store = require('../db/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/org/certificates
 */
router.get('/certificates', authMiddleware, requireRole(['organization', 'admin']), (req, res) => {
  const orgId = req.user.orgId || 'org-1';
  const certs = store.getCertificatesByOrg(orgId);
  return res.json({ certificates: certs });
});

/**
 * POST /api/org/certificates
 * Register new official original certificate
 */
router.post('/certificates', authMiddleware, requireRole(['organization', 'admin']), (req, res) => {
  try {
    const { certificateId, holderName, courseAward, issueDate, signatoryName, templateUrl } = req.body;

    if (!certificateId || !holderName || !courseAward) {
      return res.status(400).json({ error: 'Certificate ID, Holder Name, and Course/Award are required' });
    }

    const existing = store.findCertByCertId(certificateId);
    if (existing) {
      return res.status(400).json({ error: `Certificate ID '${certificateId}' is already registered.` });
    }

    const orgId = req.user.orgId || 'org-1';
    const org = store.findOrgById(orgId) || { name: 'Official Organization' };

    const docString = `${certificateId}-${holderName}-${org.name}`;
    const documentHash = crypto.createHash('sha256').update(docString).digest('hex');

    const newCert = {
      id: 'cert-' + Date.now(),
      certificateId,
      holderName,
      courseAward,
      orgId,
      orgName: org.name,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      signatoryName: signatoryName || org.signatoryName || 'Authorized Registrar',
      documentHash,
      templateUrl: templateUrl || 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    store.addCertificate(newCert);
    store.logAudit(req.user.id, req.user.email, 'CREATE_CERTIFICATE', `Registered official certificate ${certificateId} for ${holderName}`);

    return res.json({ certificate: newCert });
  } catch (err) {
    console.error('Create cert error:', err);
    return res.status(500).json({ error: 'Failed to register certificate' });
  }
});

/**
 * PATCH /api/org/certificates/:id/review
 * Manual review approval or rejection for suspicious verification cases
 */
router.patch('/certificates/:id/review', authMiddleware, requireRole(['organization', 'admin']), (req, res) => {
  try {
    const { action, reviewNotes } = req.body; // action: 'approve' | 'reject'
    const verificationId = req.params.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or reject' });
    }

    const verdict = action === 'approve' ? 'Original' : 'Fake';
    const score = action === 'approve' ? 95 : 10;

    const updated = store.updateVerificationStatus(verificationId, verdict, score, reviewNotes);
    if (!updated) {
      return res.status(404).json({ error: 'Verification request not found' });
    }

    store.logAudit(
      req.user.id,
      req.user.email,
      'MANUAL_REVIEW',
      `Manual review of ${verificationId}: ${action.toUpperCase()}D (${verdict})`
    );

    return res.json({ message: `Verification request ${action}d successfully`, result: updated });
  } catch (err) {
    console.error('Review error:', err);
    return res.status(500).json({ error: 'Failed to process review' });
  }
});

/**
 * GET /api/org/stats
 */
router.get('/stats', authMiddleware, requireRole(['organization', 'admin']), (req, res) => {
  const orgId = req.user.orgId || 'org-1';
  const certs = store.getCertificatesByOrg(orgId);
  const allVerifications = store.getAllVerifications();

  const totalIssued = certs.length;
  const activeCount = certs.filter(c => c.status === 'active').length;
  const revokedCount = certs.filter(c => c.status === 'revoked').length;

  const verifiedCount = allVerifications.filter(v => v.verdict === 'Original').length;
  const suspiciousCount = allVerifications.filter(v => v.verdict === 'Suspicious').length;

  return res.json({
    totalIssued,
    activeCount,
    revokedCount,
    verifiedCount,
    suspiciousCount,
    pendingReviews: suspiciousCount
  });
});

module.exports = router;
