import React, { useEffect, useState } from 'react';
import { getEducationData } from '../services/api';
import { BookOpen, ShieldCheck, AlertTriangle, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

const ScamEducation = () => {
  const [eduData, setEduData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEdu();
  }, []);

  const fetchEdu = async () => {
    try {
      setLoading(true);
      const data = await getEducationData();
      setEduData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center font-mono text-slate-400 text-xs">Loading Cybersecurity Education Guides...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-400" /> Scam Awareness & Cybersecurity Education
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Knowledge is your first line of defense. Learn to recognize common digital scam tactics, red flags, and safety guidelines.
        </p>
      </div>

      {/* GOLDEN SAFETY RULES CARD */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-2xl border border-cyan-800/60 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">HOW TO STAY SAFE – GOLDEN RULES</h2>
            <p className="text-xs text-slate-400">Essential rules to protect yourself from online financial fraud</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {eduData?.safety_rules?.map((rule, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200 font-medium leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SCAM TYPE GUIDES GRID */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" /> Common Digital Scam Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eduData?.scam_guides?.map((guide) => (
            <div key={guide.id} className="card space-y-4 hover:border-cyan-800/50 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                  {guide.title}
                </h3>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Guide
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{guide.description}</p>

              <div className="space-y-2">
                <h4 className="text-[11px] font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Critical Red Flags
                </h4>
                <ul className="space-y-1">
                  {guide.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold mb-1">
                  Prevention Rule
                </h4>
                <p className="text-xs text-slate-200 font-medium">{guide.prevention}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScamEducation;
