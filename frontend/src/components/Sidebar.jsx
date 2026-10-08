import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanSearch, 
  BrainCircuit, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  History, 
  Flag, 
  BookOpen, 
  PhoneCall, 
  Settings, 
  ShieldCheck,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const coreModules = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scanner', label: 'Scan for Scam', icon: ScanSearch },
    { to: '/scanner', label: 'AI Engine', icon: BrainCircuit },
    { to: '/url-checker', label: 'URL Checker', icon: LinkIcon },
    { to: '/image-scanner', label: 'Image Scanner', icon: ImageIcon },
  ];

  const threatIntelligence = [
    { to: '/history', label: 'Scan History', icon: History },
    { to: '/reports', label: 'Scam Reports', icon: Flag },
    { to: '/education', label: 'Scam Education', icon: BookOpen },
    { to: '/call-analysis', label: 'Call Shield Preview', icon: PhoneCall },
  ];

  const systemControls = [
    { to: '/settings', label: 'Profile / Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[230px] bg-[#020B18] border-r border-[#123A68] flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Top Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#123A68] lg:hidden">
            <span className="text-sm font-bold text-white">Menu</span>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#07182D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-4 pt-4 overflow-y-auto max-h-[calc(100vh-170px)]">
            {/* CORE DETECTION MODULES */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 font-semibold block mb-1.5">
                CORE DETECTION MODULES
              </span>
              <nav className="space-y-1">
                {coreModules.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={`${item.to}-${idx}`}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#1683FF] to-[#0062d6] text-white shadow-lg shadow-[#1683FF]/30 font-bold border border-[#2F9BFF]/40' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#07182D]'}
                      `}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* THREAT INTELLIGENCE */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 font-semibold block mb-1.5">
                THREAT INTELLIGENCE
              </span>
              <nav className="space-y-1">
                {threatIntelligence.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#1683FF] to-[#0062d6] text-white shadow-lg shadow-[#1683FF]/30 font-bold border border-[#2F9BFF]/40' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#07182D]'}
                      `}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* SYSTEM CONTROLS */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 font-semibold block mb-1.5">
                SYSTEM CONTROLS
              </span>
              <nav className="space-y-1">
                {systemControls.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#1683FF] to-[#0062d6] text-white shadow-lg shadow-[#1683FF]/30 font-bold border border-[#2F9BFF]/40' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#07182D]'}
                      `}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Stay Alert Card */}
        <div className="p-3">
          <div className="p-3.5 bg-gradient-to-br from-[#0a2347]/90 to-[#07182D] rounded-xl border border-[#123A68] shadow-lg flex items-start gap-3">
            <div className="p-2 bg-[#1683FF]/20 text-[#2F9BFF] rounded-lg flex-shrink-0 border border-[#1683FF]/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Stay Alert</h4>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                Think before you click.<br />Your safety matters!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
