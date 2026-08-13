import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { History, Search, Filter, ExternalLink, Calendar, FileText } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/user/history');
        setHistory(res.data.verifications || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = (item.certificateId || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.holderName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.issuerName || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesVerdict = filterVerdict === 'ALL' || item.verdict?.toUpperCase() === filterVerdict;

    return matchesSearch && matchesVerdict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">Verification History</h1>
        <p className="text-xs text-slate-400">Search and audit all your previously verified certificate documents</p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, holder, or issuer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Verdict Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ORIGINAL', 'SUSPICIOUS', 'FAKE'].map((verdict) => (
            <button
              key={verdict}
              onClick={() => setFilterVerdict(verdict)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterVerdict === verdict
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {verdict}
            </button>
          ))}
        </div>

      </div>

      {/* History Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">No matching verification records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-4">Certificate ID</th>
                  <th className="pb-3 px-4">Holder Name</th>
                  <th className="pb-3 px-4">Issuer Academy</th>
                  <th className="pb-3 px-4">AI Score</th>
                  <th className="pb-3 px-4">Verdict Status</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Report Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">{item.certificateId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{item.holderName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.issuerName}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-100">{item.confidenceScore}%</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge verdict={item.verdict} score={item.confidenceScore} showIcon={false} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(item.verifiedAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/verify/result/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-[11px] transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
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
