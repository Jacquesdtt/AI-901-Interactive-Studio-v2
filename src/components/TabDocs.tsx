import React, { useState, useEffect } from 'react';
import { useAi } from '../context/AiContext';
import {
  Search, BookOpen, Loader2, ShieldCheck, Database, Cpu, ArrowRight,
  Lightbulb, Sparkles, HelpCircle, FileText
} from 'lucide-react';
import JupyterMarkdown from './ui/JupyterMarkdown';

const RAG_TIPS = [
  "Retrieval-Augmented Generation (RAG) merges pre-trained LLMs with your database to ensure responses are grounded in real facts.",
  "Vector Embeddings represent text as high-dimensional coordinates. Semantic similarity is calculated using distance metrics like Cosine Similarity.",
  "pgvector is an open-source extension for PostgreSQL that enables storing and querying vector embeddings directly in your relational database.",
  "Document Chunking divides long PDFs into smaller sections. Proper chunk overlap prevents losing critical context at boundaries.",
  "The Feynman Technique recommends teaching a newly learned topic to your study companion in simple terms to spot gaps in your own knowledge.",
  "Active Recall is the practice of testing your memory during learning. Pairing RAG queries with SRS Flashcards increases retrieval strength.",
  "Prompt Augmentation works by injecting the retrieved context chunks directly into the LLM's system prompt prior to generation.",
  "Evaluation is crucial: Use precision, recall, and faithfulness metrics to measure how accurately your RAG pipeline retrieves and synthesizes facts.",
  "Hybrid Search combines traditional keyword search (BM25) with semantic vector search to produce highly accurate document rankings."
];

const RAG_STAGES = [
  { label: "Vectorizing Query", desc: "Generating embedding vectors from search text...", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { label: "Vector Database Query", desc: "Searching index via cosine similarity matching...", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { label: "Context Retrieval", desc: "Extracting relevant Microsoft Learn documentation chunks...", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { label: "Response Synthesis", desc: "Combining query + context and generating response...", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" }
];

const VECTOR_POINTS = [
  { x: 80, y: 100, fx: 80, fy: 112, label: "Foundry Agent SDK", id: "foundry", score: "0.42" },
  { x: 165, y: 55, fx: 165, fy: 120, label: "Azure OpenAI Service", id: "openai", score: "0.86" },
  { x: 120, y: 85, fx: 120, fy: 115, label: "pgvector Index Store", id: "pgvector", score: "0.95" },
  { x: 145, y: 110, fx: 145, fy: 122, label: "MLOps Pipelines", id: "mlops", score: "0.31" },
  { x: 95, y: 60, fx: 95, fy: 108, label: "Responsible AI Standards", id: "responsible", score: "0.55" },
];

function VectorSpaceGraph({ stage }: { stage: number }) {
  const origin = { x: 60, y: 125 };
  const queryPt = { x: 135, y: 75, fx: 135, fy: 118 };
  
  return (
    <div className="w-full max-w-sm bg-[#0c0c0d] border border-[#242426] rounded-xl p-4 flex flex-col items-center">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 self-start">
        <Database className="w-3.5 h-3.5 text-[#0078d4]" />
        Vector Space Database Graph
      </div>
      
      {/* 3D Coordinate Grid */}
      <div className="relative w-full h-[180px] bg-[#050507] border border-[#1e1e20] rounded-lg overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 220 160" className="w-full h-full text-slate-700">
          
          {/* 3D Wireframe Box Grid */}
          {/* Back Wall */}
          <path d="M 40,30 L 160,30 L 160,110 L 40,110 Z" fill="none" stroke="#131315" strokeWidth="0.5" strokeDasharray="1 1" />
          {/* Left Wall */}
          <path d="M 40,30 L 60,45 L 60,125 L 40,110 Z" fill="none" stroke="#131315" strokeWidth="0.5" strokeDasharray="1 1" />
          {/* Bottom floor plane */}
          <path d="M 40,110 L 60,125 L 180,125 L 160,110 Z" fill="none" stroke="#1a1a1d" strokeWidth="0.5" />

          {/* 3D Coordinate Axes (origin at [60,125]) */}
          {/* X Axis (Right) */}
          <line x1={origin.x} y1={origin.y} x2="180" y2="125" stroke="#242426" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="175" y="132" fontSize="5" fontWeight="bold" fill="#475569">X</text>
          
          {/* Y Axis (Up) */}
          <line x1={origin.x} y1={origin.y} x2="60" y2="35" stroke="#242426" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="52" y="33" fontSize="5" fontWeight="bold" fill="#475569">Y</text>

          {/* Z Axis (Depth - Diagonal Left) */}
          <line x1={origin.x} y1={origin.y} x2="40" y2="110" stroke="#242426" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="32" y="107" fontSize="5" fontWeight="bold" fill="#475569">Z</text>

          {/* SVG Arrow Marker */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#242426" />
            </marker>
          </defs>

          {/* Database Vector Nodes */}
          {VECTOR_POINTS.map((pt) => {
            const isMatch = pt.id === "pgvector" || pt.id === "openai";
            const showConnection = stage >= 1 && isMatch;
            
            return (
              <g key={pt.id} className="transition-all duration-300">
                {/* Floor Projection Shadows & Drop Lines */}
                <circle cx={pt.fx} cy={pt.fy} r="1.5" fill="#1e1e20" className="opacity-60" />
                <line x1={pt.fx} y1={pt.fy} x2={pt.x} y2={pt.y} stroke="#1e1e20" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                
                {/* Distance similarity link lines */}
                {showConnection && (
                  <line 
                    x1={queryPt.x} 
                    y1={queryPt.y} 
                    x2={pt.x} 
                    y2={pt.y} 
                    stroke={pt.id === "pgvector" ? "#2dd4bf" : "#0078d4"} 
                    strokeWidth="1" 
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                )}
                
                {/* Node dot (Z-depth scaling) */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isMatch && stage >= 1 ? 5 : 4} 
                  fill={isMatch && stage >= 1 ? (pt.id === "pgvector" ? "#2dd4bf" : "#0078d4") : "#334155"} 
                  className={`transition-all duration-300 ${isMatch && stage >= 1 ? "animate-pulse" : ""}`}
                />
                
                {/* Label text */}
                <text 
                  x={pt.x} 
                  y={pt.y - 8} 
                  fontSize="6.5" 
                  fontWeight="bold"
                  textAnchor="middle" 
                  fill={isMatch && stage >= 1 ? "#f8fafc" : "#64748b"}
                  className="transition-colors duration-300"
                >
                  {pt.label}
                </text>
                
                {/* Cosine similarity rating */}
                {showConnection && (
                  <g>
                    <rect 
                      x={(pt.x + queryPt.x) / 2 - 18} 
                      y={(pt.y + queryPt.y) / 2 - 5} 
                      width="36" 
                      height="8" 
                      rx="2" 
                      fill="#0d0d12" 
                      stroke={pt.id === "pgvector" ? "#2dd4bf" : "#0078d4"} 
                      strokeOpacity="0.4"
                      strokeWidth="0.5" 
                    />
                    <text 
                      x={(pt.x + queryPt.x) / 2} 
                      y={(pt.y + queryPt.y) / 2 + 1} 
                      fontSize="5" 
                      textAnchor="middle" 
                      fontWeight="bold"
                      fill={pt.id === "pgvector" ? "#2dd4bf" : "#0078d4"}
                    >
                      sim: {pt.score}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* User Query Vector */}
          {stage >= 0 && (
            <g>
              {/* Floor Projection Shadow & Drop Line */}
              <circle cx={queryPt.fx} cy={queryPt.fy} r="1.5" fill="#a855f7" className="opacity-60" />
              <line x1={queryPt.fx} y1={queryPt.fy} x2={queryPt.x} y2={queryPt.y} stroke="#a855f7" strokeWidth="0.5" strokeDasharray="1.5 1.5" className="opacity-40" />

              {/* Pulsing search rings around floor drop */}
              {stage === 1 && (
                <circle 
                  cx={queryPt.x} 
                  cy={queryPt.y} 
                  r="25" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="0.5" 
                  className="opacity-40 animate-ping"
                  style={{ transformOrigin: `${queryPt.x}px ${queryPt.y}px` }}
                />
              )}
              
              {/* Embedding arrow line */}
              <line 
                x1={origin.x} 
                y1={origin.y} 
                x2={queryPt.x} 
                y2={queryPt.y} 
                stroke="#a855f7" 
                strokeWidth="1.5" 
                markerEnd="url(#query-arrow)" 
                strokeDasharray={stage === 0 ? "4 4" : "none"}
                className={stage === 0 ? "animate-pulse" : ""}
              />
              <defs>
                <marker id="query-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                </marker>
              </defs>

              {/* Query Dot */}
              <circle cx={queryPt.x} cy={queryPt.y} r="3.5" fill="#a855f7" />
              <text x={queryPt.x} y={queryPt.y - 8} fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#d8b4fe">
                User Query Vector
              </text>
            </g>
          )}
        </svg>
      </div>
      <div className="w-full mt-3 flex items-center justify-between text-[8px] font-mono text-slate-500 border-t border-[#1e1e20] pt-2">
        <span>Dim: 1536 (Ada-002)</span>
        <span className="flex items-center gap-1 text-[#2dd4bf]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping" />
          Cosine Distance Search Active
        </span>
      </div>
    </div>
  );
}

function RagVisualLoader() {
  const [stage, setStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle stages rapidly to show live pipeline flow
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage(prev => (prev + 1) % RAG_STAGES.length);
    }, 1200);
    return () => clearInterval(stageInterval);
  }, []);

  // Cycle tips every 3 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % RAG_TIPS.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="w-full bg-[#050507] border border-white/5 rounded-2xl p-6 lg:p-8 shadow-2xl animate-in fade-in-50 duration-300">
      
      {/* Stage Indicators */}
      <div className="w-full max-w-lg mb-8 flex justify-between relative px-2 mx-auto">
        {/* Horizontal Connecting Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#18181b] z-0" />
        <div 
          className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 transition-all duration-1000 z-0"
          style={{ width: `${(stage / (RAG_STAGES.length - 1)) * 90}%` }}
        />

        {RAG_STAGES.map((s, idx) => {
          const isActive = idx === stage;
          const isCompleted = idx < stage;
          return (
            <div key={idx} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-[11px] font-mono font-bold transition-all duration-300 ${
                isActive ? 'border-purple-500 bg-purple-950/30 text-purple-400 scale-110 shadow-lg shadow-purple-500/20'
                : isCompleted ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                : 'border-[#242426] bg-[#0c0c0d] text-slate-600'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[9px] font-bold mt-2 tracking-wide uppercase transition-colors duration-300 ${
                isActive ? 'text-purple-400' : isCompleted ? 'text-emerald-500' : 'text-slate-600'
              }`}>
                {s.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
        
        {/* Left Side: Steps, Details, and Tips */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          
          {/* RAG Pipeline Animated Diagram */}
          <div className="w-full h-28 bg-[#0c0c0d]/60 border border-[#1d1d20]/50 rounded-xl p-3 flex items-center justify-around relative overflow-hidden">
            
            {/* Animated Background Laser Grid / Pulse Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />

            {/* Node 1: User Query */}
            <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg border w-18 transition-all duration-300 ${
              stage === 0 ? 'border-purple-500 bg-purple-950/20 scale-105 shadow-md shadow-purple-500/10' : 'border-[#1e1e20] text-slate-500'
            }`}>
              <HelpCircle className={`w-4 h-4 mb-1 ${stage === 0 ? 'text-purple-400 animate-bounce' : ''}`} />
              <span className="text-[7.5px] font-bold uppercase tracking-wider">Query</span>
            </div>

            <ArrowRight className={`w-3.5 h-3.5 ${stage === 0 ? 'text-purple-500 animate-pulse' : 'text-slate-700'}`} />

            {/* Node 2: Embeddings & Vector Search */}
            <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg border w-18 transition-all duration-300 ${
              stage === 1 ? 'border-blue-500 bg-blue-950/20 scale-105 shadow-md shadow-blue-500/10' : 'border-[#1e1e20] text-slate-500'
            }`}>
              <Database className={`w-4 h-4 mb-1 ${stage === 1 ? 'text-blue-400 animate-pulse' : ''}`} />
              <span className="text-[7.5px] font-bold uppercase tracking-wider">Vector DB</span>
            </div>

            <ArrowRight className={`w-3.5 h-3.5 ${stage === 1 ? 'text-blue-500 animate-pulse' : 'text-slate-700'}`} />

            {/* Node 3: Learn Context */}
            <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg border w-18 transition-all duration-300 ${
              stage === 2 ? 'border-cyan-500 bg-cyan-950/20 scale-105 shadow-md shadow-cyan-500/10' : 'border-[#1e1e20] text-slate-500'
            }`}>
              <FileText className={`w-4 h-4 mb-1 ${stage === 2 ? 'text-cyan-400 animate-pulse' : ''}`} />
              <span className="text-[7.5px] font-bold uppercase tracking-wider">Docs Context</span>
            </div>

            <ArrowRight className={`w-3.5 h-3.5 ${stage === 2 ? 'text-cyan-500 animate-pulse' : 'text-slate-700'}`} />

            {/* Node 4: LLM Generator */}
            <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg border w-18 transition-all duration-300 ${
              stage === 3 ? 'border-emerald-500 bg-emerald-950/20 scale-105 shadow-md shadow-emerald-500/10' : 'border-[#1e1e20] text-slate-500'
            }`}>
              <Cpu className={`w-4 h-4 mb-1 ${stage === 3 ? 'text-emerald-400 animate-pulse' : ''}`} />
              <span className="text-[7.5px] font-bold uppercase tracking-wider">LLM Engine</span>
            </div>
          </div>

          {/* Active Stage Details */}
          <div className={`w-full border rounded-xl p-3 text-center transition-all duration-300 min-h-[56px] flex flex-col justify-center ${RAG_STAGES[stage].color}`}>
            <div className="text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-0.5">
              <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0" />
              {RAG_STAGES[stage].label}
            </div>
            <div className="text-[9px] opacity-80 leading-relaxed font-mono">{RAG_STAGES[stage].desc}</div>
          </div>

          {/* Tips Slider Box */}
          <div className="w-full bg-[#0c0c0d] border border-[#242426] rounded-xl p-3 flex gap-2.5 items-start relative overflow-hidden min-h-[72px]">
            <div className="absolute top-0 right-0 p-1 opacity-10">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <Lightbulb className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 font-mono">Study Hack & Knowledge Bit</div>
              <div className="text-[10px] text-slate-300 leading-relaxed transition-all duration-500 animate-in fade-in-20 duration-300">
                {RAG_TIPS[tipIndex]}
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Side: Vector Space Similarity Visualizer */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <VectorSpaceGraph stage={stage} />
        </div>

      </div>
      
    </div>
  );
}

const LEARN_CHUNKS = [
  {
    topic: "foundry",
    id: "chunk-foundry-09",
    score: 0.95,
    source: "https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/developer-foundry-sdk",
    title: "Microsoft Azure AI Developer Foundry SDK - Client Initialization",
    text: "The Microsoft Developer Foundry SDK is initialized via `AIProjectClient(endpoint, credential)`. The client handles indexing, connections to deployment hubs, and coordinates agentic runtime loops. Access to index schemas requires the hub's endpoint URL and Microsoft Entra credentials."
  },
  {
    topic: "pgvector",
    id: "chunk-pgvector-14",
    score: 0.93,
    source: "https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-use-pgvector",
    title: "PostgreSQL pgvector Extension - Embedding Similarity Search",
    text: "Enable the pgvector extension using: `CREATE EXTENSION IF NOT EXISTS vector;`. Define vector columns as `embedding vector(1536)` to match Ada-002 dimensions. Query similarity via the cosine distance operator `<=>` (e.g. `SELECT * FROM items ORDER BY embedding <=> '[0.012, -0.043, ...]' LIMIT 5;`)."
  },
  {
    topic: "agent",
    id: "chunk-agent-03",
    score: 0.91,
    source: "https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/agentic-frameworks",
    title: "Azure AI Agent Service - Orchestration & Tool Integrations",
    text: "Azure AI Agents orchestrate complex task steps using integrated tools like Python code execution containers, Bing Web Search connections, and pgvector context retrievers. Conversation state history is managed within persistent thread variables."
  },
  {
    topic: "openai",
    id: "chunk-openai-27",
    score: 0.89,
    source: "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models",
    title: "Azure OpenAI Models & Vector Embedding Dimensions",
    text: "Azure OpenAI supports vector generation via the `text-embedding-3-small` (1536 dimensions) and `text-embedding-3-large` (3072 dimensions) models. Vectors represent input semantic relationships and are stored in indices for similarity lookups."
  },
  {
    topic: "evaluation",
    id: "chunk-eval-08",
    score: 0.88,
    source: "https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/evaluate-generative-ai-app",
    title: "Generative AI Evaluation & Evaluation Metrics",
    text: "RAG evaluations measure output validity along three vectors: Groundedness (validating whether answers contain only retrieved information), Relevance (matching search queries), and Similarity. Built-in SDK evaluators run automated checks on target datasets."
  }
];

export default function TabDocs() {
  const { aiClient, isKeyValid } = useAi();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [retrievedChunks, setRetrievedChunks] = useState<typeof LEARN_CHUNKS>([]);
  const [showDebugger, setShowDebugger] = useState(true);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !aiClient) return;
    
    setIsSearching(true);
    setResult(null);

    // Heuristically find matching chunks based on query keywords
    const lowerQuery = query.toLowerCase();
    let selected = LEARN_CHUNKS.filter(chunk => 
      lowerQuery.includes(chunk.topic) || 
      chunk.title.toLowerCase().includes(lowerQuery) ||
      chunk.text.toLowerCase().includes(lowerQuery)
    );
    if (selected.length === 0) {
      // Default to pgvector and Foundry SDK if no keywords match
      selected = [LEARN_CHUNKS[0], LEARN_CHUNKS[1]];
    }
    setRetrievedChunks(selected);

    const contextStr = selected.map(c => `[Chunk ID: ${c.id}]\nSource: ${c.title}\nText: ${c.text}`).join('\n\n');

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are a RAG-powered documentation explorer strictly grounded in Microsoft Learn and Azure AI documentation. 
Here is the retrieved context from the vector database index:
${contextStr}

The user is searching for: "${query}".

Generate a concise synthesis summarizing the answer based ONLY on the retrieved context above. Do not reference external specs. Include code snippets if relevant. Highlight the source chunk IDs (e.g. chunk-foundry-09) when referencing information. If the query cannot be answered by the context, decline to guess.`,
      });
      setResult(response.text);
    } catch (err) {
      console.error(err);
      setResult("An error occurred while searching the documentation.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 bg-[#000000] text-white overflow-y-auto">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-[#0078d4]" />
        <h2 className="text-3xl font-bold">Docs Explorer (RAG)</h2>
      </div>
      <p className="text-slate-400 max-w-2xl">
        Search the Microsoft Learn documentation via our simulated Retrieval-Augmented Generation (RAG) interface. 
        Ask questions about Azure services, SDKs, and Agentic AI.
      </p>

      {!isKeyValid && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200">
          <strong>API Key Required:</strong> You must set your Gemini API key in the AI Chatbot panel to use the Docs Explorer.
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!isKeyValid || isSearching}
            placeholder="Search Microsoft Docs (e.g. 'How do I create a Foundry client?')"
            className="w-full bg-[#050505] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0078d4] transition-colors"
          />
        </div>
        <button 
          type="submit"
          disabled={!isKeyValid || !query.trim() || isSearching}
          className="bg-[#0078d4] hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg"
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Search
        </button>
      </form>

      {isSearching && <RagVisualLoader />}

      {result && !isSearching && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
          
          {/* Debugger toggle */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs text-slate-400 font-mono">RAG execution completed.</span>
            <button 
              onClick={() => setShowDebugger(!showDebugger)}
              className="text-xs font-semibold text-[#0078d4] hover:text-blue-400 border border-[#0078d4]/30 hover:border-blue-400/40 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              {showDebugger ? "Hide Vector Chunks" : "Show Retrieved Chunks"}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Main Synthesis Result */}
            <div className={`bg-[#050505] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl transition-all duration-300 ${showDebugger ? 'xl:col-span-7' : 'xl:col-span-12'}`}>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#0078d4]" />
                <h3 className="font-bold text-[#0078d4]">Microsoft Learn RAG Synthesis</h3>
              </div>
              <div className="prose prose-invert prose-blue max-w-none text-slate-300">
                <JupyterMarkdown content={result} variant="docs" />
              </div>
            </div>

            {/* Retrieved Chunks Drawer (Under the Hood) */}
            {showDebugger && (
              <div className="xl:col-span-5 flex flex-col gap-4 bg-[#0a0a0b] border border-purple-500/20 rounded-2xl p-6 shadow-xl animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Vector DB Retrieval</h3>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    K=2 matches
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  These raw chunks were retrieved from the PostgreSQL vector store using cosine similarity matching and injected into the LLM context prompt:
                </p>

                <div className="space-y-4 mt-2">
                  {retrievedChunks.map((c, idx) => (
                    <div key={c.id} className="border border-[#242426] bg-[#050507] rounded-xl p-3.5 flex flex-col gap-2 relative group hover:border-purple-500/30 transition-all">
                      <div className="flex items-center justify-between text-[9px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-purple-400 font-bold">{c.id}</span>
                        <span className="text-[#2dd4bf] font-bold">Similarity: {(c.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-[11px] font-bold text-white leading-snug">{c.title}</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap bg-[#0c0c0d] p-2.5 rounded-lg border border-[#1e1e20]">
                        {c.text}
                      </div>
                      <a 
                        href={c.source} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[9px] text-[#0078d4] hover:underline truncate mt-1 flex items-center gap-1 font-mono"
                      >
                        Docs Link: {c.source.slice(0, 50)}...
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

