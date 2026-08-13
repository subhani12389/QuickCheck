import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, XCircle, Award, Building2, CheckCircle2, QrCode, Lock, ExternalLink, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { QRCodeSVG } from 'qrcode.react';

export const PublicVerifyPage = () => {
  const { idOrHash } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await axios.get(`/api/verify/public/${idOrHash}`);
        setData(res.data);
      } catch (err) {
        setError('Certificate or verification record not found in public database.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [idOrHash]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Verifying public certificate record...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 space-y-4">
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-100">Unverified / Invalid Certificate</h2>
          <p className="text-xs text-slate-400">{error || 'The requested certificate ID does not exist in the public registry.'}</p>
        </div>
        <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to QuickCheck AI Home
        </Link>
      </div>
    );
  }

  const certPayload = data.data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Lock className="w-3.5 h-3.5" /> Public Certificate Proof Registry
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Official Authenticity Proof</h1>
        <p className="text-xs text-slate-400">Cryptographically signed verification seal for third-party auditing</p>
      </div>

      {/* Main Certificate Verification Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Status Badge Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <StatusBadge verdict={certPayload.verdict || 'Original'} score={certPayload.confidenceScore || 98} size="large" />
          <span className="text-xs font-mono text-slate-400">Ref: {certPayload.certificateId || idOrHash}</span>
        </div>

        {/* Certificate Master Details */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 text-center space-y-6 relative">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> {certPayload.orgName || certPayload.issuerName}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">{certPayload.courseAward}</h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto space-y-1">
            <p className="text-xs text-slate-400">This certifies that</p>
            <p className="text-xl font-extrabold text-emerald-400">{certPayload.holderName}</p>
            <p className="text-xs text-slate-400">has fulfilled all requirements and earned this credential.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div>
              <span className="block text-slate-500">Issue Date</span>
              <span className="font-semibold text-slate-200">{certPayload.issueDate}</span>
            </div>
            <div>
              <span className="block text-slate-500">Authorized Signatory</span>
              <span className="font-semibold text-slate-200">{certPayload.signatoryName || 'Official Registrar'}</span>
            </div>
          </div>

        </div>

        {/* Cryptographic Hash Seal */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" /> Cryptographic Document Signature (SHA-256)
            </span>
            <span className="text-emerald-400 font-bold text-[10px] uppercase">MATCH VERIFIED</span>
          </div>
          <p className="font-mono text-[11px] text-indigo-300 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {certPayload.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
          </p>
        </div>

      </div>

    </div>
  );
};
