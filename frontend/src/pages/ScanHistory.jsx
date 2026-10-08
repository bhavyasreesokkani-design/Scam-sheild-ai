import React, { useEffect, useState } from 'react';
import { getScansHistory, getScanDetails, deleteScan } from '../services/api';
import AlertBadge from '../components/AlertBadge';
import RiskMeter from '../components/RiskMeter';
import HighlightedText from '../components/HighlightedText';
import { History, Search, Filter, Eye, Trash2, X, RefreshCw } from 'lucide-react';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  // Modal detail
  const [selectedScan, setSelectedScan] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getScansHistory();
      setScans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setModalLoading(true);
      const detail = await getScanDetails(id);
      setSelectedScan(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteScan = async (id) => {
    if (!window.confirm(`Are you sure you want to delete scan record #${id}?`)) return;
    try {
      await deleteScan(id);
      setScans(scans.filter(s => s.id !== id));
      if (selectedScan && selectedScan.id === id) {
        setSelectedScan(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.input_text.toLowerCase().includes(search.toLowerCase()) ||
                          s.scam_type.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || s.risk_level === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" /> Security Scan Audit Logs
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Historical log of all analyzed text messages, emails, URLs, and image screenshots.
          </p>
        </div>
        <button onClick={fetchHistory} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search log content or scam category..."
            className="pl-9 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL RISK</option>
            <option value="HIGH">HIGH RISK</option>
            <option value="MEDIUM">MEDIUM RISK</option>
            <option value="LOW">LOW RISK</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">Loading Scan History...</div>
        ) : filteredScans.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No scan records found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Classification</th>
                  <th className="p-3.5">Analyzed Preview</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400">#{scan.id}</td>
                    <td className="p-3.5 font-mono uppercase text-cyan-400">{scan.input_type}</td>
                    <td className="p-3.5 font-semibold text-slate-200">{scan.scam_type}</td>
                    <td className="p-3.5 max-w-xs truncate text-slate-400">{scan.input_text}</td>
                    <td className="p-3.5">
                      <AlertBadge level={scan.risk_level} score={scan.risk_score} />
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {new Date(scan.created_at).toLocaleDateString()} {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(scan.id)}
                        className="p-1.5 bg-slate-800 hover:bg-cyan-950 text-cyan-400 rounded transition-colors"
                        title="View Audit Report"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteScan(scan.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                Scan Audit Report #{selectedScan.id}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                Classification: <span className="text-cyan-400">{selectedScan.scam_type}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-center">
                <RiskMeter
                  score={selectedScan.risk_score}
                  level={selectedScan.risk_level}
                  confidence={selectedScan.confidence}
                />
              </div>
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase block mb-1">Input Text</span>
                  <HighlightedText
                    text={selectedScan.input_text}
                    phrases={selectedScan.result.highlighted_phrases}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Detected Indicators</h3>
              <ul className="space-y-1">
                {selectedScan.result.indicators.map((ind, idx) => (
                  <li key={idx} className="text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    🔴 {ind}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-1">Recommendation</h3>
              <p className="text-xs text-amber-300 bg-slate-950 p-3 rounded border border-slate-800 font-semibold">
                {selectedScan.result.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
