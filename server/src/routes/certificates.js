const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const store = require('../db/store');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { computeHash } = require('../services/aiService');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, JPG, and PNG are allowed.'));
    }
  }
});

/**
 * POST /api/certificates/upload
 * Multi-part upload handler
 */
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No certificate file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      message: 'File uploaded successfully',
      filePath: req.file.path,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'File upload failed' });
  }
});

/**
 * GET /api/certificates
 */
router.get('/', (req, res) => {
  const certs = store.getAllCertificates();
  return res.json({ certificates: certs });
});

/**
 * GET /api/certificates/:id
 */
router.get('/:id', (req, res) => {
  const cert = store.findCertByCertId(req.params.id) || store.findCertByHash(req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate record not found' });
  }
  return res.json({ certificate: cert });
});

module.exports = router;
