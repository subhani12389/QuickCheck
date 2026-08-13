import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Sun, Moon, LogOut, User, Building2, LayoutDashboard, History, CheckCircle, FileCheck, ShieldAlert, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <RouterLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-bg p-2 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">
              QuickCheck<span className="text-indigo-400 font-medium">.AI</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
              Fraud Prevention Platform
            </span>
          </div>
        </RouterLink>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <RouterLink
            to="/"
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              isActive('/') 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </RouterLink>

          {user && (
            <>
              {user.role === 'end_user' && (
                <>
                  <RouterLink
                    to="/dashboard"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive('/dashboard') 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Dashboard
                  </RouterLink>
                  <RouterLink
                    to="/verify"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive('/verify') 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Verify Document
                  </RouterLink>
                  <RouterLink
                    to="/history"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive('/history') 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    History
                  </RouterLink>
                </>
              )}

              {user.role === 'organization' && (
                <>
                  <RouterLink
                    to="/org/dashboard"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive('/org/dashboard') 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Org Dashboard
                  </RouterLink>
                  <RouterLink
                    to="/org/upload"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive('/org/upload') 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Issue Certificate
                  </RouterLink>
                </>
              )}

              {user.role === 'admin' && (
                <RouterLink
                  to="/admin/dashboard"
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                    isActive('/admin/dashboard') 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Admin Portal
                </RouterLink>
              )}
            </>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-sm transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full bg-indigo-500/20 object-cover"
                />
                <span className="font-semibold text-slate-200 hidden sm:inline">{user.name}</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.role}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl border border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {user.role === 'end_user' && (
                      <RouterLink
                        to="/verify"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white"
                      >
                        <FileCheck className="w-4 h-4 text-indigo-400" />
                        Verify Certificate
                      </RouterLink>
                    )}
                    {user.role === 'organization' && (
                      <RouterLink
                        to="/org/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white"
                      >
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        Organization Console
                      </RouterLink>
                    )}
                    {user.role === 'admin' && (
                      <RouterLink
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white"
                      >
                        <ShieldAlert className="w-4 h-4 text-indigo-400" />
                        System Analytics
                      </RouterLink>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RouterLink
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Get Started
              </RouterLink>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
