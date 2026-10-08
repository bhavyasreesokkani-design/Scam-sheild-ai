import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Scan, Link2, Image, History, Flag, BookOpen, PhoneCall, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scanner', label: 'Scam Scanner', icon: Scan },
    { to: '/url-checker', label: 'URL Checker', icon: Link2 },
    { to: '/image-scanner', label: 'Image Scanner', icon: Image },
    { to: '/history', label: 'Scan History', icon: History },
    { to: '/reports', label: 'Scam Reports', icon: Flag },
    { to: '/education', label: 'Education', icon: BookOpen },
    { to: '/call-analysis', label: 'Call Shield', icon: PhoneCall },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                SCAM SHIELD <span className="text-xs bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono border border-cyan-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Detect. Analyze. Protect.</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile / Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/settings"
                className="btn-primary py-1.5 px-3 text-xs"
              >
                Guest Mode
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
