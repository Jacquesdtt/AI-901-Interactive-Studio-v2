import React, { useState } from 'react';
import { BookOpen, AlertCircle, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

export interface TopicDef {
  name: string;
  desc: string;
  detail: string | React.ReactNode;
}

interface TheoryBlockProps {
  summary: string;
  topics: TopicDef[];
  keyTerms: string[];
}

export function TheoryBlock({ summary, topics, keyTerms }: TheoryBlockProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-[#121216] border border-white/5 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Curriculum Summary
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Key Testable Concepts</h3>
        <div className="grid grid-cols-1 gap-3">
          {topics.map((topic, idx) => {
            const isExpanded = expandedTopic === `topic-${idx}`;
            return (
              <div 
                key={idx}
                onClick={() => setExpandedTopic(isExpanded ? null : `topic-${idx}`)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition-all duration-200 select-none ${
                  isExpanded 
                    ? 'bg-teal-950/20 border-teal-500/40 shadow-sm shadow-teal-500/5' 
                    : 'bg-[#121216] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">{topic.name}</span>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{topic.desc}</p>
                
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-teal-500/20 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                    <p className="leading-relaxed bg-[#0a0a0c] p-3 rounded border border-teal-500/10">{topic.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Key Terms</div>
        <div className="flex flex-wrap gap-2">
          {keyTerms.map((term, i) => (
            <span key={i} className="text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              #{term}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface MisconceptionDef {
  concept: string;
  reality: string;
  description: string;
  badge: string;
}

export function MisconceptionBlock({ misconceptions }: { misconceptions: MisconceptionDef[] }) {
  return (
    <div className="space-y-4 mt-8 pt-8 border-t border-white/10">
      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
        <AlertCircle className="w-4 h-4" /> Common Exam Misconceptions
      </h3>
      <div className="space-y-4">
        {misconceptions.map((item, index) => (
          <div key={index} className="p-4 bg-[#121216] rounded-lg border border-white/5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                {item.badge}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Theory:
              </div>
              <p className="text-sm font-semibold text-rose-300/90 pl-3 border-l border-rose-500/30">
                "{item.concept}"
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Reality:
              </div>
              <p className="text-sm font-bold text-emerald-400 pl-3 border-l border-emerald-400/30">
                {item.reality}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
