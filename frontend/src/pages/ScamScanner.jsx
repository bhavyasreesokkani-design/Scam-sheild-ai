import React, { useState } from 'react';
import { scanText, scanEmail, submitFeedback, submitReport } from '../services/api';
import RiskMeter from '../components/RiskMeter';
import HighlightedText from '../components/HighlightedText';
import { Scan, Mail, MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, ShieldCheck, Flag, CheckCircle, RefreshCw, Send } from 'lucide-react';

const ScamScanner = () => {
  const [tab, setTab] = useState('text'); // 'text' or 'email'
  const [textInput, setTextInput] = useState('');
  
  // Email fields
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Feedback & Report States
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const sampleScams = [
    {
      label: 'Phishing (SBI Banking)',
      text: 'URGENT! Your SBI account has been suspended due to pending KYC. Click http://sbi-kyc-verify-update.xyz/login immediately to unblock your account within 24 hours.'
    },
    {
      label: 'Financial (Lottery Prize)',
      text: 'Congratulations! Your mobile number won ₹500,000 in Kaun Banega Crorepati lucky draw. Deposit ₹2,500 registration fee to claim your cash prize now.'
    },
    {
      label: 'Job Scam (Work From Home)',
      text: 'Work From Home Job Offer: International company hiring Data Entry Operators. Salary ₹45,000/month. Pay ₹1,500 registration fee to get work kit.'
    },
    {
      label: 'Safe College Message',
      text: 'Your college project review meeting is scheduled for tomorrow at 10 AM in Room 304. Please bring your slides.'
    }
  ];

  const handleScan = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setFeedbackSubmitted(false);
    setReportSuccess(false);

    try {
      setLoading(true);
      let data;
      if (tab === 'text') {
        if (!textInput.trim()) {
          setError('Please enter or paste a text message to analyze.');
          setLoading(false);
          return;
        }
        data = await scanText(textInput);
      } else {
        if (!emailBody.trim()) {
          setError('Please enter the email body content to analyze.');
          setLoading(false);
          return;
        }
        data = await scanEmail(emailSubject, emailBody, emailSender);
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during scan execution. Ensure the backend is online.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackType) => {
    if (!result || feedbackSubmitted) return;
    try {
      await submitFeedback(result.id, feedbackType);
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!result) return;
    try {
      await submitReport({
        title: `Flagged ${result.scam_type} (${result.input_type})`,
        content: result.input_text,
        category: result.scam_type,
        scam_url: result.extracted_url || ''
      });
      setReportSuccess(true);
      setTimeout(() => setReportModalOpen(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <Scan className="w-7 h-7 text-cyan-400" /> Scam Scanner Engine
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Paste any suspicious SMS, WhatsApp message, or Email below. Our AI and Rule Engine will analyze phishing indicators and calculate risk.
        </p>
      </div>

      {/* Input Card */}
      <div className="card space-y-6">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 pb-3 gap-3">
          <button
            onClick={() => setTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              tab === 'text'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Text / SMS / WhatsApp
          </button>
          <button
            onClick={() => setTab('email')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              tab === 'email'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" /> Email Content
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Try Sample Inputs:</span>
          <div className="flex flex-wrap gap-2">
            {sampleScams.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTab('text');
                  setTextInput(s.text);
                }}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 px-3 py-1 rounded-md border border-slate-800 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleScan} className="space-y-4">
          {tab === 'text' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Paste Suspicious Text / Message
              </label>
              <textarea
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste message content here... e.g. 'URGENT! Your bank account will be blocked. Click this link...'"
                className="font-sans"
              ></textarea>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Email Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Account Security Suspension Notice"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Sender Email / Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    placeholder="e.g. support@sbi-update-verify.xyz"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Email Body Content
                </label>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Paste full email body here..."
                ></textarea>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Content...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" /> Scan for Scam
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SCAN RESULT DISPLAY */}
      {result && (
        <div className="card card-glowing space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Security Assessment Result
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Classification: <span className="text-cyan-400">{result.scam_type}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportModalOpen(true)}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                <Flag className="w-3.5 h-3.5 text-rose-400" /> Report Scam
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Meter Gauge */}
            <div className="flex items-center justify-center">
              <RiskMeter
                score={result.risk_score}
                level={result.risk_level}
                confidence={result.confidence}
              />
            </div>

            {/* Explanation & Flags */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Highlighted Suspicious Language
                </h3>
                <HighlightedText
                  text={result.input_text}
                  phrases={result.result.highlighted_phrases}
                />
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Why Was This Flagged?
                </h3>
                <ul className="space-y-1.5">
                  {result.result.indicators.map((ind, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                      <span className="text-rose-400 font-bold">🔴</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Recommended Action
                </h3>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-300 leading-relaxed font-semibold">
                  {result.result.recommendation}
                </div>
              </div>

              {/* Feedback Loop */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Was this detection prediction accurate?</span>
                {feedbackSubmitted ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-4 h-4" /> Feedback Saved
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeedback('Correct')}
                      className="px-3 py-1 bg-slate-800 hover:bg-emerald-950 text-emerald-300 rounded border border-slate-700 flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Correct
                    </button>
                    <button
                      onClick={() => handleFeedback('Incorrect')}
                      className="px-3 py-1 bg-slate-800 hover:bg-rose-950 text-rose-300 rounded border border-slate-700 flex items-center gap-1"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Incorrect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-400" /> Submit Scam Report
            </h3>
            <p className="text-xs text-slate-400">
              Your report helps Scam Shield AI update threat intelligence and protect other users.
            </p>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-lg text-center text-emerald-300 text-sm">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                Thank you! Your report has been logged successfully.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scam Type</label>
                  <input type="text" value={result?.scam_type || ''} readOnly className="bg-slate-950 opacity-80" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Content</label>
                  <textarea rows={3} value={result?.input_text || ''} readOnly className="bg-slate-950 text-xs opacity-80"></textarea>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setReportModalOpen(false)} className="btn-secondary py-1.5 px-3 text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-1.5 px-4 text-xs">
                    <Send className="w-3.5 h-3.5" /> Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScamScanner;
