import React, { useState } from 'react';
import { Cpu, Code2, RefreshCw, Zap, Server, Key, ArrowRight, ShieldCheck, Database, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FoundrySdkTab() {
  const [activeDiagram, setActiveDiagram] = useState<'eval' | 'tool'>('eval');

  const httpCode = `import requests
import json

# ❌ Brittle Custom HTTP Approach
# Raw endpoint URLs, manual token refreshing, and complex JSON schemas.
URL = "https://eastus2.api.azure.com/projects/agents?api-version=2024-12-01-preview"

payload = {
    "name": "MathAgent",
    "instructions": "You are a math solver.",
    "model": "gpt-4o-mini",
    "tools": [{"type": "code_interpreter"}]
}

headers = {
    # Manual Authorization Token management
    "Authorization": "Bearer eyJ0eXAiOiJKV...",
    "Content-Type": "application/json",
    "x-ms-useragent": "custom-script-v1"
}

response = requests.post(URL, headers=headers, json=payload)
agent_id = response.json()["id"]
print(f"Registered Agent via raw POST: {agent_id}")`;

  const sdkCode = `import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.projects.models import CodeInterpreterTool

# ✅ Modern Official Azure SDK Approach
# Uses centralized Connection String & Passwordless Identity.
conn_str = os.environ["AZURE_AI_CONN_STR"]
credential = DefaultAzureCredential()

# Initialize the unified data-plane client
project_client = AIProjectClient.from_connection_string(
    credential=credential,
    conn_str=conn_str
)

# Instantiate type-safe Code Interpreter tool definitions
code_interpreter = CodeInterpreterTool()

# Register agent with automatic token refreshing and validation
agent = project_client.agents.create_agent(
    model=os.environ["MODEL_DEPLOYMENT_NAME"],
    name="MathAgent",
    instructions="You are a math solver.",
    tools=code_interpreter.definitions
)
print(f"Registered Agent via modern SDK: {agent.id}")`;

  const [selectedEvalNode, setSelectedEvalNode] = useState<string | null>(null);

  const evalNodeDetails: Record<string, { title: string; desc: string; role: string; certTip: string }> = {
    dataset: {
      title: "Test Dataset (Inputs & Ground Truth)",
      desc: "Contains gold-standard test prompts paired with human-validated expected responses (Ground Truth). It provides the baseline for measuring model performance.",
      role: "Provides raw input prompts and expected 'Ground Truth' answers to the evaluation system.",
      certTip: "AI-901 Tip: True evaluation requires high-quality ground truth. Automated evaluation is only as good as the grounding dataset."
    },
    generator: {
      title: "Target AI Model (Generator)",
      desc: "The system or LLM configuration under test. It processes the dataset prompts to produce generated text outputs.",
      role: "Receives inputs and dynamically generates outputs to be evaluated.",
      certTip: "AI-901 Tip: The generator model can be custom prompted (e.g., using System Messages) to optimize task accuracy."
    },
    evaluator: {
      title: "Evaluator LLM (GPT-4o)",
      desc: "A highly capable model (often GPT-4 class) programmed with strict evaluation rubrics to grade outputs against ground truth on parameters like similarity, coherence, and relevance.",
      role: "Benchmarks generated outputs against Ground Truth, returning numeric scores and reasoning sentences.",
      certTip: "AI-901 Tip: LLM-assisted evaluation delivers highly correlated results to human graders, reducing benchmark costs."
    },
    parser: {
      title: "Metrics Parser & Compiler",
      desc: "Extracts scores and textual rationales from the Evaluator LLM's raw responses, compiling them into clean, standardized quantitative metrics.",
      role: "Converts conversational judge output into numeric performance grades (F1, Coherence scale, Groundedness ratio).",
      certTip: "AI-901 Tip: Aggregated metrics allow software developers to configure gated build pipelines that fail if quality drops."
    },
    azuredb: {
      title: "Azure AI Evaluation Dashboard",
      desc: "The central reporting hub that visualizes pipeline telemetry, compares test run versions, tracks quality regressions, and publishes live statistics.",
      role: "Unified visualization pane for security teams, data scientists, and developers to review AI deployment readiness.",
      certTip: "AI-901 Tip: Continuous evaluation dashboards provide audit trails required under the Transparency principle of Responsible AI."
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="foundry-sdk-tab">
      
      {/* Header Section */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-sm mb-1">
          <Code2 className="w-4 h-4" />
          <span>MICROSOFT AZURE FOUNDRY SDK PATTERNS</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
          Developer Reference & Architecture
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl">
          Compare the programmatic interfaces of Azure AI services and explore the system flows behind evaluation models and state-authoritative tools.
        </p>
      </div>

      {/* Code Comparisons Block */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full uppercase font-semibold">API Evolution</span>
          <h2 className="text-xl font-bold text-white mt-2">SDK vs. Direct REST API calls</h2>
          <p className="text-sm text-slate-400">
            Why enterprise systems enforce the official <code className="text-teal-400 font-mono bg-white/5 px-1 rounded">azure-ai-projects</code> package over manual HTTP connection templates.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Brittle raw HTTP wrapper */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#121218] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono font-medium">brittle_http_api_wrapper.py</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded uppercase">Avoid</span>
            </div>
            <div className="p-4 bg-[#070709] overflow-auto text-xs font-mono text-rose-200/80 leading-relaxed border-b border-white/5 h-96">
              <pre>{httpCode}</pre>
            </div>
            <div className="p-4 bg-[#0e0e12] space-y-2">
              <h4 className="text-sm font-semibold text-rose-300 flex items-center gap-1.5">
                ❌ Pitfalls of raw HTTP wrappers:
              </h4>
              <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc">
                <li><strong className="text-slate-300">Token Management:</strong> Entra ID tokens expire after 60 minutes. Raw wrappers require writing custom background refresh loops.</li>
                <li><strong className="text-slate-300">Hardcoded Endpoints:</strong> URL patterns change across billing models. Moving regions forces modifying production scripts.</li>
                <li><strong className="text-slate-300">No Class Safety:</strong> Outputs are raw nested JSON structures, increasing the risk of runtime KeyErrors.</li>
              </ul>
            </div>
          </div>

          {/* Clean Modern SDK */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#121218] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-medium">modern_azure_ai_sdk.py</span>
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded uppercase">Recommended</span>
            </div>
            <div className="p-4 bg-[#070709] overflow-auto text-xs font-mono text-teal-100/90 leading-relaxed border-b border-white/5 h-96">
              <pre>{sdkCode}</pre>
            </div>
            <div className="p-4 bg-[#0e0e12] space-y-2">
              <h4 className="text-sm font-semibold text-teal-300 flex items-center gap-1.5">
                ✅ Advantages of Official SDK:
              </h4>
              <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc">
                <li><strong className="text-slate-300">Passwordless Identity:</strong> Leverages credentials mapped securely via environmental variables without credentials leaking in repositories.</li>
                <li><strong className="text-slate-300">Connection Strings:</strong> Concentrates subscription identifiers, projects, and regions into a single dynamic environment variable.</li>
                <li><strong className="text-slate-300">SDK Class-Mapping:</strong> Enforces strong static typing with autocomplete tool attributes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Diagrams Section */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full uppercase font-semibold">Architectural Blueprints</span>
          <h2 className="text-xl font-bold text-white mt-2">Azure System Infrastructures</h2>
          <p className="text-sm text-slate-400">
            Interactive blueprints representing modern enterprise AI flows. Switch views to explore logic routing.
          </p>
        </div>

        {/* Diagram Switcher */}
        <div className="flex bg-[#121216] border border-white/10 rounded-lg p-1.5 max-w-md">
          <button
            onClick={() => setActiveDiagram('eval')}
            className={`flex-1 py-2 text-xs font-mono rounded-md font-semibold transition-all ${
              activeDiagram === 'eval' 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LLM-Assisted Evaluation
          </button>
          <button
            onClick={() => setActiveDiagram('tool')}
            className={`flex-1 py-2 text-xs font-mono rounded-md font-semibold transition-all ${
              activeDiagram === 'tool' 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tool Calling Flow
          </button>
        </div>

        {/* Dynamic Diagram Visualizer Card */}
        <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-6 min-h-[420px] flex flex-col justify-between shadow-lg relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          {activeDiagram === 'eval' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">LLM-Assisted Evaluation (Branching Pipeline)</h3>
                  <p className="text-xs text-slate-400">How models are benchmarked using golden ground truth, generators, and evaluator LLMs. Click any node to inspect.</p>
                </div>
                <span className="text-xs text-slate-500 font-mono">azure-ai-evaluation SDK</span>
              </div>

              {/* Graphical representation of LLM-Assisted Evaluation */}
              <div className="relative min-h-[420px] w-full border border-white/5 bg-[#08080b]/60 rounded-2xl overflow-hidden p-4">
                
                {/* SVG Connections & Arrowheads (Visible on desktop) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <defs>
                    <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6" />
                    </marker>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                    </marker>
                    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                    </marker>
                  </defs>

                  {/* Lines mapping the exact Mermaid flows */}
                  {/* Dataset [Test Dataset] --> Generator [Target AI Model] */}
                  <path d="M 170 200 Q 240 120 310 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow-blue)" />
                  <text x="210" y="125" fill="#3b82f6" className="text-[10px] font-mono" textAnchor="middle">Test Inputs</text>

                  {/* Dataset -->|Ground Truth| Evaluator */}
                  <path d="M 170 200 Q 240 280 310 300" stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
                  <text x="210" y="275" fill="#93c5fd" className="text-[10px] font-mono" textAnchor="middle">Ground Truth</text>

                  {/* Generator -->|Generated Outputs| Evaluator */}
                  <path d="M 370 145 L 370 250" stroke="#14b8a6" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-teal)" />
                  <text x="380" y="195" fill="#2dd4bf" className="text-[10px] font-mono font-bold" textAnchor="start">Generated Outputs</text>

                  {/* Evaluator -->|F1 / Coherence Metrics| Parser */}
                  <path d="M 430 300 Q 500 280 570 200" stroke="#a855f7" strokeWidth="2" fill="none" markerEnd="url(#arrow-purple)" />
                  <text x="520" y="270" fill="#c084fc" className="text-[10px] font-mono" textAnchor="middle">F1 &amp; Coherence Metrics</text>

                  {/* Parser -->|Publish Telemetry| AzureDB */}
                  <path d="M 690 200 L 760 200" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" fill="none" markerEnd="url(#arrow-teal)" />
                  <text x="725" y="185" fill="#34d399" className="text-[10px] font-mono" textAnchor="middle">Publish Telemetry</text>
                </svg>

                {/* 2D Grid Layout on Desktop / Stacked Layout on Mobile */}
                <div className="relative w-full h-full z-10 flex flex-col md:block gap-6">
                  
                  {/* Node 1: Dataset */}
                  <div 
                    onClick={() => setSelectedEvalNode('dataset')}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 md:absolute md:left-[2%] md:top-[35%] md:w-[20%] ${
                      selectedEvalNode === 'dataset'
                        ? 'bg-blue-950/40 border-blue-400 text-blue-200 shadow-lg shadow-blue-500/20'
                        : 'bg-[#121217] border-white/10 text-slate-300 hover:border-blue-500/50 hover:bg-blue-950/10'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Database className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white">Dataset</h4>
                    <span className="text-[9px] font-mono text-blue-400 font-semibold mt-1 block uppercase">[Test Dataset]</span>
                    <p className="text-[9px] text-slate-400 mt-1">Inputs &amp; Ground Truth</p>
                  </div>

                  {/* Node 2: Generator */}
                  <div 
                    onClick={() => setSelectedEvalNode('generator')}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 md:absolute md:left-[27%] md:top-[5%] md:w-[20%] ${
                      selectedEvalNode === 'generator'
                        ? 'bg-yellow-950/40 border-yellow-400 text-yellow-200 shadow-lg shadow-yellow-500/20'
                        : 'bg-[#121217] border-white/10 text-slate-300 hover:border-yellow-500/50 hover:bg-yellow-950/10'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white">Generator</h4>
                    <span className="text-[9px] font-mono text-yellow-400 font-semibold mt-1 block uppercase">[Target AI Model]</span>
                    <p className="text-[9px] text-slate-400 mt-1">Undergoing Benchmark</p>
                  </div>

                  {/* Node 3: Evaluator */}
                  <div 
                    onClick={() => setSelectedEvalNode('evaluator')}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 md:absolute md:left-[27%] md:top-[63%] md:w-[20%] ${
                      selectedEvalNode === 'evaluator'
                        ? 'bg-teal-950/40 border-teal-400 text-teal-200 shadow-lg shadow-teal-500/20'
                        : 'bg-[#121217] border-white/10 text-slate-300 hover:border-teal-500/50 hover:bg-teal-950/10'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                        <Zap className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white">Evaluator</h4>
                    <span className="text-[9px] font-mono text-teal-300 font-semibold mt-1 block uppercase">[LLM GPT-4 Evaluator]</span>
                    <p className="text-[9px] text-slate-400 mt-1">Rubrics judge</p>
                  </div>

                  {/* Node 4: Parser */}
                  <div 
                    onClick={() => setSelectedEvalNode('parser')}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 md:absolute md:left-[52%] md:top-[35%] md:w-[20%] ${
                      selectedEvalNode === 'parser'
                        ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20'
                        : 'bg-[#121217] border-white/10 text-slate-300 hover:border-purple-500/50 hover:bg-purple-950/10'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white">Parser</h4>
                    <span className="text-[9px] font-mono text-purple-400 font-semibold mt-1 block uppercase">[Metrics Parser]</span>
                    <p className="text-[9px] text-slate-400 mt-1">F1 &amp; Coherence metrics</p>
                  </div>

                  {/* Node 5: AzureDB */}
                  <div 
                    onClick={() => setSelectedEvalNode('azuredb')}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-300 md:absolute md:left-[77%] md:top-[35%] md:w-[20%] ${
                      selectedEvalNode === 'azuredb'
                        ? 'bg-green-950/40 border-green-400 text-green-200 shadow-lg shadow-green-500/20'
                        : 'bg-[#121217] border-white/10 text-slate-300 hover:border-green-500/50 hover:bg-green-950/10'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white">AzureDB</h4>
                    <span className="text-[9px] font-mono text-green-400 font-semibold mt-1 block uppercase">[Evaluation Dashboard]</span>
                    <p className="text-[9px] text-slate-400 mt-1">Telemetry Dashboard</p>
                  </div>

                </div>
              </div>

              {/* Explanatory detail block on selection */}
              {selectedEvalNode ? (
                <div className="bg-[#111116] border border-teal-500/20 rounded-xl p-5 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold">Node Specification</span>
                    <button onClick={() => setSelectedEvalNode(null)} className="text-xs text-slate-500 hover:text-slate-300">Close Spec ✕</button>
                  </div>
                  <h4 className="text-sm font-bold text-white">{evalNodeDetails[selectedEvalNode].title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{evalNodeDetails[selectedEvalNode].desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mt-2 border-t border-white/5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-teal-400 uppercase">Architecture Role:</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{evalNodeDetails[selectedEvalNode].role}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">MS-Learn Exam Insight:</span>
                      <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/5 px-2.5 py-1.5 rounded border border-amber-500/10">{evalNodeDetails[selectedEvalNode].certTip}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 text-center text-xs text-slate-400">
                  ⚡ Click any node in the branching diagram above to explore official Azure AI Evaluation architecture specs.
                </div>
              )}

              {/* Textual representation */}
              <div className="bg-[#070709] rounded-lg p-3.5 border border-white/5 font-mono text-xs text-slate-400 space-y-1.5">
                <div className="text-teal-400 text-[10px] uppercase font-bold tracking-widest mb-1.5">Mermaid Blueprint Syntax</div>
                <div>graph LR</div>
                <div className="pl-4 text-blue-300">Dataset[Test Dataset] --&gt; Generator[Target AI Model]</div>
                <div className="pl-4 text-teal-300">Generator --&gt;|Generated Outputs| Evaluator[Evaluator LLM GPT-4]</div>
                <div className="pl-4 text-blue-300">Dataset --&gt;|Ground Truth| Evaluator</div>
                <div className="pl-4 text-purple-300">Evaluator --&gt;|F1 / Coherence Metrics| Parser[Metrics Parser]</div>
                <div className="pl-4 text-emerald-300">Parser --&gt;|Publish Telemetry| AzureDB[Azure AI Evaluation Dashboard]</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Tool-Calling Execution Flow (Agent Loops)</h3>
                  <p className="text-xs text-slate-400">How the orchestrator detects intermediate requires_action limits and delegates dynamic calculations to sandboxes.</p>
                </div>
                <span className="text-xs text-slate-500 font-mono">Agent Logic Loop</span>
              </div>

              {/* Graphical representation of Tool Calling */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-center py-6">
                
                {/* Node 1 */}
                <div className="bg-[#121216] border border-white/10 rounded-lg p-3 text-center flex flex-col items-center space-y-2 relative">
                  <div className="p-2.5 bg-blue-500/10 rounded-full text-blue-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">1. Client Request</span>
                  <span className="text-[10px] font-mono text-slate-500">Triggers Run Queue</span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <ArrowRight className="w-5 h-5 text-teal-500" />
                  </div>
                </div>

                {/* Node 2 */}
                <div className="bg-[#121216] border border-white/10 rounded-lg p-3 text-center flex flex-col items-center space-y-2 relative">
                  <div className="p-2.5 bg-rose-500/10 rounded-full text-rose-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-rose-300">2. LLM Decides</span>
                  <span className="text-[10px] font-mono text-rose-400 font-semibold bg-rose-500/5 px-1 rounded">requires_action</span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <ArrowRight className="w-5 h-5 text-teal-500" />
                  </div>
                </div>

                {/* Node 3 */}
                <div className="bg-teal-950/20 border border-teal-500/30 rounded-lg p-3 text-center flex flex-col items-center space-y-2 relative">
                  <div className="p-2.5 bg-teal-500/20 rounded-full text-teal-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-teal-300">3. Sandbox Execute</span>
                  <span className="text-[10px] font-mono text-teal-400">Container Terminal Runs Code</span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <ArrowRight className="w-5 h-5 text-teal-500" />
                  </div>
                </div>

                {/* Node 4 */}
                <div className="bg-[#121216] border border-white/10 rounded-lg p-3 text-center flex flex-col items-center space-y-2">
                  <div className="p-2.5 bg-green-500/10 rounded-full text-green-400">
                    <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <span className="text-xs font-bold text-white">4. Submit Output</span>
                  <span className="text-[10px] font-mono text-slate-500">Resumes Inference Model</span>
                </div>

              </div>

              {/* Textual representation */}
              <div className="bg-[#070709] rounded-lg p-3 border border-white/5 font-mono text-xs text-slate-400 space-y-1">
                <div className="text-teal-400 text-[10px] uppercase font-bold tracking-widest mb-1.5">Mermaid Blueprint Syntax</div>
                <div>sequenceDiagram</div>
                <div className="pl-4">Client-&gt;&gt;AzureAgent: 1. Trigger Run on Stateful Thread</div>
                <div className="pl-4">AzureAgent-&gt;&gt;Client: 2. Status: requires_action (Requests Code Interpreter Tool)</div>
                <div className="pl-4">Client-&gt;&gt;AzureSandbox: 3. Invoke Dynamic Python execution</div>
                <div className="pl-4">AzureSandbox--&gt;&gt;Client: Return terminal print stdout</div>
                <div className="pl-4">Client-&gt;&gt;AzureAgent: 4. Submit outputs (Resumes thread processing)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gap Filler Snippets */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase font-semibold">Gap Fillers</span>
          <h2 className="text-xl font-bold text-white mt-2">Specialized Implementation Patterns</h2>
          <p className="text-sm text-slate-400">
            Code snippets covering the advanced Domain 2 topics added in the AI-901 update.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Azure Content Understanding */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#121218] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-medium">content_understanding.py</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase">Replaces Form Recognizer</span>
            </div>
            <div className="p-4 bg-[#070709] overflow-auto text-xs font-mono text-slate-300 leading-relaxed">
              <pre>{`from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential

# Example: Extracting text & structure from a complex document/image
client = ContentSafetyClient(endpoint=endpoint, credential=AzureKeyCredential(key))

# Content Understanding handles multiple modalities (docs, forms, images, audio)
# replacing older individual Cognitive Services.
request = AnalyzeTextOptions(text="Your document text here...")
response = client.analyze_text(request)

print("Extraction completed natively within Foundry.")`}</pre>
            </div>
          </div>

          {/* Azure Speech */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#121218] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-medium">azure_speech_foundry.py</span>
              </div>
            </div>
            <div className="p-4 bg-[#070709] overflow-auto text-xs font-mono text-slate-300 leading-relaxed">
              <pre>{`import azure.cognitiveservices.speech as speechsdk

# Example: Text-to-Speech / Speech-to-Text via Foundry
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

# Instantiating the synthesizer
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

# Responding to spoken prompts using a deployed multimodal model
result = speech_synthesizer.speak_text_async("Generating voice response from agent...").get()
`}</pre>
            </div>
          </div>

          {/* Lightweight Agent Client */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#121218] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-medium">lightweight_agent_client.py</span>
              </div>
            </div>
            <div className="p-4 bg-[#070709] overflow-auto text-xs font-mono text-slate-300 leading-relaxed">
              <pre>{`from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

# Example: Creating a lightweight client application for an agent
credential = DefaultAzureCredential()
client = AIProjectClient.from_connection_string(credential=credential, conn_str="<CONN_STR>")

# Creating a new thread for conversation
thread = client.agents.create_thread()

# Appending user message
client.agents.create_message(thread_id=thread.id, role="user", content="Analyze this dataset.")

# Triggering the run
run = client.agents.create_run(thread_id=thread.id, agent_id="<AGENT_ID>")
`}</pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
