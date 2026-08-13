const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function getHashedPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

function generateHash(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const defaultPassword = getHashedPassword('password123');

const sampleOrganizations = [
  {
    id: 'org-1',
    name: 'Stanford Online Academy',
    code: 'STANFORD',
    website: 'https://online.stanford.edu',
    contactEmail: 'verify@stanford.edu',
    signatoryName: 'Prof. Andrew Ng',
    signatoryTitle: 'Director of AI Institute',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'org-2',
    name: 'Google Cloud Academy',
    code: 'GOOGLECLOUD',
    website: 'https://cloud.google.com/training',
    contactEmail: 'certifications@google.com',
    signatoryName: 'Sundar Pichai',
    signatoryTitle: 'Chief Executive Officer',
    logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'org-3',
    name: 'MIT Executive Education',
    code: 'MITEXEC',
    website: 'https://executive.mit.edu',
    contactEmail: 'credentials@mit.edu',
    signatoryName: 'Dr. L. Rafael Reif',
    signatoryTitle: 'President Emeritus',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

const sampleUsers = [
  {
    id: 'user-admin',
    name: 'Alex Rivera (Admin)',
    email: 'admin@quickcheck.ai',
    passwordHash: defaultPassword,
    role: 'admin',
    orgId: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'user-org-stanford',
    name: 'Sarah Connor (Stanford)',
    email: 'org@stanford.edu',
    passwordHash: defaultPassword,
    role: 'organization',
    orgId: 'org-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'user-org-google',
    name: 'David Vance (Google Cloud)',
    email: 'org@google.com',
    passwordHash: defaultPassword,
    role: 'organization',
    orgId: 'org-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'user-end',
    name: 'John Doe',
    email: 'user@quickcheck.ai',
    passwordHash: defaultPassword,
    role: 'end_user',
    orgId: null,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

const sampleCertificates = [
  {
    id: 'cert-101',
    certificateId: 'ST-AI-2024-8890',
    holderName: 'John Doe',
    courseAward: 'Advanced Machine Learning & Neural Networks',
    orgId: 'org-1',
    orgName: 'Stanford Online Academy',
    issueDate: '2024-05-15',
    signatoryName: 'Prof. Andrew Ng',
    documentHash: generateHash('ST-AI-2024-8890-John Doe-Stanford Online Academy'),
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'cert-102',
    certificateId: 'GCC-ARCH-9902',
    holderName: 'Jane Smith',
    courseAward: 'Professional Cloud Architect Certification',
    orgId: 'org-2',
    orgName: 'Google Cloud Academy',
    issueDate: '2024-03-10',
    signatoryName: 'Sundar Pichai',
    documentHash: generateHash('GCC-ARCH-9902-Jane Smith-Google Cloud Academy'),
    status: 'active',
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 'cert-103',
    certificateId: 'MIT-CS-5541',
    holderName: 'Michael Chen',
    courseAward: 'Executive Certificate in Artificial Intelligence',
    orgId: 'org-3',
    orgName: 'MIT Executive Education',
    issueDate: '2024-01-20',
    signatoryName: 'Dr. L. Rafael Reif',
    documentHash: generateHash('MIT-CS-5541-Michael Chen-MIT Executive Education'),
    status: 'active',
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString()
  }
];

const sampleVerificationResults = [
  {
    id: 'res-201',
    requestId: 'req-301',
    userId: 'user-end',
    certificateId: 'ST-AI-2024-8890',
    holderName: 'John Doe',
    issuerName: 'Stanford Online Academy',
    courseAward: 'Advanced Machine Learning & Neural Networks',
    issueDate: '2024-05-15',
    confidenceScore: 98,
    verdict: 'Original',
    detectedAnomalies: [],
    positiveIndicators: [
      'Cryptographic document hash (SHA-256) matches master template.',
      'Certificate ID verified in official registered database records.',
      'Holder name matched with 100% precision.',
      'No editing software footprint detected.'
    ],
    forensicDetails: {
      elaVariance: 1.12,
      noiseVariance: 220.4,
      editingSoftwareDetected: false,
      hashMatched: true,
      recordFound: true
    },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=res-201',
    publicVerifyUrl: '/verify/res-201',
    verifiedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'res-202',
    requestId: 'req-302',
    userId: 'user-end',
    certificateId: 'GCC-ARCH-9902',
    holderName: 'Jane Smith (Altered)',
    issuerName: 'Google Cloud Academy',
    courseAward: 'Professional Cloud Architect Certification',
    issueDate: '2024-03-10',
    confidenceScore: 42,
    verdict: 'Fake',
    detectedAnomalies: [
      'Certificate ID does not match registered holder name.',
      '[Forensics] High compression variance detected (ELA spike). Spliced text detected near holder name.',
      '[Metadata] Editing software signature detected: Adobe Photoshop 2023.'
    ],
    positiveIndicators: [
      'Certificate ID exists in database.'
    ],
    forensicDetails: {
      elaVariance: 14.8,
      noiseVariance: 1450.0,
      editingSoftwareDetected: true,
      hashMatched: false,
      recordFound: true
    },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=res-202',
    publicVerifyUrl: '/verify/res-202',
    verifiedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'res-203',
    requestId: 'req-303',
    userId: 'user-end',
    certificateId: 'UNKNOWN-9999',
    holderName: 'Robert Paulson',
    issuerName: 'Unverified Academy',
    courseAward: 'Cybersecurity Masterclass',
    issueDate: '2024-06-01',
    confidenceScore: 68,
    verdict: 'Suspicious',
    detectedAnomalies: [
      'Certificate ID not found in official registered database records.',
      '[Metadata] Document modification date differs from creation timestamp.'
    ],
    positiveIndicators: [
      'No spliced text or ELA compression anomalies detected.'
    ],
    forensicDetails: {
      elaVariance: 3.2,
      noiseVariance: 400.0,
      editingSoftwareDetected: false,
      hashMatched: false,
      recordFound: false
    },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=res-203',
    publicVerifyUrl: '/verify/res-203',
    verifiedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

const sampleAuditLogs = [
  {
    id: 'log-1',
    userId: 'user-end',
    userEmail: 'user@quickcheck.ai',
    action: 'VERIFY_CERTIFICATE',
    details: 'Verified certificate ST-AI-2024-8890. Result: Original (Score: 98)',
    ipAddress: '192.168.1.45',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'log-2',
    userId: 'user-org-stanford',
    userEmail: 'org@stanford.edu',
    action: 'CREATE_CERTIFICATE',
    details: 'Registered original certificate ST-AI-2024-8890 for John Doe',
    ipAddress: '172.16.0.12',
    timestamp: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'log-3',
    userId: 'user-admin',
    userEmail: 'admin@quickcheck.ai',
    action: 'SYSTEM_AUDIT',
    details: 'Reviewed suspicious verification logs and platform statistics',
    ipAddress: '10.0.0.1',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

module.exports = {
  sampleOrganizations,
  sampleUsers,
  sampleCertificates,
  sampleVerificationResults,
  sampleAuditLogs
};
