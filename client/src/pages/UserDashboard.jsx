import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, FileCheck, AlertTriangle, XCircle, Upload, ArrowRight, History, Search } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalVerifications: 0,
    originalCount: 0,
    suspiciousCount: 0,
    fakeCount: 0,
    recentVerifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get('/api/user/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load user stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">User Dashboard</h1>
          <p className="text-xs text-slate-400">Overview of your certificate verification activity and report history</p>
        </div>

        <Link
          to="/verify"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Upload className="w-4 h-4" /> Verify New Document
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Verifications</span>
            <FileCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{stats.totalVerifications}</p>
          <p className="text-[11px] text-slate-500">Processed through AI pipeline</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Original & Authentic</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.originalCount}</p>
          <p className="text-[11px] text-slate-500">Passed cryptographic hash audit</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Suspicious Flags</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{stats.suspiciousCount}</p>
          <p className="text-[11px] text-slate-500">Sent for manual org review</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Fraudulent / Fake</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{stats.fakeCount}</p>
          <p className="text-[11px] text-slate-500">Failed forensic ELA inspection</p>
        </div>

      </div>

      {/* Quick Upload Action Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-sky-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-100">Need to check a document?</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Upload any academic certificate, course completion award, or professional credential in PDF, PNG, or JPG format.
          </p>
        </div>
        <Link
          to="/verify"
          className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
        >
          Upload Document <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Verifications Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Recent Verification Activity</h3>
          </div>
          <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading activity...</div>
        ) : stats.recentVerifications.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 space-y-3">
            <p>No document verifications recorded yet.</p>
            <Link to="/verify" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
              Start Your First Verification
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-4">Certificate ID</th>
                  <th className="pb-3 px-4">Holder Name</th>
                  <th className="pb-3 px-4">Issuer Org</th>
                  <th className="pb-3 px-4">Verdict Status</th>
                  <th className="pb-3 px-4">Confidence</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentVerifications.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-300">{item.certificateId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{item.holderName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.issuerName}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge verdict={item.verdict} score={item.confidenceScore} showIcon={false} />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">{item.confidenceScore}%</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(item.verifiedAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/verify/result/${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-[11px] transition-colors"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
