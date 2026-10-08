import React from 'react';

const HighlightedText = ({ text = '', phrases = [] }) => {
  if (!text) return null;
  if (!phrases || phrases.length === 0) {
    return <div className="text-slate-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">{text}</div>;
  }

  // Create Regex to find all matching phrases case-insensitively
  const escapedPhrases = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <div className="text-slate-200 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
      {parts.map((part, idx) => {
        const isMatch = phrases.some(p => p.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <span
              key={idx}
              className="highlight-scam"
              title="Flagged suspicious term/indicator"
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </div>
  );
};

export default HighlightedText;
