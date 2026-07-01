import React, { useState } from 'react';
import { 
  FileText, Database, Network, Search, ArrowRight, Brain, 
  Calculator, FileOutput, Code2, Eye, Check, Copy, Cpu 
} from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

const steps = [
  { id: 'chunking', title: '1. Document Chunking', icon: FileText, desc: 'Split large documents into smaller, manageable text chunks.' },
  { id: 'embedding', title: '2. Embedding Generation', icon: Network, desc: 'Convert text chunks into dense vector representations.' },
  { id: 'storage', title: '3. Vector Storage', icon: Database, desc: 'Store embeddings in a vector database for fast retrieval.' },
  { id: 'retrieval', title: '4. Semantic Retrieval', icon: Search, desc: 'Query the database using cosine similarity to find relevant chunks.' },
  { id: 'synthesis', title: '5. LLM Synthesis', icon: Brain, desc: 'Combine retrieved context with the query inside the prompt to generate grounded answers.' }
];

const codeSnippets = {
  chunking: `from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load document text
document_text = "Microsoft Azure OpenAI Service provides..."

# Initialize splitter with chunk size and overlap
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

# Split document into smaller text chunks
chunks = splitter.split_text(document_text)
print(f"Generated {len(chunks)} chunks.")`,

  embedding: `from openai import OpenAI

# Initialize client with Azure OpenAI base URL for training
client = OpenAI(
    api_key="your-api-key",
    base_url="https://kg-genai-training.openai.azure.com/openai/v1"
)

# Text chunk to embed
text_chunk = "Microsoft Azure OpenAI Service provides..."

# Generate dense vector embedding (1536 dimensions) using text-embedding-3-small
response = client.embeddings.create(
    input=text_chunk,
    model="text-embedding-3-small"
)

# embedding_vector is an array of 1536 floating point numbers
embedding_vector = response.data[0].embedding
print(f"Vector dimensions: {len(embedding_vector)}")  # Output: 1536`,

  storage: `import psycopg2
from pgvector.psycopg2 import register_vector

# Connect to PostgreSQL vector database
conn = psycopg2.connect("dbname=vector_db user=postgres")
cur = conn.cursor()

# Register pgvector extension
register_vector(conn)

# Insert text chunk and its generated embedding vector
cur.execute(
    "INSERT INTO document_embeddings (content, embedding) VALUES (%s, %s)",
    (text_chunk, embedding_vector)
)

conn.commit()
print("Vector stored successfully in pgvector table.")`,

  retrieval: `from openai import OpenAI
import psycopg2

# Initialize client
client = OpenAI(api_key="your-api-key")

# User search query
query = "What is RAG?"

# 1. Generate embedding for query
query_embedding = client.embeddings.create(
    input=query,
    model="text-embedding-3-small"
).data[0].embedding

# 2. Query database using cosine similarity (<=> operator in pgvector)
cur.execute(
    "SELECT content, 1 - (embedding <=> %s) AS similarity "
    "FROM document_embeddings ORDER BY similarity DESC LIMIT 1",
    (query_embedding,)
)

top_match = cur.fetchone()
print(f"Retrieved chunk: {top_match[0]} (Similarity: {top_match[1]:.2f})")`,

  synthesis: `# Combine retrieved context with the user query to augment the prompt
augmented_prompt = f"""You are a grounded RAG documentation assistant.
Context retrieved from Vector DB:
---
{top_match[0]}
---

User Question: {query}

Answer the question strictly using the context details. Cite resources."""

# Call LLM generation model
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": augmented_prompt}]
)
print("Answer generated successfully.")`
};

// ─── Abstraction Level 2: Interactive Splitter ───────────────────────────────

function ChunkingPlayground() {
  const [inputText, setInputText] = useState(
    "Azure AI Search indexing extracts text from documents. PostgreSQL Flexible Server stores vector dimensions. Azure Developer Foundry SDK client manages agentic orchestrator threads. Evaluations track RAG groundedness."
  );
  const [chunkSize, setChunkSize] = useState(60);
  const [chunkOverlap, setChunkOverlap] = useState(15);

  const getChunks = () => {
    const chunks: { id: number; text: string; overlapStart: string; body: string }[] = [];
    if (!inputText) return [];
    
    let start = 0;
    let id = 1;
    const effectiveOverlap = Math.min(chunkOverlap, chunkSize - 10);

    while (start < inputText.length) {
      let end = start + chunkSize;
      const chunkText = inputText.substring(start, end);
      
      // Determine what part of this chunk is overlapping from the previous one
      const overlapLen = start > 0 ? effectiveOverlap : 0;
      const overlapStart = chunkText.substring(0, overlapLen);
      const body = chunkText.substring(overlapLen);

      chunks.push({ id, text: chunkText, overlapStart, body });
      
      start += (chunkSize - effectiveOverlap);
      id++;
      // Guard against infinite loop
      if (chunkSize - effectiveOverlap <= 0) break;
    }
    return chunks;
  };

  const chunks = getChunks();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <FileText className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Level 2 Abstraction: Interactive Document Chunking</h3>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        RAG starts by splitting long documents. Adjust Chunk Size (how many characters fit in one node) and Overlap (how many matching characters are shared between adjacent nodes to prevent context splitting).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Custom Source Text</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-h-[90px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>CHUNK SIZE</span>
                <span className="font-mono text-blue-400">{chunkSize} chars</span>
              </div>
              <input
                type="range" min="30" max="150" value={chunkSize}
                onChange={e => setChunkSize(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>OVERLAP</span>
                <span className="font-mono text-amber-400">{chunkOverlap} chars</span>
              </div>
              <input
                type="range" min="0" max="40" value={chunkOverlap}
                onChange={e => setChunkOverlap(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Chunks Output */}
        <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-2 border border-slate-950 bg-slate-950/40 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Generated Chunks ({chunks.length})</div>
          {chunks.map(c => (
            <div key={c.id} className="border border-slate-800/80 bg-slate-900/50 p-2.5 rounded-lg text-[11px] leading-relaxed flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>CHUNK #{c.id}</span>
                <span>Length: {c.text.length} chars</span>
              </div>
              <p className="font-mono text-slate-300">
                {c.overlapStart && (
                  <span className="bg-amber-500/10 text-amber-400 border-b border-dashed border-amber-500/40 font-semibold px-0.5" title="Overlapping Content from Previous Chunk">
                    {c.overlapStart}
                  </span>
                )}
                <span>{c.body}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Abstraction Level 3: Cosine Similarity Simulator ───────────────────────

const MATH_DOCS = [
  { name: "Foundry Agent SDK docs", x: 0.85, y: 0.25, angle: 16 },
  { name: "pgvector Index indexing guide", x: 0.15, y: 0.90, angle: 80 },
  { name: "Responsible AI Standards pdf",   x: 0.50, y: 0.50, angle: 45 },
];

function SimilarityPlayground() {
  const [queryAngle, setQueryAngle] = useState(45); // Query vector angle from x axis
  
  // Convert angle back to vector coordinates on unit circle
  const rad = (queryAngle * Math.PI) / 180;
  const qx = Math.cos(rad);
  const qy = Math.sin(rad);

  const calculateSimilarity = (docX: number, docY: number) => {
    // Cosine similarity formula: dot(A, B) / (norm(A) * norm(B))
    const dot = qx * docX + qy * docY;
    const normQ = Math.sqrt(qx * qx + qy * qy);
    const normD = Math.sqrt(docX * docX + docY * docY);
    return dot / (normQ * normD);
  };

  const results = MATH_DOCS.map(doc => {
    const similarity = calculateSimilarity(doc.x, doc.y);
    return { ...doc, similarity };
  }).sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Calculator className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Level 3 Abstraction: Vector Similarity Mathematics</h3>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        Cosine Similarity measures the semantic distance between query vectors and stored chunks. Slide the query angle to visualize vector projection and score updates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Formula & Scores */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center font-mono">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">Cosine Similarity Formula</div>
            <div className="text-xs text-slate-300">
              {"$$\\text{Similarity} = \\cos(\\theta) = \\frac{\\vec{A} \\cdot \\vec{B}}{\\|\\vec{A}\\| \\|\\vec{B}\\|}$$"}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>USER QUERY VECTOR DIRECTION</span>
              <span className="font-mono text-purple-400">{queryAngle}° angle</span>
            </div>
            <input
              type="range" min="0" max="90" value={queryAngle}
              onChange={e => setQueryAngle(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="space-y-2 mt-2">
            {results.map((r, idx) => (
              <div 
                key={r.name} 
                className={`border p-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                  idx === 0 
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                    : 'border-slate-800 bg-slate-950/20 text-slate-400'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    {idx === 0 && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded uppercase font-bold">MATCH</span>}
                    {r.name}
                  </div>
                  <span className="text-[10px] opacity-70 font-mono">Coords: [{r.x.toFixed(2)}, {r.y.toFixed(2)}] · θ: {r.angle}°</span>
                </div>
                <div className={`font-mono font-bold text-sm ${idx === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {r.similarity.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Unit Coordinate Visualization */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950 border border-slate-850 p-4 rounded-xl">
          <svg viewBox="0 0 150 150" className="w-full max-w-[150px] text-slate-700">
            {/* Grid Box Border & Origin Axes */}
            <rect x="0" y="0" width="150" height="150" fill="none" stroke="#1d1d20" strokeWidth="1" />
            <line x1="20" y1="130" x2="140" y2="130" stroke="#242426" strokeWidth="0.8" />
            <line x1="20" y1="10" x2="20" y2="130" stroke="#242426" strokeWidth="0.8" />

            {/* Document Vectors (from origin [20,130]) */}
            {MATH_DOCS.map(doc => {
              // Scale coords: x increases right, y decreases up
              const dx = 20 + doc.x * 100;
              const dy = 130 - doc.y * 100;
              const isTop = doc.name === results[0].name;

              return (
                <g key={doc.name}>
                  <line 
                    x1="20" y1="130" x2={dx} y2={dy} 
                    stroke={isTop ? "#10b981" : "#475569"} 
                    strokeWidth={isTop ? "2" : "1.2"} 
                  />
                  <circle cx={dx} cy={dy} r={isTop ? "3.5" : "2.5"} fill={isTop ? "#10b981" : "#475569"} />
                </g>
              );
            })}

            {/* User Query Vector (Purple) */}
            <g>
              {/* Map query coordinates (qx, qy are normalized 0-1) */}
              <line 
                x1="20" y1="130" 
                x2={20 + qx * 100} y2={130 - qy * 100} 
                stroke="#a855f7" 
                strokeWidth="2" 
                strokeDasharray="1 1"
              />
              <circle cx={20 + qx * 100} cy={130 - qy * 100} r="3.5" fill="#a855f7" />
            </g>

            {/* Scale markings */}
            <text x="14" y="132" fontSize="5" fill="#475569" textAnchor="end">0</text>
            <text x="14" y="34" fontSize="5" fill="#475569" textAnchor="end">1.0</text>
            <text x="120" y="137" fontSize="5" fill="#475569" textAnchor="middle">1.0</text>
          </svg>
          <span className="text-[9px] text-slate-500 mt-2 font-mono">Similarity Coordinate Projection Plane</span>
        </div>

      </div>
    </div>
  );
}

// ─── Abstraction Level 4: Prompt Augmentation & Generation ──────────────────

function GenerationPlayground() {
  const [retrievedContext, setRetrievedContext] = useState(
    "pgvector handles vector dimensions inside PostgreSQL Flexible Server servers. Distance matches use the cosine distance <=> selector query operator."
  );
  const [userQuery, setUserQuery] = useState("Explain pgvector cosine search");
  const [llmOutput, setLlmOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const simulateLLM = () => {
    if (generating) return;
    setGenerating(true);
    setLlmOutput("");
    
    const responses = [
      "🔄 Initializing generator thread connection...",
      "🧠 Context matches loaded. Prompt augmentation compiled successfully.",
      "🤖 LLM response synthesis stream:",
      "---",
      "To perform similarity searches on Postgres, use the pgvector extension.",
      "The cosine distance operator (<=>) computes the angle distance between the query embedding and database dimensions.",
      "For example, you can query using `ORDER BY embedding <=> '[vectors]' LIMIT 5;` to return the most semantically related documentation chunks.",
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < responses.length) {
        setLlmOutput(prev => prev + (prev ? "\n" : "") + responses[step]);
        step++;
      } else {
        clearInterval(interval);
        setGenerating(false);
      }
    }, 850);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Brain className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Level 4 Abstraction: Prompt Augmentation & LLM Generation</h3>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        Retrieved context chunks are combined with the query and injected into the LLM system prompt template. Click generate to simulate synthesis under the hood.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prompt Construction */}
        <div className="flex flex-col gap-3.5 bg-slate-950 p-4 border border-slate-850 rounded-xl">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Augmented Prompt Template</div>
          
          <div className="space-y-1">
            <span className="text-[8px] text-slate-600 font-mono block">SYSTEM INSTRUCTION</span>
            <div className="bg-slate-900 p-2 text-[10px] rounded text-slate-400 font-mono leading-normal">
              You are a grounded RAG assistant. Synthesize answers strictly using the context below.
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[8px] text-cyan-500 font-mono block">RETIREVED VECTOR CONTEXT (INJECTED)</span>
            <input 
              type="text" 
              value={retrievedContext} 
              onChange={e => setRetrievedContext(e.target.value)}
              className="w-full bg-slate-900 border border-[#242426] p-2 text-[10px] rounded text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[8px] text-purple-400 font-mono block">USER SEARCH QUERY</span>
            <input 
              type="text" 
              value={userQuery} 
              onChange={e => setUserQuery(e.target.value)}
              className="w-full bg-slate-900 border border-[#242426] p-2 text-[10px] rounded text-slate-200 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <button 
            onClick={simulateLLM}
            disabled={generating}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/10"
          >
            <Cpu className="w-3.5 h-3.5" />
            Synthesize Answer
          </button>
        </div>

        {/* LLM Engine output */}
        <div className="flex flex-col gap-2 bg-[#050507] border border-[#242426] p-4 rounded-xl min-h-[220px]">
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${generating ? 'animate-ping' : ''}`} />
            LLM Generation Stream
          </div>
          <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-[#1e1e20] text-[10px] font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto text-slate-300">
            {llmOutput || "Click Synthesize Answer to compile prompt and run LLM output sequence."}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TabRagPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStepKey = steps[activeStep].id as keyof typeof codeSnippets;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-200 p-6 lg:p-8 flex flex-col gap-8">
      
      {/* Visualizer header */}
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">RAG Pipeline Explorer</h2>
        <p className="text-slate-400 mt-2 text-sm">Interactive visualization of Retrieval-Augmented Generation at multiple levels of abstraction.</p>
      </div>

      {/* Level 1: High Level block diagram */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Steps Navigation */}
        <div className="lg:w-1/3 flex flex-col gap-3.5">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 text-left ${
                activeStep === index 
                  ? 'bg-slate-800 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] scale-[1.02]' 
                  : 'bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 hover:scale-[1.01]'
              }`}
            >
              <div className={`p-2 rounded-md transition-colors duration-300 ${activeStep === index ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                <step.icon size={22} />
              </div>
              <div>
                <h3 className={`font-semibold text-xs transition-colors duration-300 ${activeStep === index ? 'text-blue-100' : 'text-slate-300'}`}>{step.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">{step.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Visualization Canvas & Code Viewer */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden min-h-[450px]">
          
          {/* Header Controls (View Toggle) */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              {steps[activeStep].title.split('. ')[1]}
            </span>
            
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${viewMode === 'visual' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Eye size={13} />
                <span>Visualisation</span>
              </button>
              <button 
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${viewMode === 'code' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Code2 size={13} />
                <span>Python Code</span>
              </button>
            </div>
          </div>

          {/* Body Content Container */}
          <div className="flex-1 p-8 flex items-center justify-center relative overflow-y-auto">
            {viewMode === 'visual' ? (
              <>
                {/* Step 1: Chunking */}
                <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center ${activeStep === 0 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <div className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center">
                      <div className="relative group">
                        <FileText size={70} className="text-slate-400 transition-transform group-hover:scale-110 duration-500" />
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full z-[-1]"></div>
                      </div>
                      <ArrowRight size={28} className="text-slate-600 animate-pulse hidden sm:block" />
                      <ArrowRight size={28} className="text-slate-600 animate-pulse sm:hidden rotate-90" />
                      <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-800 p-2.5 rounded border border-slate-700 shadow-lg hover:border-blue-500/50 transition-colors duration-300">
                            <FileText size={18} className="text-blue-400" />
                            <div className="flex flex-col gap-1.5">
                              <div className="h-1.5 w-20 bg-slate-600 rounded"></div>
                              <div className="h-1.5 w-12 bg-slate-600 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <p className="mt-10 text-xs text-slate-400 text-center max-w-sm">The source document is divided into smaller chunks (e.g., paragraphs or fixed token lengths) to maintain context.</p>
                </div>

                {/* Step 2: Embedding */}
                <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center ${activeStep === 1 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl gap-6">
                      <div className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-slate-800 p-2.5 rounded border border-slate-700 w-28 flex flex-col items-center gap-2">
                             <FileText size={14} className="text-slate-400" />
                             <div className="h-1 w-12 bg-slate-500 rounded"></div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex sm:flex-row flex-col items-center gap-4">
                        <ArrowRight size={20} className="text-slate-600 animate-pulse hidden sm:block" />
                        <div className="flex flex-col items-center gap-2 bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                          <Brain size={36} className="text-purple-400 animate-pulse" />
                          <span className="text-[10px] text-purple-400 font-mono">Embedding Model</span>
                        </div>
                        <ArrowRight size={20} className="text-slate-600 animate-pulse hidden sm:block" />
                      </div>

                      <div className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-slate-950 p-2.5 rounded border border-purple-500/30 text-purple-300 font-mono text-[10px] w-40 shadow-[0_0_10px_rgba(168,85,247,0.1)] text-center">
                             [0.12, -0.45, 0.89, ...]
                          </div>
                        ))}
                      </div>
                   </div>
                   <p className="mt-10 text-xs text-slate-400 text-center max-w-sm">An Embedding Model transforms each text chunk into a high-dimensional vector array representing its semantic meaning.</p>
                </div>

                {/* Step 3: Storage */}
                <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center ${activeStep === 2 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <div className="flex flex-col sm:flex-row items-center gap-10">
                      <div className="flex flex-col gap-3 relative">
                        <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full z-[-1]"></div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="text-purple-300 font-mono text-[10px] bg-slate-950 px-3.5 py-1.5 rounded border border-purple-500/30 hover:bg-purple-900/30 transition-colors cursor-default">
                             [vector_{i}]
                          </div>
                        ))}
                      </div>
                      <ArrowRight size={28} className="text-slate-600 hidden sm:block" />
                      <ArrowRight size={28} className="text-slate-600 sm:hidden rotate-90" />
                      <div className="relative group">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl group-hover:border-emerald-500/50 transition-colors">
                          <Database size={56} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full z-[-1] group-hover:bg-emerald-500/20 transition-all"></div>
                        </div>
                      </div>
                   </div>
                   <p className="mt-10 text-xs text-slate-400 text-center max-w-sm">Vectors are indexed and stored in a specialized Vector Database, optimized for fast nearest-neighbor search.</p>
                </div>

                {/* Step 4: Retrieval */}
                <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center ${activeStep === 3 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <div className="flex flex-col sm:flex-row items-start justify-between w-full max-w-4xl gap-6">
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-2 rounded-lg text-blue-200 text-xs text-center w-full shadow-lg">
                          "What is RAG?"
                        </div>
                        <ArrowRight size={18} className="text-slate-600 rotate-90 sm:rotate-0 sm:hidden" />
                        <div className="hidden sm:flex h-6 w-[2px] bg-gradient-to-b from-blue-500/50 to-purple-500/50"></div>
                        <div className="bg-slate-950 p-2 rounded border border-purple-500/30 text-purple-300 font-mono text-[10px] w-full text-center">
                          [0.15, -0.42, ...]
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center pt-2 sm:pt-6 flex-1">
                        <div className="relative">
                          <Calculator size={36} className="text-emerald-400 mb-1.5 relative z-10" />
                          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full z-0"></div>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-mono text-center mb-2 uppercase tracking-wider">Cosine Similarity</span>
                        <div className="flex gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-ping"></div>
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-ping" style={{animationDelay: '200ms'}}></div>
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-ping" style={{animationDelay: '400ms'}}></div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 w-full flex justify-center">
                          <Database size={28} className="text-slate-500" />
                        </div>
                        <div className="hidden sm:flex h-6 w-[2px] bg-gradient-to-b from-slate-700 to-emerald-500/50"></div>
                        <div className="bg-emerald-900/20 border border-emerald-500/50 p-3 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] w-full relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <FileOutput size={14} className="text-emerald-400" />
                              <span className="text-emerald-400 text-[10px] font-semibold">Top Match</span>
                            </div>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full">score: 0.98</span>
                          </div>
                          <div className="h-1.5 w-full bg-emerald-400/20 rounded mb-1.5"></div>
                          <div className="h-1.5 w-3/4 bg-emerald-400/20 rounded mb-1.5"></div>
                          <div className="h-1.5 w-1/2 bg-emerald-400/20 rounded"></div>
                        </div>
                      </div>
                   </div>
                   <p className="mt-10 text-xs text-slate-400 text-center max-w-sm">The user query is vectorized and compared against stored vectors. The most similar chunks are retrieved to augment the LLM's prompt.</p>
                </div>

                {/* Step 5: Synthesis */}
                <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center ${activeStep === 4 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <div className="flex flex-col sm:flex-row items-center justify-around w-full max-w-2xl gap-6">
                      <div className="bg-emerald-900/10 border border-emerald-500/30 p-3 rounded-lg w-40 text-center text-[10px] text-emerald-300 font-mono">
                        [Context Document]
                      </div>
                      <span className="text-slate-600 font-bold">+</span>
                      <div className="bg-blue-950 border border-blue-500/30 p-3 rounded-lg w-40 text-center text-[10px] text-blue-300 font-mono">
                        [User Query]
                      </div>
                      <ArrowRight size={24} className="text-slate-600 hidden sm:block" />
                      <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl text-center shadow-lg shadow-purple-500/10 flex flex-col items-center gap-1.5">
                        <Brain size={32} className="text-purple-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-white font-mono">LLM Output</span>
                        <div className="h-1.5 w-24 bg-purple-400/20 rounded mt-1.5"></div>
                        <div className="h-1.5 w-18 bg-purple-400/20 rounded"></div>
                      </div>
                   </div>
                   <p className="mt-10 text-xs text-slate-400 text-center max-w-sm">The model synthesizes the grounded answer, linking references back to the retrieved context document index.</p>
                </div>
              </>
            ) : (
              /* Code Mode */
              <div className="w-full h-full flex flex-col gap-4 self-stretch justify-start items-stretch">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Python implementation for this step:</span>
                  <button 
                    onClick={() => handleCopy(codeSnippets[activeStepKey])}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed flex-1">
                  <pre>{codeSnippets[activeStepKey]}</pre>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Levels of Abstraction Section divider */}
      <div className="border-t border-[#1e1e20] pt-6 mt-4">
        <h3 className="text-lg font-bold text-white mb-1">RAG Under the Hood: Mathematical & Database Abstractions</h3>
        <p className="text-xs text-slate-400">Deep-dive simulations detailing the exact computation models driving document retrieval and response synthesis.</p>
      </div>

      {/* Interactive playgrounds */}
      <ChunkingPlayground />
      <SimilarityPlayground />
      <GenerationPlayground />

      {/* Production RAG Blueprint Section */}
      <div className="border-t border-[#1e1e20] pt-6 mt-4">
        <h3 className="text-lg font-bold text-white mb-1">Production-Grade RAG Architecture Blueprint & Stack</h3>
        <p className="text-xs text-slate-400">Implementation roadmap, high-dimensional vector spaces, tech stacks, and best practices for scaling RAG in production.</p>
      </div>

      <ProductionRagBlueprint />

    </div>
  );
}

// ─── Production Blueprint Component ──────────────────────────────────────────

const BLUEPRINT_SNIPPETS = {
  react: {
    title: "React Query Input Component",
    desc: "A custom React search input component designed to manage state, loading spinners, and forward semantic queries to the backend API.",
    code: `import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export function RAGQueryInput({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    await onSearch(query);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Query pgvector documentation..."
        className="flex-1 bg-[#0c0c0d] border border-[#242426] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
      />
      <button type="submit" disabled={loading} className="bg-blue-600 px-6 rounded-xl text-sm font-bold text-white flex items-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        Query
      </button>
    </form>
  );
}`
  },
  pgvector: {
    title: "pgvector Index & Table Creation SQL",
    desc: "Durable PostgreSQL schema initialization creating the pgvector extension, table structures, and a high-performance HNSW index for cosine distance searching.",
    code: `-- 1. Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create chunks table with a 1536D embedding vector column
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536) NOT NULL
);

-- 3. Create HNSW index for high-performance similarity search
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Cosine similarity query (top 5 matches)
SELECT content, 1 - (embedding <=> $1) AS cosine_similarity
FROM document_chunks
WHERE metadata ->> 'category' = 'AzureSDK'
ORDER BY embedding <=> $1
LIMIT 5;`
  },
  langchain: {
    title: "LangChain Retrieval Service Python Ingestion",
    desc: "Python ingestion pipeline utilizing LangChain loaders and RecursiveCharacterTextSplitters to divide documents and load embeddings directly to PGVector database.",
    code: `from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_postgres.vectorstores import PGVector

# Load PDFs from index directory
loader = PyPDFDirectoryLoader("./docs")
docs = loader.load()

# Split docs into semantically sound chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=150,
    length_function=len
)
chunks = text_splitter.split_documents(docs)

# Initialize Azure OpenAI Embeddings Client
embeddings = AzureOpenAIEmbeddings(
    azure_deployment="text-embedding-3-small",
    azure_endpoint="https://your-resource.openai.azure.com/",
    api_version="2023-05-15"
)

# Connect and write chunk vectors to PostgreSQL db
db = PGVector.from_documents(
    documents=chunks,
    embedding=embeddings,
    connection="postgresql+psycopg://postgres:pw@localhost:5432/rag_db",
    collection_name="azure_docs_collection"
)`
  },
  azure: {
    title: "Azure OpenAI LLM Synthesis Request JSON",
    desc: "Grounded LLM prompt completion request payload structured for the Azure OpenAI Service API, specifying context parameters and generation controls.",
    code: `{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful documentation bot. Answer using ONLY this context:\\n---[Retrieved pgvector text]---"
    },
    {
      "role": "user",
      "content": "How do I initialize the Azure Foundry client?"
    }
  ],
  "temperature": 0.0,
  "max_tokens": 800,
  "top_p": 0.95,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "stop": ["---"]
}`
  }
};

function ProductionRagBlueprint() {
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'pgvector' | 'langchain' | 'azure'>('react');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedSnippet = BLUEPRINT_SNIPPETS[activeCodeTab];

  return (
    <div className="flex flex-col gap-6">
      
      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: Interactive Roadmap Snippet Viewer */}
        <div className="lg:col-span-7 bg-[#0c0c0d] border border-[#242426] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Production Pipeline Roadmap</div>
            
            {/* Tab Selectors */}
            <div className="flex flex-wrap bg-slate-950 p-1 border border-[#242426] rounded-xl gap-1">
              {Object.keys(BLUEPRINT_SNIPPETS).map((key) => {
                const k = key as keyof typeof BLUEPRINT_SNIPPETS;
                const active = activeCodeTab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActiveCodeTab(k)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wide ${
                      active ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            <div className="mt-2">
              <h4 className="text-xs font-bold text-white">{selectedSnippet.title}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">{selectedSnippet.desc}</p>
            </div>
          </div>

          {/* Code display */}
          <div className="flex-1 flex flex-col mt-4 min-h-[220px]">
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono border-b border-[#242426] pb-2 mb-2">
              <span>Production Code Snippet</span>
              <button 
                onClick={() => handleCopy(selectedSnippet.code)} 
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex-1 bg-slate-950 border border-slate-850 rounded-lg p-3 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
              <pre>{selectedSnippet.code}</pre>
            </div>
          </div>

        </div>

        {/* RIGHT: High Dimensional Projection Guide Panel */}
        <div className="lg:col-span-5 bg-[#0c0c0d] border border-[#242426] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-purple-400" />
              High-Dimensional Space Visualization (1536D)
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Document chunks are embedded in a unit hypersphere (dimension 1536). Linear projections like PCA or non-linear manifolds (UMAP/t-SNE) reduce this to 3D coordinates for vector space mapping:
            </p>
          </div>

          {/* SVG Cluster Projection Graphic */}
          <div className="my-4 bg-slate-950 border border-slate-850 rounded-xl p-3.5 flex flex-col items-center relative overflow-hidden">
            <svg viewBox="0 0 200 130" className="w-full h-full text-slate-700">
              {/* 3D Wireframe Box Grid */}
              {/* Back Wall */}
              <path d="M 40,20 L 160,20 L 160,90 L 40,90 Z" fill="none" stroke="#1c1c1f" strokeWidth="0.5" strokeDasharray="1 1" />
              {/* Left Wall */}
              <path d="M 40,20 L 60,35 L 60,105 L 40,90 Z" fill="none" stroke="#1c1c1f" strokeWidth="0.5" strokeDasharray="1 1" />
              {/* Bottom floor plane */}
              <path d="M 40,90 L 60,105 L 180,105 L 160,90 Z" fill="none" stroke="#242426" strokeWidth="0.5" />

              {/* 3D Origin Axes (origin at [60,105]) */}
              {/* X Axis (Right) */}
              <line x1="60" y1="105" x2="180" y2="105" stroke="#475569" strokeWidth="0.8" />
              <text x="175" y="112" fontSize="5" fontWeight="bold" fill="#64748b">X (Semantic)</text>
              
              {/* Y Axis (Up) */}
              <line x1="60" y1="105" x2="60" y2="25" stroke="#475569" strokeWidth="0.8" />
              <text x="50" y="23" fontSize="5" fontWeight="bold" fill="#64748b">Y (Type)</text>

              {/* Z Axis (Depth - Diagonal Left) */}
              <line x1="60" y1="105" x2="40" y2="90" stroke="#475569" strokeWidth="0.8" />
              <text x="32" y="87" fontSize="5" fontWeight="bold" fill="#64748b">Z (Index)</text>

              {/* 3D Cluster 1: Agent Hub (Blue, Front-Left, High Y) */}
              {/* Drop-shadow floor projection */}
              <ellipse cx="85" cy="100" rx="14" ry="4" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="85" cy="100" r="1" fill="#3b82f6" className="opacity-50" />
              {/* Vertical projection line */}
              <line x1="85" y1="100" x2="85" y2="45" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
              {/* Main Cluster sphere and nodes */}
              <g className="transition-all duration-300">
                <circle cx="85" cy="45" r="3.5" fill="#3b82f6" className="animate-pulse shadow" />
                <circle cx="78" cy="48" r="1.5" fill="#60a5fa" />
                <circle cx="92" cy="40" r="1.5" fill="#60a5fa" />
                <circle cx="88" cy="51" r="1.2" fill="#60a5fa" />
                <text x="85" y="34" fontSize="5.5" fontWeight="bold" textAnchor="middle" fill="#60a5fa">Agent Hub Cluster</text>
              </g>

              {/* 3D Cluster 2: Vector Store (Emerald, Back-Right, Mid Y) */}
              {/* Drop-shadow floor projection */}
              <ellipse cx="145" cy="96" rx="16" ry="5" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="145" cy="96" r="1" fill="#10b981" className="opacity-50" />
              {/* Vertical projection line */}
              <line x1="145" y1="96" x2="145" y2="68" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
              {/* Main Cluster sphere and nodes */}
              <g className="transition-all duration-300">
                <circle cx="145" cy="68" r="3" fill="#10b981" className="animate-pulse" />
                <circle cx="138" cy="65" r="1.5" fill="#34d399" />
                <circle cx="152" cy="72" r="1.5" fill="#34d399" />
                <circle cx="148" cy="62" r="1.2" fill="#34d399" />
                <circle cx="141" cy="73" r="1.2" fill="#34d399" />
                <text x="145" y="54" fontSize="5.5" fontWeight="bold" textAnchor="middle" fill="#34d399">Vector Store Cluster</text>
              </g>

              {/* 3D Floating Outliers */}
              <line x1="110" y1="102" x2="110" y2="80" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="110" cy="80" r="1.5" fill="#475569" />
              
              <line x1="125" y1="99" x2="125" y2="35" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="125" cy="35" r="1.5" fill="#475569" />
            </svg>
            <div className="w-full mt-2 flex justify-between text-[8px] font-mono text-slate-500 border-t border-[#1e1e20] pt-1">
              <span>3D PCA / UMAP Projection Engine</span>
              <span>Metric: Cosine Proximity</span>
            </div>
          </div>

          {/* Math Note */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[9px] font-mono leading-relaxed text-slate-400">
            <span className="font-bold text-slate-300 block mb-0.5">MATH SPECIFICATIONS FOR 1536D VECTORS</span>
            • **Unit Length**: Vectors are L2 Normalized (||V|| = 1.0), ensuring Dot Product equals Cosine Similarity.<br />
            • **Curse of Dimensionality**: High-dimensional vectors lean orthogonal. Random vector pairs sit close to 90° angles.<br />
            • **Index Optimization**: Approximate Nearest Neighbor (ANN) indexes like HNSW build proximity graphs to avoid scanning every vector manually.
          </div>
        </div>

      </div>

      {/* Grid for Stack breakdown & Best practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
        
        {/* Full Stack Breakdown Panel */}
        <div className="bg-[#0c0c0d] border border-[#242426] rounded-xl p-5 space-y-3.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            Full Implementation Stack
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <span className="font-bold text-white block mb-0.5 uppercase tracking-wide">1. DATA INGESTION</span>
              LangChain, LlamaIndex, PyPDF, chunk overlap parsers.
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <span className="font-bold text-white block mb-0.5 uppercase tracking-wide">2. VECTOR STORAGE</span>
              PostgreSQL (pgvector extension), HNSW indexes.
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <span className="font-bold text-white block mb-0.5 uppercase tracking-wide">3. ORCHESTRATION</span>
              Foundry SDK, agent frameworks, hybrid routers.
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <span className="font-bold text-white block mb-0.5 uppercase tracking-wide">4. EVALUATION & LLM</span>
              Azure OpenAI, Groundedness and Relevance evaluators.
            </div>
          </div>
        </div>

        {/* Best Practices Panel */}
        <div className="bg-[#0c0c0d] border border-[#242426] rounded-xl p-5 space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            Production Best Practices
          </div>

          <ul className="text-[10px] text-slate-400 space-y-2 leading-relaxed font-sans">
            <li>
              🔑 <strong className="text-slate-350">Metadata Filtering</strong>: Always pre-filter database rows (e.g. by `tenant_id` or `category`) before matching vectors to avoid cross-tenant leaks.
            </li>
            <li>
              ⚙️ <strong className="text-slate-350">Index Tuning</strong>: Rebuild your pgvector HNSW index after loading documents to ensure newly written clusters are correctly linked.
            </li>
            <li>
              📈 <strong className="text-slate-350">Hybrid Search Routing</strong>: Combine BM25 keyword matching with Semantic Vector matches. Routers should merge both lists and apply Reciprocal Rank Fusion (RRF) for top accuracy.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

