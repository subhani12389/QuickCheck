import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldAlert, Building2, FileCheck, Users, Shield, History, Search } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVerifications: 0,
    originalCount: 0,
    suspiciousCount: 0,
    fakeCount: 0,
    totalCertificates: 0,
    totalOrganizations: 0,
    totalAuditLogs: 0,
    verdictBreakdown: []
  });

  const [orgs, setOrgs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, orgsRes, logsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/orgs'),
          axios.get('/api/admin/logs')
        ]);
        setStats(statsRes.data);
        setOrgs(orgsRes.data.organizations || []);
        setAuditLogs(logsRes.data.auditLogs || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">Platform Admin Portal</h1>
        <p className="text-xs text-slate-400">System-wide analytics, fraud trends, organization approvals, and security audit logs</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total System Verifications</span>
            <FileCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{stats.totalVerifications}</p>
          <p className="text-[11px] text-slate-500">Across all platform users</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Original vs Fake Ratio</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.originalCount} / {stats.fakeCount}</p>
          <p className="text-[11px] text-slate-500">{stats.suspiciousCount} flagged suspicious</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-sky-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Registered Orgs</span>
            <Building2 className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-sky-400">{stats.totalOrganizations}</p>
          <p className="text-[11px] text-slate-500">Verified academies & issuers</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Security Audit Logs</span>
            <History className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{stats.totalAuditLogs}</p>
          <p className="text-[11px] text-slate-500">Immutable event trail</p>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Chart 1: Verdict Distribution Pie Chart */}
        <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" /> Verification Verdict Statistics
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.verdictBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats.verdictBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Registered Organizations Overview */}
        <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400" /> Verified Partner Organizations
          </h3>

          <div className="space-y-3 pt-2">
            {orgs.map((org) => (
              <div key={org.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={org.logoUrl} alt={org.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{org.name}</p>
                    <p className="text-[10px] text-slate-400">{org.contactEmail} • Signatory: {org.signatoryName}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* System Audit Logs Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> Platform Security Audit Trail
          </h3>
          <span className="text-xs text-slate-400">Total: {auditLogs.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-4">User Email</th>
                <th className="pb-3 px-4">Action</th>
                <th className="pb-3 px-4">Audit Details</th>
                <th className="pb-3 px-4">IP Address</th>
                <th className="pb-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">{log.userEmail}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-slate-400 text-right">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
