import React, { useState } from 'react';
import { PhoneCall, Mic, Radio, Cpu, ShieldAlert, AlertTriangle, Layers, Play, Square, Info } from 'lucide-react';
import AlertBadge from '../components/AlertBadge';

const CallAnalysisPreview = () => {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const startSimulation = () => {
    setSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 2000);
    setTimeout(() => setSimStep(3), 4000);
    setTimeout(() => setSimStep(4), 6000);
  };

  const stopSimulation = () => {
    setSimulating(false);
    setSimStep(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <PhoneCall className="w-7 h-7 text-cyan-400" /> Real-Time Call Scam Shield Architecture
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Future-Ready Voice Call Security Module. Designed for low-latency audio stream transcription, deepfake detection, and real-time call warning alerts.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-amber-300 text-xs">
        <Info className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-200">Architecture Preview Notice:</strong>
          <p className="mt-0.5 leading-relaxed text-slate-300">
            Live OS-level cellular voice tapping is governed by telco APIs. Below is the full system architecture diagram and interactive voice transcription simulation preview ready for telephony SDK integration.
          </p>
        </div>
      </div>

      {/* SIMULATION DEMO CARD */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Voice Stream Analyzer Simulation
          </h2>
          <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            Interactive Prototype
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Incoming Call Stream:</span>
                <span className="text-rose-400 font-mono font-bold">+91 98765-XXXXX (Unknown Caller)</span>
              </div>

              {!simulating ? (
                <button onClick={startSimulation} className="btn-primary w-full py-2.5 text-xs">
                  <Play className="w-4 h-4" /> Start Simulated Call Test
                </button>
              ) : (
                <button onClick={stopSimulation} className="btn-secondary w-full py-2.5 text-xs bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900">
                  <Square className="w-4 h-4" /> Stop Call Simulation
                </button>
              )}
            </div>

            {/* Live Audio Transcript Simulation Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 min-h-[160px]">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Speech-to-Text Live Transcript</span>
              {simStep === 0 && (
                <p className="text-xs text-slate-400 italic">Click "Start Simulated Call Test" to simulate live call analysis...</p>
              )}
              {simStep >= 1 && (
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-cyan-400">Caller:</strong> "Hello, I am calling from TRAI Head Office. Your mobile SIM card will be deactivated within 2 hours..."
                </p>
              )}
              {simStep >= 2 && (
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-cyan-400">Caller:</strong> "To stop immediate disconnection, confirm your Aadhaar number and share the 6-digit OTP code sent to your handset..."
                </p>
              )}
              {simStep >= 3 && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-950/60 p-2 rounded border border-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 🚨 IN-CALL WARNING: Impersonation & OTP Request Detected!
                </p>
              )}
              {simStep >= 4 && (
                <p className="text-xs font-mono text-amber-300">
                  Automated Voice HUD: "Do NOT share your OTP. Hang up immediately."
                </p>
              )}
            </div>
          </div>

          {/* Call Risk Meter HUD */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Real-Time Call Threat Index</span>
            <div className="w-28 h-28 rounded-full border-4 border-rose-500 flex flex-col items-center justify-center bg-rose-950/20 shadow-lg shadow-rose-950">
              <span className="text-3xl font-extrabold font-mono text-rose-400">
                {simStep >= 3 ? '89' : simStep >= 1 ? '45' : '0'}
              </span>
              <span className="text-[9px] font-mono text-slate-400">/ 100 RISK</span>
            </div>
            {simStep >= 3 ? (
              <AlertBadge level="CRITICAL" score={89} />
            ) : (
              <AlertBadge level="LOW" score={0} />
            )}
          </div>
        </div>
      </div>

      {/* ARCHITECTURE DIAGRAM */}
      <div className="card space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Voice Call Scam Detection Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <Mic className="w-6 h-6 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">1. Audio Capture</h4>
            <p className="text-[11px] text-slate-400">Low-latency VoIP / SIP audio stream buffer</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <Cpu className="w-6 h-6 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">2. ASR Speech-to-Text</h4>
            <p className="text-[11px] text-slate-400">Whisper / Kaldi real-time streaming transcription</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <Radio className="w-6 h-6 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">3. NLP Intent Engine</h4>
            <p className="text-[11px] text-slate-400">Scam Shield NLP detects urgency, OTP requests & threats</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <ShieldAlert className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">4. Live HUD Warning</h4>
            <p className="text-[11px] text-slate-400">Heads-up pop-up alert over ongoing phone call</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallAnalysisPreview;
