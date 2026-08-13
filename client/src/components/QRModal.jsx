import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, ExternalLink, Download } from 'lucide-react';

export const QRModal = ({ isOpen, onClose, publicVerifyUrl, certificateId, holderName }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const fullUrl = `${window.location.origin}${publicVerifyUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-slate-100">Public Verification Link & QR</h3>
          <p className="text-xs text-slate-400">
            Anyone scanning this QR code can verify the authenticity of certificate <span className="text-indigo-400 font-mono font-semibold">{certificateId}</span>
          </p>
        </div>

        {/* QR Canvas Container */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-inner">
          <QRCodeSVG 
            value={fullUrl} 
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/shield.svg",
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
          <p className="text-[11px] font-semibold text-slate-600 mt-2 font-mono text-center">
            {holderName} • {certificateId}
          </p>
        </div>

        {/* Shareable Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Public Verification URL</label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="w-full bg-transparent text-xs text-indigo-300 font-mono px-2 focus:outline-none truncate"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href={publicVerifyUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Link in New Tab
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
