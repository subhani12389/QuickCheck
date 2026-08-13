import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Plus, ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const OrgUploadCertPage = () => {
  const navigate = useNavigate();

  const [certificateId, setCertificateId] = useState('');
  const [holderName, setHolderName] = useState('');
  const [courseAward, setCourseAward] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [signatoryName, setSignatoryName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/org/certificates', {
        certificateId,
        holderName,
        courseAward,
        issueDate,
        signatoryName
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/org/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register official certificate record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link to="/org/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Console
        </Link>
      </div>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl gradient-bg mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Register Master Certificate</h1>
        <p className="text-xs text-slate-400">Store trusted certificate details and cryptographic SHA-256 hash signatures</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate registered successfully! Redirecting...
          </div>
        )}

        <div className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Official Certificate ID *</label>
            <input
              type="text"
              required
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="e.g. ST-AI-2024-9988"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Recipient / Holder Full Name *</label>
            <input
              type="text"
              required
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="e.g. Alexander Hamilton"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Course / Award Title *</label>
            <input
              type="text"
              required
              value={courseAward}
              onChange={(e) => setCourseAward(e.target.value)}
              placeholder="e.g. Bachelor of Science in Computer Science"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Official Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Authorized Signatory Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="e.g. Dr. Jane Goodall"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Storing Master Record...' : 'Register Official Master Record'} <ArrowRight className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
