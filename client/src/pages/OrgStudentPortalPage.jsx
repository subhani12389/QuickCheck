import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Building2, Upload, CheckCircle2, Shield, AlertTriangle, ArrowRight, UserCheck, Mail, FileText, Download, QrCode, Cpu, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreGauge } from '../components/ScoreGauge';
import { ReportPDFModal } from '../components/ReportPDFModal';

export const OrgStudentPortalPage = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [orgError, setOrgError] = useState('');

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [courseAward, setCourseAward] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await axios.get(`/api/org/portal/${orgId || 'org-1'}`);
        setOrg(res.data.organization);
      } catch (err) {
        setOrgError('Organization verification portal not found or invalid link.');
      } finally {
        setLoadingOrg(false);
      }
    };
    fetchOrg();
  }, [orgId]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(selectedFile.type)) {
      setSubmitError('Unsupported file format. Please upload a PDF, PNG, or JPG file.');
      return;
    }
    setSubmitError('');
    setFile(selectedFile);
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!file) {
      setSubmitError('Please select or drop your certificate PDF or image document.');
      return;
    }
    if (!studentName || !studentEmail) {
      setSubmitError('Student Name and Email Address are required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setScanStep(1);

    const timer = setInterval(() => {
      setScanStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentName', studentName);
      formData.append('studentEmail', studentEmail);
      if (certificateId) formData.append('certificateId', certificateId);
      if (courseAward) formData.append('courseAward', courseAward);

      const res = await axios.post(`/api/org/portal-verify/${orgId || 'org-1'}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(timer);
      setScanStep(4);
      setResult(res.data.result);

      if (res.data.result.verdict === 'Original') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      clearInterval(timer);
      setSubmitError(err.response?.data?.error || 'Student verification process failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOrg) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading Organization Verification Portal...</p>
      </div>
    );
  }

  if (orgError || !org) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {orgError || 'Invalid organization portal link.'}
        </div>
        <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to QuickCheck Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      {/* Organization Header Branding Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={org.logoUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80'}
              alt={org.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5" /> Official Organization Verification Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{org.name}</h1>
              <p className="text-xs text-slate-400">{org.contactEmail} • Signatory: {org.signatoryName}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-semibold">ORG CODE</span>
            <span className="text-lg font-extrabold font-mono text-indigo-400">{org.code || 'ORG'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-center sm:text-left">
          Welcome to the official student certificate verification portal for <strong className="text-white">{org.name}</strong>. Please enter your student details and upload your certificate document below. Every verified submission is logged directly to the organization owner's registry.
        </p>

      </div>

      {/* Verification Result Display if submitted */}
      {result ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
          
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Student Verification Logged to {org.name} Owner Dashboard Roster!
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Ref: {result.id}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <StatusBadge verdict={result.verdict} score={result.confidenceScore} size="large" />
              <h2 className="text-2xl font-extrabold text-slate-100">{result.holderName}</h2>
              <p className="text-xs text-slate-400">Student Email: <span className="text-slate-200 font-semibold">{result.studentEmail}</span></p>
              <p className="text-xs text-slate-400">Certificate ID: <span className="text-indigo-300 font-mono font-semibold">{result.certificateId}</span></p>
            </div>

            <ScoreGauge score={result.confidenceScore} size={150} />
          </div>

          {/* Proofs & Anomalies */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">AI Forensics Audit Report</h3>

            {result.positiveIndicators && result.positiveIndicators.length > 0 && (
              <div className="space-y-2">
                {result.positiveIndicators.map((ind, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            )}

            {result.detectedAnomalies && result.detectedAnomalies.length > 0 && (
              <div className="space-y-2">
                {result.detectedAnomalies.map((anom, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-500/10 text-xs text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{anom}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setShowPDFModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF Audit Report
            </button>
            <button
              onClick={() => { setResult(null); setFile(null); }}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Submit Another Student Certificate
            </button>
          </div>

          <ReportPDFModal
            isOpen={showPDFModal}
            onClose={() => setShowPDFModal(false)}
            result={result}
          />
        </div>
      ) : (
        /* Student Upload Form */
        <form onSubmit={handleSubmitVerification} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
          
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {submitError}
            </div>
          )}

          {/* Progress Modal during submission */}
          {submitting && (
            <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-md rounded-3xl border border-indigo-500/40 p-8 shadow-2xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-full gradient-bg mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/40 animate-pulse">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-100">Verifying Student Certificate</h3>
                  <p className="text-xs text-slate-400">Running AI forensics and logging to {org.name} roster...</p>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${(scanStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Student Personal Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">1. Student Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Student Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. john.smith@student.edu"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Certificate / Roll Number</label>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g. ST-AI-2024-8890"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Course / Degree Program</label>
                <input
                  type="text"
                  value={courseAward}
                  onChange={(e) => setCourseAward(e.target.value)}
                  placeholder="e.g. Advanced Machine Learning"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Area */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">2. Certificate Document Upload</h3>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-600/10 scale-101'
                  : file
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'
              }`}
            >
              <input
                type="file"
                id="portal-file-input"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />

              <label htmlFor="portal-file-input" className="cursor-pointer space-y-3 block">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center shadow-lg">
                  <Upload className="w-7 h-7" />
                </div>

                {file ? (
                  <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Selected: {file.name}
                  </p>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-200">Click or drag your certificate PDF/image here</p>
                    <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-101 flex items-center justify-center gap-2"
          >
            Submit Certificate for Official Verification <ArrowRight className="w-5 h-5" />
          </button>

        </form>
      )}

    </div>
  );
};
