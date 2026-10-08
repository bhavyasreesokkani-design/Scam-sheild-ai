import React, { useState } from 'react';
import { ShieldCheck, Bell, ChevronDown, Menu, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userName = user?.name || "Bhavya Sree";
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[#020B18]/95 backdrop-blur-md border-b border-[#123A68] h-16 flex items-center px-4 sm:px-6 justify-between">
      {/* LEFT: Logo & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#07182D] border border-[#123A68]"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-[#1683FF] to-[#2F9BFF] rounded-xl shadow-lg shadow-[#1683FF]/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1">
              Scam Shield <span className="text-[#2F9BFF]">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">Detect. Analyze. Protect.</p>
          </div>
        </Link>
      </div>

      {/* RIGHT: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#07182D] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF4D6D] ring-2 ring-[#020B18]"></span>
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-[#07182D] rounded-xl border border-transparent hover:border-[#123A68] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1683FF] to-[#2F9BFF] text-white flex items-center justify-center font-bold text-xs shadow-md font-mono">
              {userInitials}
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#07182D] border border-[#123A68] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[#123A68]">
                <p className="text-xs font-bold text-slate-200">{userName}</p>
                <p className="text-[10px] font-mono text-slate-400">Security Analyst</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-[#0c213c]"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-[#2F9BFF]" /> Profile / Settings
              </Link>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-[#FF4D6D] hover:bg-[#0c213c]"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
