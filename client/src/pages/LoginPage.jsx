import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, User, Building2, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'organization') navigate('/org/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await loginAsDemo(role);
      if (role === 'organization') navigate('/org/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl gradient-bg mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Welcome Back</h1>
        <p className="text-xs text-slate-400">Sign in to your QuickCheck AI verification account</p>
      </div>

      {/* Preset Demo Buttons */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 text-center">
          ⚡ One-Click Instant Demo Login
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDemoLogin('end_user')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-all text-center flex flex-col items-center gap-1"
          >
            <User className="w-4 h-4 text-indigo-400" /> End User
          </button>
          <button
            onClick={() => handleDemoLogin('organization')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-600/20 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-all text-center flex flex-col items-center gap-1"
          >
            <Building2 className="w-4 h-4 text-sky-400" /> Organization
          </button>
          <button
            onClick={() => handleDemoLogin('admin')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-amber-600/20 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-amber-300 transition-all text-center flex flex-col items-center gap-1"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Admin
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </form>

    </div>
  );
};
