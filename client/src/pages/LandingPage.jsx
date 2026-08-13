import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Eye, Cpu, Lock, QrCode, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Building2, UserCheck, Layers, Award } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreGauge } from '../components/ScoreGauge';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loginAsDemo } = useAuth();
  const [demoSelected, setDemoSelected] = useState('clean');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const sampleDemos = {
    clean: {
      certId: 'ST-AI-2024-8890',
      holder: 'John Doe',
      issuer: 'Stanford Online Academy',
      course: 'Advanced Machine Learning & Neural Networks',
      verdict: 'Original',
      score: 98,
      anomalies: [],
      positive: [
        'Cryptographic document hash (SHA-256) matches master template.',
        'Holder name verified in registered database.',
        'No editing software footprint detected.'
      ]
    },
    tampered: {
      certId: 'GCC-ARCH-9902',
      holder: 'Jane Smith (Altered Name)',
      issuer: 'Google Cloud Academy',
      course: 'Professional Cloud Architect Certification',
      verdict: 'Fake',
      score: 42,
      anomalies: [
        'Certificate ID does not match registered holder name.',
        '[Forensics] High compression variance detected (ELA spike near holder name).',
        '[Metadata] Editing software signature detected: Adobe Photoshop 2023.'
      ],
      positive: ['Certificate ID exists in database']
    }
  };

  const handleRunDemoScan = (type) => {
    setDemoSelected(type);
    setScanning(true);
    setScanStep(1);
    
    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => setScanStep(4), 1800);
    setTimeout(() => {
      setScanning(false);
    }, 2200);
  };

  const activeDemo = sampleDemos[demoSelected];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Multi-Stage Document Forensics & Verification</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Detect Fake Certificates in <span className="gradient-text">Seconds with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Instantly analyze PDF and image certificates for spliced text, tampered metadata, altered dates, and fraudulent signatures with cryptographic proof.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/verify"
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              Verify Certificate Now <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={async () => {
                await loginAsDemo('organization');
                navigate('/org/dashboard');
              }}
              className="px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center gap-2"
            >
              <Building2 className="w-5 h-5 text-indigo-400" /> Organization Demo Console
            </button>
          </motion.div>

          {/* Key Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-indigo-400">99.4%</p>
              <p className="text-xs text-slate-400 mt-1">Tamper Detection Rate</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-sky-400">&lt; 2.5s</p>
              <p className="text-xs text-slate-400 mt-1">AI Scan Pipeline Speed</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-emerald-400">SHA-256</p>
              <p className="text-xs text-slate-400 mt-1">Immutable Master Hashes</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Automated PDF & Image ELA</p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Live Demo Widget */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-8 relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Try Live AI Forensic Analysis</h2>
              <p className="text-xs text-slate-400">Select a sample document preset below to simulate instant real-time AI scanning.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRunDemoScan('clean')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoSelected === 'clean' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Original Certificate Preset
              </button>

              <button
                onClick={() => handleRunDemoScan('tampered')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoSelected === 'tampered' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Tampered / Fake Preset
              </button>
            </div>
          </div>

          {/* Interactive Scan Display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Document Preview Box */}
            <div className="md:col-span-6 relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 p-4 space-y-4">
              
              {scanning && (
                <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                  <p className="text-xs font-semibold text-indigo-300">Running Stage {scanStep}/4 AI Analysis...</p>
                  <p className="text-[11px] text-slate-400">
                    {scanStep === 1 && 'Extracting text via OCR...'}
                    {scanStep === 2 && 'Inspecting PDF/Exif Metadata...'}
                    {scanStep === 3 && 'Analyzing ELA image compression variance...'}
                    {scanStep === 4 && 'Matching with registered DB master hash...'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Certificate Preview
                </span>
                <span className="text-[11px] font-mono text-slate-400">{activeDemo.certId}</span>
              </div>

              {/* Sample Certificate Certificate Canvas Mock */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <Shield className="w-24 h-24 text-indigo-400" />
                </div>
                <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-bold">{activeDemo.issuer}</p>
                <h3 className="text-xl font-extrabold text-slate-100">{activeDemo.course}</h3>
                <p className="text-xs text-slate-400">This certifies that</p>
                <p className={`text-lg font-bold ${demoSelected === 'tampered' ? 'text-rose-400 bg-rose-500/10 px-2 py-1 rounded inline-block border border-rose-500/30' : 'text-emerald-400'}`}>
                  {activeDemo.holder}
                </p>
                <p className="text-[11px] text-slate-400">has successfully satisfied all graduation requirements.</p>
              </div>

            </div>

            {/* AI Results Box */}
            <div className="md:col-span-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">AI Verdict</p>
                  <StatusBadge verdict={activeDemo.verdict} score={activeDemo.score} size="large" />
                </div>
                <ScoreGauge score={activeDemo.score} size={140} />
              </div>

              {/* Anomalies vs Positive */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Inspection Breakdown</p>

                {activeDemo.anomalies.length > 0 ? (
                  <div className="space-y-2">
                    {activeDemo.anomalies.map((anom, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{anom}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeDemo.positive.map((pos, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pos}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to="/verify"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg"
                >
                  Upload Your Own Certificate Document <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">Multi-Layered AI Forensic Pipeline</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Combines computer vision algorithms, metadata header inspection, and cryptographic record comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">1. OCR Entity Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts Certificate ID, Holder Name, Issuer, and Issue Date from scanned PDFs and photos using Tesseract OCR and layout analysis.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">2. Error Level Analysis (ELA)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects spliced text patches, substituted names, and pasted logos by analyzing compression error variances across image sub-regions.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">3. Cryptographic Master Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compares document SHA-256 hashes against official registered organization database records to confirm 100% authenticity.
            </p>
          </div>

        </div>
      </section>

      {/* User Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">Tailored for Users & Organizations</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Whether you are an employer verifying credentials or an educational institute protecting your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Role 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">For End Users & Employers</h3>
                <p className="text-xs text-slate-400">Instant verification & audit report downloading</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Upload PDF, JPG, or PNG certificates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Receive confidence score (0-100%) and status verdict
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Download official PDF verification audit reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Public shareable verification link & QR code
              </li>
            </ul>

            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg"
            >
              Verify A Certificate Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Role 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-sky-500/30 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">For Universities & Institutions</h3>
                <p className="text-xs text-slate-400">Master record registry & manual review inbox</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Register official master certificate records & template hashes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Review suspicious flagged verification requests manually
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Approve or reject fraudulent cases with custom audit notes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Certificate status control (Active vs Revoked)
              </li>
            </ul>

            <button
              onClick={async () => {
                await loginAsDemo('organization');
                navigate('/org/dashboard');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-lg"
            >
              Access Organization Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
