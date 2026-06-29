import React, { useState } from 'react';
import { FileText, Video, Sparkles, Cpu, Layers } from 'lucide-react';

export default function ContentUnderstandingTab() {
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities'>('overview');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="content-understanding-tab">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-sm mb-1">
          <Layers className="w-4 h-4 animate-pulse" />
          <span>AZURE AI CONTENT UNDERSTANDING</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans mt-2">
          Content Understanding API
        </h1>
        <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed">
          The newest pillar of the AI-901 certification. Learn how Azure AI unifies Form Recognizer, Computer Vision, and Speech into a single multimodal understanding pipeline for enterprise data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Navigation & Core Concepts */}
        <div className="space-y-6">
          <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-bold rounded-lg transition-all text-left flex items-center gap-3 ${
                activeTab === 'overview' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" /> The Unified API
            </button>
            <button
              onClick={() => setActiveTab('capabilities')}
              className={`px-4 py-3 text-sm font-bold rounded-lg transition-all text-left flex items-center gap-3 ${
                activeTab === 'capabilities' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" /> Multimodal Capabilities
            </button>
          </div>

          {/* Legacy Warning */}
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-5">
            <h3 className="text-sm font-bold text-rose-400 mb-2 font-mono uppercase tracking-wider">AI-900 Deprecation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the legacy AI-900 exam, candidates were tested heavily on standalone services like Form Recognizer and Custom Vision. For AI-901, these are consolidated under <strong>Azure AI Content Understanding</strong> and the <strong>Foundry SDK</strong>.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">What is Content Understanding?</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Azure AI Content Understanding is a unified platform service that processes multimodal data (documents, images, video, and audio) through a single REST API or SDK endpoint. It automatically determines the best combination of models to extract schemas, transcripts, and metadata.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1a1a20] p-4 rounded-lg border border-white/5">
                    <h3 className="text-teal-400 font-bold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Document Ingestion</h3>
                    <p className="text-xs text-slate-400">Extracts complex tables, key-value pairs, and handwriting from PDFs and Office docs.</p>
                  </div>
                  <div className="bg-[#1a1a20] p-4 rounded-lg border border-white/5">
                    <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><Video className="w-4 h-4" /> Video & Audio</h3>
                    <p className="text-xs text-slate-400">Generates transcripts, identifies speakers, and extracts visual action frames simultaneously.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Exam Focus: Schemas & Fields</h2>
                <div className="space-y-4">
                  <div className="border-l-2 border-teal-500 pl-4 py-1">
                    <h3 className="text-sm font-bold text-slate-200">Custom Schema Definition</h3>
                    <p className="text-xs text-slate-400 mt-1">Unlike old models where you had to train a custom Form Recognizer model with 5+ documents, Content Understanding allows you to provide a JSON schema describing the fields you want extracted, and the LLM backbone handles the rest zero-shot.</p>
                  </div>
                  <div className="border-l-2 border-teal-500 pl-4 py-1">
                    <h3 className="text-sm font-bold text-slate-200">Grounding & Confidence</h3>
                    <p className="text-xs text-slate-400 mt-1">Every extracted field returns a confidence score and a bounding box (polygon) mapping exactly where the information was found in the source document, critical for auditing.</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-[#0a0a0c] p-4 rounded-lg border border-white/5 font-mono text-xs">
                  <div className="text-slate-500 mb-2">// Example Output</div>
                  <div className="text-teal-300">"merchant_name": {`{`}</div>
                  <div className="text-slate-300 ml-4">"value": "Contoso Coffee",</div>
                  <div className="text-slate-300 ml-4">"confidence": 0.98,</div>
                  <div className="text-slate-300 ml-4">"bounding_box": [120, 45, 230, 60]</div>
                  <div className="text-teal-300">{`}`}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
