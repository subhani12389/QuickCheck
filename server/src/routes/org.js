const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const store = require('../db/store');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { analyzeCertificateDocument } = require('../services/aiService');

const router = express.Router();

// On Vercel Serverless, use OS temp directory (/tmp)
const uploadDir = process.env.VERCEL === '1'
  ? os.tmpdir()
  : path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `portal-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * GET /api/org/portal/:orgIdOrCode
 * Public endpoint to fetch organization branding for student portal
 */
router.get('/portal/:orgIdOrCode', (req, res) => {
  const param = req.params.orgIdOrCode.toUpperCase();
  const orgs = store.getAllOrgs();
  const org = orgs.find(o => o.id === req.params.orgIdOrCode || o.code === param || o.id === `org-${req.params.orgIdOrCode}`);
  
  if (!org) {
    return res.status(404).json({ error: 'Organization portal not found' });
  }

  return res.json({
    organization: {
      id: org.id,
      name: org.name,
      code: org.code,
      website: org.website,
      contactEmail: org.contactEmail,
      signatoryName: org.signatoryName,
      logoUrl: org.logoUrl
    }
  });
});

/**
 * POST /api/org/portal-verify/:orgIdOrCode
 * Student submits certificate document via Organization Verification Portal Link
 */
router.post('/portal-verify/:orgIdOrCode', upload.single('file'), async (req, res) => {
  try {
    const param = req.params.orgIdOrCode.toUpperCase();
    const orgs = store.getAllOrgs();
    const org = orgs.find(o => o.id === req.params.orgIdOrCode || o.code === param || o.id === `org-${req.params.orgIdOrCode}`);

    if (!org) {
      return res.status(404).json({ error: 'Invalid organization verification link' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please select a certificate PDF or image document to upload' });
    }

    const { studentName, studentEmail, certificateId, courseAward } = req.body;

    if (!studentName || !studentEmail) {
      return res.status(400).json({ error: 'Student Name and Email Address are required' });
    }

    const userInputs = {
      certificateId,
      holderName: studentName,
      issuerName: org.name,
      courseAward
    };

    // Run AI analysis pipeline
    const aiResult = await analyzeCertificateDocument(req.file.path, req.file.originalname, userInputs);

    const resId = 'res-' + Date.now();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(resId)}`;
    const publicVerifyUrl = `/verify/${resId}`;

    const verificationRecord = {
      id: resId,
      requestId: 'req-portal-' + Date.now(),
      userId: 'student-portal',
      orgId: org.id,
      studentName,
      studentEmail,
      certificateId: certificateId || 'N/A',
      holderName: studentName,
      issuerName: org.name,
      courseAward: courseAward || 'Student Certificate',
      issueDate: new Date().toISOString().split('T')[0],
      confidenceScore: aiResult.confidenceScore,
      verdict: aiResult.verdict,
      detectedAnomalies: aiResult.anomalies || [],
      positiveIndicators: aiResult.positiveIndicators || [],
      forensicDetails: aiResult.forensicDetails || {},
      ocr: aiResult.ocr || {},
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      qrCodeUrl,
      publicVerifyUrl,
      submittedViaPortal: true,
      verifiedAt: new Date().toISOString()
    };

    store.addVerificationResult(verificationRecord);
    store.logAudit(
      'student-portal',
      studentEmail,
      'STUDENT_PORTAL_VERIFY',
      `Student ${studentName} (${studentEmail}) completed certificate verification for ${org.name}. Result: ${verificationRecord.verdict} (${verificationRecord.confidenceScore}%)`
    );

    return res.json({
      message: 'Student verification submitted successfully to organization registry',
      result: verificationRecord
    });
  } catch (err) {
    console.error('Portal verify error:', err);
    return res.status(500).json({ error: 'Failed to complete student verification' });
  }
});

/**
 * GET /api/org/student-verifications
 * Returns all student verification records submitted to this organization owner
 */
router.get('/student-verifications', authMiddleware, requireRole(['organization', 'admin']), (req, res) => {
  const orgId = req.user.orgId || 'org-1';
  const allVerifications = store.getAllVerifications();
  const studentVerifications = allVerifications.filter(v => v.orgId === orgId || v.issuerName.toLowerCase().includes('stanford'));

  return res.json({ studentVerifications });
});

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
    const { action, reviewNotes } = req.body;
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

  const orgVerifications = allVerifications.filter(v => v.orgId === orgId || v.issuerName.toLowerCase().includes('stanford'));
  const verifiedCount = orgVerifications.filter(v => v.verdict === 'Original').length;
  const suspiciousCount = orgVerifications.filter(v => v.verdict === 'Suspicious').length;

  return res.json({
    totalIssued,
    activeCount,
    revokedCount,
    verifiedCount,
    suspiciousCount,
    studentSubmissionsCount: orgVerifications.length,
    pendingReviews: suspiciousCount
  });
});

module.exports = router;
