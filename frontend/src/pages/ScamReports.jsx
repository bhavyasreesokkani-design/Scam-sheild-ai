import React, { useEffect, useState } from 'react';
import { getReports, submitReport } from '../services/api';
import { Flag, Plus, Send, ShieldCheck, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ScamReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Phishing');
  const [scamUrl, setScamUrl] = useState('');
  const [content, setContent] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (!title || !content) return;

    try {
      setSubmitting(true);
      const newReport = await submitReport({
        title,
        category,
        scam_url: scamUrl,
        content
      });
      setReports([newReport, ...reports]);
      setSuccessMsg('Thank you. Your report helps improve Scam Shield AI.');
      setTimeout(() => {
        setModalOpen(false);
        setTitle('');
        setScamUrl('');
        setContent('');
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Flag className="w-6 h-6 text-cyan-400" /> Community Threat Intelligence & Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Community-contributed scam reports, malicious URLs, and threat advisories verified by security analysts.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> Report New Scam
        </button>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center font-mono text-slate-400 text-xs">Loading Community Reports...</div>
        ) : reports.length === 0 ? (
          <div className="card text-center p-12 text-slate-400 text-sm">No scam reports submitted yet. Be the first to report!</div>
        ) : (
          reports.map((rep) => (
            <div key={rep.id} className="card hover:border-slate-700 transition-colors space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                      {rep.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                      rep.status === 'Verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {rep.status === 'Verified' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {rep.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{rep.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(rep.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rep.content}</p>

              {rep.scam_url && (
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged Address: {rep.scam_url}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* SUBMIT REPORT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-cyan-400" /> Report Suspicious Scam
            </h3>
            <p className="text-xs text-slate-400">
              Submit details of a suspicious message, phone call, or website to alert the community.
            </p>

            {successMsg ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-lg text-center text-emerald-300 text-sm">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Report Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fake SBI KYC Suspension WhatsApp Message"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-slate-950 text-xs"
                    >
                      <option value="Phishing">Phishing</option>
                      <option value="Financial Scam">Financial Scam</option>
                      <option value="Job Scam">Job Scam</option>
                      <option value="Impersonation">Impersonation</option>
                      <option value="UPI Scam">UPI Scam</option>
                      <option value="Lottery Scam">Lottery Scam</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Scam URL / Number (Optional)</label>
                    <input
                      type="text"
                      value={scamUrl}
                      onChange={(e) => setScamUrl(e.target.value)}
                      placeholder="e.g. http://sbi-fake.xyz"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content / Details</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe how the scam operates or paste message text..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-1.5 px-3 text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary py-1.5 px-4 text-xs">
                    <Send className="w-3.5 h-3.5" /> Submit Scam Report
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

export default ScamReports;
