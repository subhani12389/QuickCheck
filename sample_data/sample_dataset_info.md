# QuickCheck AI — Sample Verification Dataset

This directory provides sample test scenarios for evaluating the QuickCheck AI document analysis pipeline.

## Sample Scenarios Included

### Scenario 1: Authentic Certificate (Original — 98% Score)
- **Certificate ID**: `ST-AI-2024-8890`
- **Holder Name**: `John Doe`
- **Issuer**: `Stanford Online Academy`
- **Course**: `Advanced Machine Learning & Neural Networks`
- **Issue Date**: `2024-05-15`
- **Cryptographic Master Hash**: Matches `db_store.json` master SHA-256 hash.
- **AI Verdict**: **Original** (Green Badge)

### Scenario 2: Spliced & Altered Certificate (Fake — 42% Score)
- **Certificate ID**: `GCC-ARCH-9902`
- **Holder Name**: `Jane Smith (Altered)`
- **Issuer**: `Google Cloud Academy`
- **Course**: `Professional Cloud Architect Certification`
- **AI Verdict**: **Fake** (Red Badge)
- **Detected Anomalies**:
  - `[Database Mismatch]` Submitted name differs from registered database.
  - `[Forensics]` High compression error variance (ELA spike near holder name).
  - `[Metadata]` Software signature detected: `Adobe Photoshop 2023`.

### Scenario 3: Unregistered Academy Certificate (Suspicious — 68% Score)
- **Certificate ID**: `UNKNOWN-9999`
- **Holder Name**: `Robert Paulson`
- **Issuer**: `Unverified Academy`
- **AI Verdict**: **Suspicious** (Yellow Badge — sent to Organization inbox for manual review)

---

## Preset Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **End User** | `user@quickcheck.ai` | `password123` |
| **Organization Admin** | `org@stanford.edu` | `password123` |
| **Platform Admin** | `admin@quickcheck.ai` | `password123` |
