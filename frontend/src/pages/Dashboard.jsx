import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDashboardStats,
  getScanActivity,
  getScamCategories,
  getRiskDistribution,
  getRecentScans,
  getRecentReports
} from '../services/api';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar, LabelList
} from 'recharts';

import {
  Scan,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Link as LinkIcon,
  MessageSquare,
  Mail,
  Image as ImageIcon,
  Briefcase,
  MessageCircle,
  Building,
  Award,
  Shield,
  Search,
  PhoneCall,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Data states
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [riskDist, setRiskDist] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, actRes, catRes, riskRes, scansRes, repsRes] = await Promise.all([
        getDashboardStats(),
        getScanActivity(),
        getScamCategories(),
        getRiskDistribution(),
        getRecentScans(),
        getRecentReports()
      ]);

      setStats(statsRes);
      setActivity(actRes);
      setCategories(catRes);
      setRiskDist(riskRes);
      setRecentScans(scansRes);
      setRecentReports(repsRes);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScanIcon = (iconType) => {
    switch (iconType) {
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-[#FFAA3B]" />;
      case 'Mail': return <Mail className="w-4 h-4 text-[#FF4D6D]" />;
      case 'Image': return <ImageIcon className="w-4 h-4 text-[#20D98B]" />;
      case 'Link2':
      default: return <LinkIcon className="w-4 h-4 text-[#2F9BFF]" />;
    }
  };

  const getReportIcon = (iconType) => {
    switch (iconType) {
      case 'MessageCircle': return <MessageCircle className="w-4 h-4 text-[#20D98B]" />;
      case 'Building': return <Building className="w-4 h-4 text-[#FFAA3B]" />;
      case 'Award': return <Award className="w-4 h-4 text-[#FFAA3B]" />;
      case 'Briefcase':
      default: return <Briefcase className="w-4 h-4 text-[#FF4D6D]" />;
    }
  };

  const getRiskBadgeStyle = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'CRITICAL':
        return 'bg-[#5c0011] text-[#FF4D6D] border border-[#8b001a] font-bold';
      case 'HIGH':
        return 'bg-[#4d0d1c] text-[#FF4D6D] border border-[#80162e]';
      case 'MEDIUM':
        return 'bg-[#472c06] text-[#FFAA3B] border border-[#7a4c0a]';
      case 'LOW':
      default:
        return 'bg-[#093822] text-[#20D98B] border border-[#105937]';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#1683FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-400 font-mono">Loading Scam Shield AI Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. GREETING BANNER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, <span className="text-[#2F9BFF]">Bhavya Sree</span> 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Stay one step ahead of online scams. Scan, analyze and stay protected.
        </p>
      </div>

      {/* 2. FOUR KPI STATISTICS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Total Scans */}
        <div className="card border-[#123A68] bg-[#07182D] hover:border-[#2F9BFF]/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Scans</span>
            <div className="w-10 h-10 rounded-full bg-[#1683FF]/20 text-[#2F9BFF] flex items-center justify-center border border-[#1683FF]/40 shadow-sm shadow-[#1683FF]/20">
              <Scan className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-white font-mono">{stats?.totalScans?.value || 247}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-bold text-[#20D98B] flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> {stats?.totalScans?.change || '↑ 12%'}
              </span>
              <span className="text-slate-400 text-[11px]">{stats?.totalScans?.comparison || 'vs. last 7 days'}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Scams Detected */}
        <div className="card border-[#FF4D6D]/30 bg-[#07182D] hover:border-[#FF4D6D]/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Scams Detected</span>
            <div className="w-10 h-10 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center border border-[#FF4D6D]/40 shadow-sm shadow-[#FF4D6D]/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-white font-mono">{stats?.scamsDetected?.value || 68}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-bold text-[#FF4D6D] flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> {stats?.scamsDetected?.change || '↑ 18%'}
              </span>
              <span className="text-slate-400 text-[11px]">{stats?.scamsDetected?.comparison || 'vs. last 7 days'}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Safe Messages */}
        <div className="card border-[#20D98B]/30 bg-[#07182D] hover:border-[#20D98B]/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Safe Messages</span>
            <div className="w-10 h-10 rounded-full bg-[#20D98B]/20 text-[#20D98B] flex items-center justify-center border border-[#20D98B]/40 shadow-sm shadow-[#20D98B]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-white font-mono">{stats?.safeMessages?.value || 173}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-bold text-[#20D98B] flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> {stats?.safeMessages?.change || '↑ 9%'}
              </span>
              <span className="text-slate-400 text-[11px]">{stats?.safeMessages?.comparison || 'vs. last 7 days'}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: High Risk Scans */}
        <div className="card border-[#FFAA3B]/30 bg-[#07182D] hover:border-[#FFAA3B]/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High Risk Scans</span>
            <div className="w-10 h-10 rounded-full bg-[#FFAA3B]/20 text-[#FFAA3B] flex items-center justify-center border border-[#FFAA3B]/40 shadow-sm shadow-[#FFAA3B]/20">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-white font-mono">{stats?.highRiskScans?.value || 42}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-bold text-[#FFAA3B] flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> {stats?.highRiskScans?.change || '↑ 25%'}
              </span>
              <span className="text-slate-400 text-[11px]">{stats?.highRiskScans?.comparison || 'vs. last 7 days'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD GRID (Left 60% / Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols wide on Desktop ~60%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SCAN ACTIVITY OVERVIEW CHART */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Scan Activity Overview</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#20D98B]"></span> Safe
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]"></span> Scam
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFAA3B]"></span> High Risk
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#20D98B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#20D98B" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorScam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFAA3B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFAA3B" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#123A68" opacity={0.4} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07182D', borderColor: '#123A68', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="Safe" stroke="#20D98B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSafe)" />
                  <Area type="monotone" dataKey="Scam" stroke="#FF4D6D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScam)" />
                  <Area type="monotone" dataKey="HighRisk" stroke="#FFAA3B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHighRisk)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECOND ROW: Donut & Bar Chart (50/50 split) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SCAM CATEGORIES DONUT CHART */}
            <div className="card space-y-3">
              <h3 className="text-base font-bold text-slate-100">Scam Categories</h3>
              
              <div className="flex items-center justify-between">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-white font-mono">68</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Scams</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 pl-4 text-xs font-medium">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                        <span className="text-slate-300 text-[11px] truncate">{cat.name}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] ml-2">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RISK LEVEL DISTRIBUTION BAR CHART */}
            <div className="card space-y-3">
              <h3 className="text-base font-bold text-slate-100">Risk Level Distribution</h3>
              
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDist} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="level" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#07182D', borderColor: '#123A68', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={11} />
                      {riskDist.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECENT REPORTS CARD */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Recent Reports</h3>
              <Link to="/reports" className="text-xs text-[#2F9BFF] hover:underline flex items-center gap-0.5 font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentReports.map((rep) => (
                <div key={rep.id} className="p-3 bg-[#041021] rounded-xl border border-[#123A68] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-[#07182D] rounded-lg border border-[#123A68]">
                      {getReportIcon(rep.iconType)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{rep.title}</h4>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{rep.sender}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      rep.status === 'Fraud' 
                        ? 'bg-[#4d0d1c] text-[#FF4D6D] border border-[#80162e]' 
                        : 'bg-[#472c06] text-[#FFAA3B] border border-[#7a4c0a]'
                    }`}>
                      {rep.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{rep.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (~320px wide: Recent Scans + Scan Now) */}
        <div className="space-y-6">
          {/* RECENT SCANS PANEL */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Recent Scans</h3>
              <Link to="/history" className="text-xs text-[#2F9BFF] hover:underline flex items-center gap-0.5 font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="p-3 bg-[#041021] rounded-xl border border-[#123A68] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-[#07182D] rounded-lg border border-[#123A68] flex-shrink-0">
                      {getScanIcon(scan.iconType)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{scan.type}</h4>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{scan.content}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${getRiskBadgeStyle(scan.riskLevel)}`}>
                      {scan.riskLevel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{scan.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SCAN NOW PROMINENT PANEL */}
          <div className="card bg-gradient-to-b from-[#0a2347] via-[#07182D] to-[#07182D] border-[#1683FF]/40 p-6 text-center space-y-4 shadow-xl shadow-[#1683FF]/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1683FF] to-[#2F9BFF] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#1683FF]/40 border border-[#2F9BFF]/40">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Scan Now</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                Paste a message, URL, or upload an image to check for scams.
              </p>
            </div>

            <button
              onClick={() => navigate('/scanner')}
              className="w-full btn-primary py-3 text-sm font-bold shadow-lg shadow-[#1683FF]/30 flex items-center justify-center gap-2 rounded-full"
            >
              <Search className="w-4 h-4" /> Start Scan
            </button>

            {/* Quick Option Buttons Grid (2x2) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate('/scanner')}
                className="p-2.5 bg-[#041021] hover:bg-[#0c213c] text-slate-200 rounded-xl border border-[#123A68] flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#FFAA3B]" /> Text / SMS
              </button>
              <button
                onClick={() => navigate('/url-checker')}
                className="p-2.5 bg-[#041021] hover:bg-[#0c213c] text-slate-200 rounded-xl border border-[#123A68] flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#2F9BFF]" /> URL
              </button>
              <button
                onClick={() => navigate('/image-scanner')}
                className="p-2.5 bg-[#041021] hover:bg-[#0c213c] text-slate-200 rounded-xl border border-[#123A68] flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#20D98B]" /> Image
              </button>
              <button
                disabled
                className="p-2.5 bg-[#030914] text-slate-600 rounded-xl border border-[#0d213b] flex items-center justify-center gap-1.5 text-[11px] font-medium cursor-not-allowed opacity-50"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DASHBOARD FOOTER */}
      <footer className="pt-6 border-t border-[#123A68] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-mono">
        <div>Scam Shield AI <span className="text-[10px] bg-[#07182D] px-1.5 py-0.5 rounded text-slate-300 border border-[#123A68]">v1.0.0</span></div>
        <div className="text-slate-400">Safer Internet • Smarter You</div>
        <div className="flex items-center gap-1 text-[#2F9BFF] font-semibold">
          <Shield className="w-3.5 h-3.5" /> Powered by AI
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
