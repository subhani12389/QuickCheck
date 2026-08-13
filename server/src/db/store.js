const fs = require('fs');
const path = require('path');
const { sampleOrganizations, sampleUsers, sampleCertificates, sampleVerificationResults, sampleAuditLogs } = require('./seedData');

const DB_FILE = path.join(__dirname, 'db_store.json');

class Store {
  constructor() {
    this.data = {
      users: [...sampleUsers],
      organizations: [...sampleOrganizations],
      certificates: [...sampleCertificates],
      verificationResults: [...sampleVerificationResults],
      auditLogs: [...sampleAuditLogs],
      notifications: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [...sampleUsers],
          organizations: parsed.organizations || [...sampleOrganizations],
          certificates: parsed.certificates || [...sampleCertificates],
          verificationResults: parsed.verificationResults || [...sampleVerificationResults],
          auditLogs: parsed.auditLogs || [...sampleAuditLogs],
          notifications: parsed.notifications || []
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error reading persistent DB store:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving persistent DB store:', err);
    }
  }

  // Users
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Organizations
  findOrgById(id) {
    return this.data.organizations.find(o => o.id === id);
  }

  getAllOrgs() {
    return this.data.organizations;
  }

  addOrg(org) {
    this.data.organizations.push(org);
    this.save();
    return org;
  }

  // Certificates
  findCertByCertId(certId) {
    if (!certId) return null;
    return this.data.certificates.find(c => c.certificateId.trim().toLowerCase() === certId.trim().toLowerCase());
  }

  findCertByHash(hash) {
    if (!hash) return null;
    return this.data.certificates.find(c => c.documentHash && c.documentHash.toLowerCase() === hash.toLowerCase());
  }

  getCertificatesByOrg(orgId) {
    return this.data.certificates.filter(c => c.orgId === orgId);
  }

  getAllCertificates() {
    return this.data.certificates;
  }

  addCertificate(cert) {
    this.data.certificates.push(cert);
    this.save();
    return cert;
  }

  updateCertificateStatus(id, status) {
    const cert = this.data.certificates.find(c => c.id === id);
    if (cert) {
      cert.status = status;
      this.save();
    }
    return cert;
  }

  // Verification Results
  getVerificationById(id) {
    return this.data.verificationResults.find(r => r.id === id || r.certificateId === id);
  }

  getVerificationsByUser(userId) {
    return this.data.verificationResults.filter(r => r.userId === userId);
  }

  getAllVerifications() {
    return this.data.verificationResults;
  }

  addVerificationResult(result) {
    this.data.verificationResults.unshift(result);
    this.save();
    return result;
  }

  updateVerificationStatus(id, verdict, score, reviewNotes) {
    const res = this.data.verificationResults.find(r => r.id === id);
    if (res) {
      if (verdict) res.verdict = verdict;
      if (score !== undefined) res.confidenceScore = score;
      if (reviewNotes) res.reviewNotes = reviewNotes;
      res.reviewedAt = new Date().toISOString();
      this.save();
    }
    return res;
  }

  // Audit Logs
  logAudit(userId, userEmail, action, details, ipAddress = '127.0.0.1') {
    const log = {
      id: 'log-' + Date.now(),
      userId,
      userEmail,
      action,
      details,
      ipAddress,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }

  getAllAuditLogs() {
    return this.data.auditLogs;
  }
}

module.exports = new Store();
