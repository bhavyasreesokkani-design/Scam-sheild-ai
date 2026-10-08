import React, { useState } from 'react';
import { scanUrl } from '../services/api';
import RiskMeter from '../components/RiskMeter';
import { Link2, Globe, Shield, ShieldAlert, Lock, Unlock, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

const UrlChecker = () => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleUrls = [
    { label: 'Fake Banking Phishing', url: 'http://sbi-kyc-verify-update.xyz/login' },
    { label: 'Unencrypted IP Host', url: 'http://192.168.1.1/update.php' },
    { label: 'Brand Spoofing', url: 'http://amazon-account-verify.site/order' },
    { label: 'Safe Official URL', url: 'https://www.google.com' }
  ];

  const handleCheckUrl = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!urlInput.trim()) {
      setError('Please enter a valid URL to analyze.');
      return;
    }

    try {
      setLoading(true);
      const data = await scanUrl(urlInput);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze URL. Verify connection to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <Link2 className="w-7 h-7 text-cyan-400" /> URL & Domain Reputation Checker
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Analyze web domains for phishing indicators, HTTPS security, typosquatting, brand spoofing, and high-risk TLDs without visiting dangerous websites.
        </p>
      </div>

      {/* Input Box */}
      <div className="card space-y-4">
        {/* Sample Selectors */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Try Sample URLs:</span>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrlInput(s.url)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 px-3 py-1 rounded-md border border-slate-800 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCheckUrl} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter web address e.g. example.com or http://sbi-login.xyz"
              className="pl-9 font-mono text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 whitespace-nowrap">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Checking Domain...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" /> Check URL
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* RESULT CARDS */}
      {result && result.url_details && (
        <div className="card card-glowing space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                URL Security Breakdown
              </span>
              <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2 font-mono">
                {result.url_details.domain}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                result.url_details.https_status
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {result.url_details.https_status ? (
                  <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> HTTPS Encrypted</span>
                ) : (
                  <span className="flex items-center gap-1"><Unlock className="w-3.5 h-3.5" /> Unencrypted HTTP</span>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center">
              <RiskMeter
                score={result.risk_score}
                level={result.risk_level}
                confidence={result.confidence}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">Reputation Assessment</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">{result.url_details.reputation}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">Classification</span>
                  <span className="text-xs font-bold text-cyan-400 mt-1 block">{result.scam_type}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Technical Security Indicators
                </h3>
                <ul className="space-y-1.5">
                  {result.result.indicators.map((ind, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-rose-400 font-bold">🔴</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Security Recommendation
                </h3>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-300 leading-relaxed font-semibold">
                  {result.result.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlChecker;
