const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../db/store');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, orgName, orgWebsite } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    let orgId = null;
    const userRole = role === 'organization' ? 'organization' : 'end_user';

    if (userRole === 'organization') {
      const newOrg = {
        id: 'org-' + Date.now(),
        name: orgName || `${name}'s Organization`,
        code: (orgName || 'ORG').replace(/\s+/g, '').toUpperCase(),
        website: orgWebsite || 'https://example.com',
        contactEmail: email,
        signatoryName: name,
        signatoryTitle: 'Authorized Registrar',
        logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
      store.addOrg(newOrg);
      orgId = newOrg.id;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      role: userRole,
      orgId,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    store.addUser(newUser);
    store.logAudit(newUser.id, newUser.email, 'USER_REGISTERED', `User account created (${newUser.role})`);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, orgId: newUser.orgId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userPayload } = newUser;
    return res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to register account' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    store.logAudit(user.id, user.email, 'USER_LOGIN', `User logged in successfully`);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, orgId: user.orgId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userPayload } = user;
    return res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash, ...userPayload } = user;
  return res.json({ user: userPayload });
});

module.exports = router;
