import React from 'react';
import { Shield, Lock, FileCheck, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 pt-12 pb-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">QuickCheck.AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted document verification platform detecting fraudulent credentials, altered timestamps, and image tampering with instant cryptographic proof.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
              <Lock className="w-3.5 h-3.5" /> SHA-256 Encrypted Audit Trail
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Verification Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#ocr" className="hover:text-indigo-400 transition-colors">OCR Text Extraction</a></li>
              <li><a href="#forensics" className="hover:text-indigo-400 transition-colors">Error Level Analysis (ELA)</a></li>
              <li><a href="#metadata" className="hover:text-indigo-400 transition-colors">PDF & Exif Metadata Inspection</a></li>
              <li><a href="#qr" className="hover:text-indigo-400 transition-colors">QR Code & Public Link Generator</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">User Solutions</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="/login" className="hover:text-indigo-400 transition-colors">End User Portal</a></li>
              <li><a href="/login?role=organization" className="hover:text-indigo-400 transition-colors">Organization Registry Console</a></li>
              <li><a href="/login?role=admin" className="hover:text-indigo-400 transition-colors">Platform Admin Auditor</a></li>
              <li><a href="/api/health" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1">API Health Status <ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Security & Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All uploads are scanned for malicious code and cryptographically hashed. Trusted certificates are stored with immutable SHA-256 signatures.
            </p>
            <div className="text-[11px] text-slate-500">
              Status: <span className="text-emerald-400 font-semibold">● Engine Operational</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QuickCheck AI Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
