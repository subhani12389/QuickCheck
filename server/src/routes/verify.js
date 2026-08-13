const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');
const { analyzeCertificateDocument } = require('../services/aiService');

const router = express.Router();

const isVercel = process.env.VERCEL === '1';

const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
          try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `verify-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * POST /api/verify
 * Executes AI document analysis pipeline & creates verification result
 */
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a certificate PDF or image for analysis' });
    }

    const { certificateId, holderName, issuerName, courseAward, issueDate } = req.body;
    const userInputs = { certificateId, holderName, issuerName, courseAward, issueDate };

    let tempFilePath = req.file.path;
    let fileName = req.file.originalname;

    if (isVercel || !tempFilePath) {
      const ext = path.extname(fileName) || '.png';
      tempFilePath = path.join(os.tmpdir(), `verify-${Date.now()}${ext}`);
      fs.writeFileSync(tempFilePath, req.file.buffer);
    }

    // Run AI analysis
    const aiResult = await analyzeCertificateDocument(tempFilePath, fileName, userInputs);

    // Look up org record details
    const matchedCert = certificateId ? store.findCertByCertId(certificateId) : null;

    const resId = 'res-' + Date.now();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(resId)}`;
    const publicVerifyUrl = `/verify/${resId}`;

    const verificationRecord = {
      id: resId,
      requestId: 'req-' + Date.now(),
      userId: req.user.id,
      certificateId: certificateId || (matchedCert ? matchedCert.certificateId : 'N/A'),
      holderName: holderName || (matchedCert ? matchedCert.holderName : 'Submitted Document'),
      issuerName: issuerName || (matchedCert ? matchedCert.orgName : 'Unknown Issuer'),
      courseAward: courseAward || (matchedCert ? matchedCert.courseAward : 'Certificate Document'),
      issueDate: issueDate || (matchedCert ? matchedCert.issueDate : new Date().toISOString().split('T')[0]),
      confidenceScore: aiResult.confidenceScore,
      verdict: aiResult.verdict,
      detectedAnomalies: aiResult.anomalies || [],
      positiveIndicators: aiResult.positiveIndicators || [],
      forensicDetails: aiResult.forensicDetails || {},
      ocr: aiResult.ocr || {},
      fileUrl: req.file.filename ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&auto=format&fit=crop&q=80',
      fileName: req.file.originalname,
      qrCodeUrl,
      publicVerifyUrl,
      verifiedAt: new Date().toISOString()
    };

    store.addVerificationResult(verificationRecord);
    store.logAudit(
      req.user.id,
      req.user.email,
      'VERIFY_CERTIFICATE',
      `Verified certificate ${verificationRecord.certificateId}. Result: ${verificationRecord.verdict} (Score: ${verificationRecord.confidenceScore}%)`
    );

    return res.json({ result: verificationRecord });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Failed to complete document verification' });
  }
});

/**
 * GET /api/verify/:id
 */
router.get('/:id', (req, res) => {
  const result = store.getVerificationById(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'Verification report not found' });
  }
  return res.json({ result });
});

/**
 * GET /api/public/verify/:idOrHash
 * Public endpoint for scanning QR or direct URL check (No Auth required)
 */
router.get('/public/:idOrHash', (req, res) => {
  const param = req.params.idOrHash;
  const result = store.getVerificationById(param);
  if (result) {
    return res.json({
      isVerified: result.verdict === 'Original',
      type: 'VERIFICATION_RESULT',
      data: result
    });
  }

  const cert = store.findCertByCertId(param) || store.findCertByHash(param);
  if (cert) {
    return res.json({
      isVerified: cert.status === 'active',
      type: 'MASTER_CERTIFICATE_RECORD',
      data: {
        certificateId: cert.certificateId,
        holderName: cert.holderName,
        courseAward: cert.courseAward,
        orgName: cert.orgName,
        issueDate: cert.issueDate,
        signatoryName: cert.signatoryName,
        documentHash: cert.documentHash,
        status: cert.status,
        verdict: cert.status === 'active' ? 'Original' : 'Fake',
        confidenceScore: cert.status === 'active' ? 100 : 0
      }
    });
  }

  return res.status(404).json({ error: 'Certificate or verification record not found' });
});

module.exports = router;
