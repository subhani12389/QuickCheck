import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, Cpu, Shield, AlertTriangle, ArrowRight, X } from 'lucide-react';

export const UploadVerifyPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  const [certificateId, setCertificateId] = useState('');
  const [holderName, setHolderName] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [courseAward, setCourseAward] = useState('');
  const [issueDate, setIssueDate] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const pipelineSteps = [
    { title: 'OCR Text Extraction', desc: 'Parsing document strings & text positions via Tesseract OCR' },
    { title: 'PDF & Exif Metadata Inspection', desc: 'Scanning creation dates, tool signatures, & software footprints' },
    { title: 'Error Level Analysis (ELA) Forensics', desc: 'Calculating pixel re-compression error variances across image sub-regions' },
    { title: 'Cryptographic Master Matching', desc: 'Comparing document SHA-256 hash against official organization database' },
    { title: 'Risk Scoring & Verdict Synthesis', desc: 'Generating overall confidence score (0-100%) and anomaly report' }
  ];

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a PDF, PNG, or JPG file.');
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStartVerification = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a certificate document file first.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setCurrentStep(0);

    // Simulate animated step transitions
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < pipelineSteps.length - 1) return prev + 1;
        clearInterval(stepTimer);
        return prev;
      });
    }, 600);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (certificateId) formData.append('certificateId', certificateId);
      if (holderName) formData.append('holderName', holderName);
      if (issuerName) formData.append('issuerName', issuerName);
      if (courseAward) formData.append('courseAward', courseAward);
      if (issueDate) formData.append('issueDate', issueDate);

      const res = await axios.post('/api/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(stepTimer);
      setCurrentStep(4);

      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/verify/result/${res.data.result.id}`);
      }, 800);
    } catch (err) {
      clearInterval(stepTimer);
      setAnalyzing(false);
      setError(err.response?.data?.error || 'Verification process failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100">Certificate Verification Pipeline</h1>
        <p className="text-xs text-slate-400">Upload document PDF or image to run deep multi-stage AI forensics and database audit</p>
      </div>

      {/* Progress Animation Modal Overlay during Analysis */}
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-indigo-500/40 p-8 shadow-2xl space-y-6 text-center">
            
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600/30 animate-ping" />
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shadow-xl shadow-indigo-500/40">
                <Cpu className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-100">Running QuickCheck AI Engine</h3>
              <p className="text-xs text-slate-400 font-mono">Document: {file?.name}</p>
            </div>

            {/* Step-by-Step Checklist */}
            <div className="space-y-3 text-left pt-2">
              {pipelineSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md scale-102'
                        : isDone
                        ? 'bg-slate-900/60 border-slate-800 opacity-80'
                        : 'bg-slate-950/40 border-slate-900 opacity-40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-300' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                        Stage {idx + 1}: {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleStartVerification} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> {error}
            </span>
            <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
          </div>
        )}

        {/* Dropzone Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
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
            id="cert-file-input"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
          />

          <label htmlFor="cert-file-input" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8" />
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> File Selected: {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-200">
                  Drag and drop your certificate file here
                </p>
                <p className="text-xs text-slate-400">
                  Supports PDF, JPG, and PNG files up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Optional Metadata Details Form */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Certificate Metadata Inputs (Optional)</h3>
            <p className="text-xs text-slate-400">Entering details improves fuzzy record matching precision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Certificate ID</label>
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g. ST-AI-2024-8890"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Holder Name</label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Issuer Academy / Organization</label>
              <input
                type="text"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                placeholder="e.g. Stanford Online Academy"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-101 flex items-center justify-center gap-2"
        >
          Verify Certificate & Generate Report <ArrowRight className="w-5 h-5" />
        </button>

      </form>

    </div>
  );
};
