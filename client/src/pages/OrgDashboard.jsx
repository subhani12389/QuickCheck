import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Plus, ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, XCircle, Search, QrCode, ExternalLink, Check, X } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { QRModal } from '../components/QRModal';

export const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState('certificates'); // 'certificates' | 'reviews'
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeCount: 0,
    revokedCount: 0,
    verifiedCount: 0,
    suspiciousCount: 0,
    pendingReviews: 0
  });
  
  const [certificates, setCertificates] = useState([]);
  const [allVerifications, setAllVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQR, setSelectedQR] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchOrgData = async () => {
    try {
      const [statsRes, certsRes, verifyRes] = await Promise.all([
        axios.get('/api/org/stats'),
        axios.get('/api/org/certificates'),
        axios.get('/api/verify/public/res-203') // sample fetch
      ]);
      setStats(statsRes.data);
      setCertificates(certsRes.data.certificates || []);
    } catch (err) {
      console.error('Failed to load org data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleReviewAction = async (verificationId, action) => {
    setProcessingId(verificationId);
    try {
      await axios.patch(`/api/org/certificates/${verificationId}/review`, {
        action,
        reviewNotes
      });
      fetchOrgData();
      setReviewNotes('');
    } catch (err) {
      console.error('Review action failed:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Organization Console</h1>
          <p className="text-xs text-slate-400">Manage official certificate records and review AI-flagged suspicious verification requests</p>
        </div>

        <Link
          to="/org/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Issue New Certificate Record
        </Link>
      </div>

      {/* Org Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Issued Certs</span>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{stats.totalIssued}</p>
          <p className="text-[11px] text-slate-500">Registered master templates</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Records</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.activeCount}</p>
          <p className="text-[11px] text-slate-500">Publicly verifiable</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Pending Manual Reviews</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{stats.pendingReviews}</p>
          <p className="text-[11px] text-slate-500">Flagged suspicious cases</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-sky-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Verified Requests</span>
            <FileCheck className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-sky-400">{stats.verifiedCount}</p>
          <p className="text-[11px] text-slate-500">User checks passed</p>
        </div>

      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Registered Master Certificates ({certificates.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Pending Reviews Inbox
            {stats.pendingReviews > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
                {stats.pendingReviews}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Certificates Master List */}
      {activeTab === 'certificates' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading master certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 space-y-3">
              <p>No master certificates registered yet.</p>
              <Link to="/org/upload" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                Register First Certificate
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-4">Certificate ID</th>
                    <th className="pb-3 px-4">Holder Name</th>
                    <th className="pb-3 px-4">Course / Award</th>
                    <th className="pb-3 px-4">Issue Date</th>
                    <th className="pb-3 px-4">Cryptographic SHA-256 Hash</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">QR / Public Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">{cert.certificateId}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{cert.holderName}</td>
                      <td className="py-3.5 px-4 text-slate-300">{cert.courseAward}</td>
                      <td className="py-3.5 px-4 text-slate-400">{cert.issueDate}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 max-w-[120px] truncate">{cert.documentHash}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          {cert.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQR({
                            publicVerifyUrl: `/verify/public/${cert.certificateId}`,
                            certificateId: cert.certificateId,
                            holderName: cert.holderName
                          })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors"
                          title="Generate QR code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <a
                          href={`/verify/public/${cert.certificateId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Open public URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manual Reviews Inbox */}
      {activeTab === 'reviews' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Suspicious Case Reviews</h3>
            <p className="text-xs text-slate-400">Review user-submitted documents flagged by the AI engine</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <StatusBadge verdict="Suspicious" score={68} />
                <h4 className="text-base font-bold text-slate-100 mt-2">Ref: res-203 • Unknown / Unverified Request</h4>
                <p className="text-xs text-slate-400">Submitted Holder: Robert Paulson • Cert ID: UNKNOWN-9999</p>
              </div>

              <span className="text-xs text-slate-500 font-mono">Flagged: 3 days ago</span>
            </div>

            <div className="text-xs space-y-2">
              <p className="font-semibold text-slate-300">AI Detected Anomalies:</p>
              <ul className="space-y-1 text-slate-400">
                <li className="text-rose-400">• Certificate ID not registered in official organization database.</li>
                <li className="text-amber-400">• Document modification date differs from original creation date.</li>
              </ul>
            </div>

            {/* Action controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter review decision notes..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleReviewAction('res-203', 'approve')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve as Original
                </button>
                <button
                  onClick={() => handleReviewAction('res-203', 'reject')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject as Fake
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* QR Modal */}
      {selectedQR && (
        <QRModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          publicVerifyUrl={selectedQR.publicVerifyUrl}
          certificateId={selectedQR.certificateId}
          holderName={selectedQR.holderName}
        />
      )}

    </div>
  );
};
