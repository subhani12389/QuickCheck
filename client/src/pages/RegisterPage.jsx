import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('end_user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({
        role,
        name,
        email,
        password,
        orgName,
        orgWebsite
      });
      if (user.role === 'organization') navigate('/org/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
        <h1 className="text-3xl font-extrabold text-slate-100">Create Account</h1>
        <p className="text-xs text-slate-400">Join QuickCheck AI to verify and manage certificates</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
        <button
          type="button"
          onClick={() => setRole('end_user')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'end_user'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> End User / Employer
        </button>
        <button
          type="button"
          onClick={() => setRole('organization')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'organization'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Organization / Academy
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Full Name / Registrar Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {role === 'organization' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Stanford Online Academy"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Organization Website</label>
              <input
                type="url"
                value={orgWebsite}
                onChange={(e) => setOrgWebsite(e.target.value)}
                placeholder="https://online.stanford.edu"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
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
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Sign in here
          </Link>
        </p>
      </form>

    </div>
  );
};
