import React, { useState } from 'react';
import { scanImage } from '../services/api';
import RiskMeter from '../components/RiskMeter';
import HighlightedText from '../components/HighlightedText';
import { Image as ImageIcon, UploadCloud, FileText, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

const ImageScanner = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleScanImage = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image screenshot file to upload.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await scanImage(selectedFile);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to scan image. Ensure file is a valid JPG, PNG, or WEBP image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <ImageIcon className="w-7 h-7 text-cyan-400" /> Image & Screenshot OCR Scanner
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Upload screenshots of suspicious SMS messages, WhatsApp chats, or payment receipts. Our Optical Character Recognition (OCR) engine extracts and evaluates scam patterns.
        </p>
      </div>

      {/* Upload Dropzone Card */}
      <div className="card space-y-6">
        <form onSubmit={handleScanImage} className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950 p-8 rounded-xl text-center cursor-pointer transition-colors relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img src={previewUrl} alt="Preview" className="max-h-56 object-contain rounded-lg border border-slate-800" />
                <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedFile?.name}</span>
                <span className="text-[11px] text-slate-400">Click or drag a new image to replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <UploadCloud className="w-10 h-10 text-cyan-400 animate-bounce" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Drag and drop screenshot here, or browse files</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, JPEG, PNG, WEBP (Max size 10MB)</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={loading || !selectedFile} className="btn-primary py-2.5 px-6">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running OCR & AI Analysis...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" /> Extract & Analyze Screenshot
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="card card-glowing space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              OCR Image Analysis Result
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Scam Classification: <span className="text-cyan-400">{result.scam_type}</span>
            </h2>
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
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Extracted Text (OCR Engine Output)
                </h3>
                <HighlightedText
                  text={result.input_text}
                  phrases={result.result.highlighted_phrases}
                />
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Detected Risk Indicators
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

export default ImageScanner;
