import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/api';
import { Settings as SettingsIcon, Shield, User, Lock, Key, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    try {
      setLoading(true);
      if (authMode === 'register') {
        const res = await registerUser(name, email, password);
        setUser(res.user);
        setMsg('Registration successful! Account logged in.');
      } else {
        const res = await loginUser(email, password);
        setUser(res.user);
        setMsg('Login successful!');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocalData = () => {
    if (window.confirm('Are you sure you want to clear locally cached security credentials?')) {
      logout();
      setMsg('Local cached credentials cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <SettingsIcon className="w-7 h-7 text-cyan-400" /> System Settings & Privacy Controls
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Manage your account credentials, security configuration, data privacy settings, and system diagnostic options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Account Card */}
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-cyan-400" /> User Account
          </h2>

          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-400 font-bold block">LOGGED IN ANALYST</span>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              </div>
              <button onClick={logout} className="btn-secondary w-full py-2 text-xs">
                Log Out of Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tab Switch */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    authMode === 'login' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    authMode === 'register' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {msg && (
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{msg}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-xs">
                  {authMode === 'register' ? 'Register Account' : 'Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Privacy & Data Controls */}
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-cyan-400" /> Privacy & Local Data Policy
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
              <strong className="text-cyan-400 font-mono block mb-1">Data Privacy Commitment:</strong>
              Scam Shield AI processes input messages and URLs exclusively for threat evaluation. Screenshots uploaded for OCR text extraction are not stored permanently.
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <strong className="text-slate-200 block">Cached Credentials Management</strong>
              <button
                onClick={handleClearLocalData}
                className="btn-secondary py-1.5 px-3 text-xs text-rose-400 border-rose-900/60 hover:bg-rose-950 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Local Session Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
