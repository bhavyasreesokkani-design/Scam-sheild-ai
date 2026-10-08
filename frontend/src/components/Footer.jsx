import React from 'react';
import { Shield, Lock, EyeOff, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 text-sm">Scam Shield AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-3">
            AI-Powered Scam Detection and Real-Time Protection Platform. Empowering individuals and organizations to identify phishing, financial fraud, and malicious links before harm occurs.
          </p>
          <p className="text-[11px] text-slate-400">© 2026 Scam Shield AI. All rights reserved.</p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Security & Privacy Guarantees</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>JWT Authenticated & ORM Encrypted Data</span>
            </li>
            <li className="flex items-center gap-2">
              <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero Permanent Image Storage Policy</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transparent Explainable AI Risk Indicators</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Official Helplines & Portals</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span>National Cyber Crime Reporting Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="tel:1930" className="hover:text-cyan-400 transition-colors">
                Cyber Financial Fraud Helpline: <strong className="text-slate-200">1930</strong>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
