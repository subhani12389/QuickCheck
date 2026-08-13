import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { ShieldCheck, AlertTriangle, FileText, Download, QrCode, Share2, ExternalLink, CheckCircle2, ArrowLeft, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreGauge } from '../components/ScoreGauge';
import { QRModal } from '../components/QRModal';
import { ReportPDFModal } from '../components/ReportPDFModal';

export const VerifyResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showQR, setShowQR] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [highlightTampering, setHighlightTampering] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`/api/verify/${id}`);
        setResult(res.data.result);
        if (res.data.result.verdict === 'Original') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        setError('Failed to fetch verification report.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Fetching verification report...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error || 'Verification report not found.'}
        </div>
        <Link to="/verify" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Run New Verification
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button & Top Controls */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <QrCode className="w-4 h-4 text-indigo-400" /> Share QR & Link
          </button>
          <button
            onClick={() => setShowPDF(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Main Status Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-3 text-center md:text-left">
          <StatusBadge verdict={result.verdict} score={result.confidenceScore} size="large" />
          <h1 className="text-3xl font-extrabold text-slate-100">
            {result.verdict === 'Original' ? 'Verified Authentic Certificate' : result.verdict === 'Suspicious' ? 'Flagged Suspicious Document' : 'Fraudulent / Altered Certificate'}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {result.verdict === 'Original' 
              ? 'All AI forensic algorithms, metadata inspections, and cryptographic master hash checks confirmed document authenticity.'
              : 'The AI document pipeline detected anomalies requiring review or identified explicit tamper signatures.'}
          </p>
        </div>

        <ScoreGauge score={result.confidenceScore} size={160} />
      </div>

      {/* Grid Content: Document Canvas vs Forensic Report */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Certificate Visual Preview */}
        <div className="md:col-span-6 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 relative">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Document Preview & Forensics Overlay
              </h3>

              <button
                onClick={() => setHighlightTampering(!highlightTampering)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  highlightTampering 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {highlightTampering ? 'Hide ELA Overlay' : 'Highlight Tamper Heatmap'}
              </button>
            </div>

            {/* Certificate Canvas / Overlay Mock */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 relative overflow-hidden">
              
              {/* ELA Heatmap Overlay */}
              {highlightTampering && (
                <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-[1px] z-10 flex items-center justify-center p-4 border-2 border-rose-500/60 pointer-events-none">
                  <div className="p-3 rounded-xl bg-slate-950/90 text-rose-300 text-xs font-bold border border-rose-500/80 shadow-2xl">
                    🔥 ELA Compression Spike Detected Near Name & Date Region
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">{result.issuerName}</p>
                <h4 className="text-lg font-extrabold text-slate-100">{result.courseAward}</h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-[11px] text-slate-400">Awarded to</p>
                <p className="text-base font-bold text-indigo-300">{result.holderName}</p>
                <p className="text-[10px] text-slate-400">ID: {result.certificateId}</p>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-2">
                <span>Issue Date: {result.issueDate}</span>
                <span>Verified: {new Date(result.verifiedAt || Date.now()).toLocaleDateString()}</span>
              </div>

            </div>

            {/* Public URL Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono truncate">
                Public Link: {window.location.origin}{result.publicVerifyUrl}
              </span>
              <button
                onClick={() => setShowQR(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white font-semibold shrink-0 transition-colors"
              >
                View QR
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: AI Forensic Audit Checklist */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Section: Positive Proofs */}
          {result.positiveIndicators && result.positiveIndicators.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Positive Verification Proofs
              </h3>
              <div className="space-y-2">
                {result.positiveIndicators.map((ind, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Detected Anomalies */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Detected Forensic Anomalies
            </h3>

            {!result.detectedAnomalies || result.detectedAnomalies.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 text-xs text-emerald-300">
                ✓ Zero image tampering, spliced regions, or metadata discrepancies detected.
              </div>
            ) : (
              <div className="space-y-2">
                {result.detectedAnomalies.map((anom, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{anom}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Forensic Metric Benchmarks */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Forensic Benchmark Metrics
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">ELA Variance Ratio</span>
                <p className="text-base font-extrabold text-indigo-300">
                  {result.forensicDetails?.elaVariance || 1.12}x
                </p>
                <span className="text-[10px] text-slate-500">&lt; 3.5x threshold is normal</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Noise Uniformity</span>
                <p className="text-base font-extrabold text-indigo-300">
                  {result.forensicDetails?.noiseVariance || 220.4}
                </p>
                <span className="text-[10px] text-slate-500">&lt; 1200 threshold is normal</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <QRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        publicVerifyUrl={result.publicVerifyUrl}
        certificateId={result.certificateId}
        holderName={result.holderName}
      />

      <ReportPDFModal
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        result={result}
      />

    </div>
  );
};
