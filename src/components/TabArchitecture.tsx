import React, { useCallback, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAi } from '../context/AiContext';
import { Network, Play, Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const scenarios = [
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    description: 'Connect the nodes below to build a standard RAG pattern on Azure.',
    nodes: [
      { id: '1', position: { x: 50, y: 50 }, data: { label: 'User Application' }, type: 'input' },
      { id: '2', position: { x: 300, y: 50 }, data: { label: 'Azure API Management' } },
      { id: '3', position: { x: 50, y: 200 }, data: { label: 'Azure AI Search' } },
      { id: '4', position: { x: 300, y: 200 }, data: { label: 'Azure OpenAI (LLM)' } },
      { id: '5', position: { x: 550, y: 200 }, data: { label: 'Azure Blob Storage (Docs)' } },
    ]
  },
  {
    id: 'agentic',
    title: 'Agentic AI Flow with Tool Calling',
    description: 'Connect the nodes below to build an Agentic workflow where the LLM routes a request to an external tool.',
    nodes: [
      { id: '1', position: { x: 50, y: 50 }, data: { label: 'User Application' }, type: 'input' },
      { id: '2', position: { x: 300, y: 50 }, data: { label: 'Azure OpenAI (Agent)' } },
      { id: '3', position: { x: 50, y: 200 }, data: { label: 'Azure Functions (Tool Backend)' } },
      { id: '4', position: { x: 300, y: 200 }, data: { label: 'External Weather API' } },
    ]
  },
  {
    id: 'vision',
    title: 'Computer Vision Analysis Pipeline',
    description: 'Connect the nodes to process uploaded images using Azure AI Vision before storing metadata.',
    nodes: [
      { id: '1', position: { x: 50, y: 50 }, data: { label: 'Client (Image Upload)' }, type: 'input' },
      { id: '2', position: { x: 300, y: 50 }, data: { label: 'Azure Blob Storage (Trigger)' } },
      { id: '3', position: { x: 50, y: 200 }, data: { label: 'Azure Event Grid' } },
      { id: '4', position: { x: 300, y: 200 }, data: { label: 'Azure AI Vision' } },
      { id: '5', position: { x: 550, y: 200 }, data: { label: 'Azure Cosmos DB (Metadata)' } },
    ]
  }
];

const initialEdges: Edge[] = [];

export default function TabArchitecture() {
  const { aiClient, isKeyValid } = useAi();
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find(s => s.id === activeScenarioId)!;

  const [nodes, setNodes, onNodesChange] = useNodesState(JSON.parse(JSON.stringify(scenario.nodes)));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; hint?: string } | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    const s = scenarios.find(x => x.id === id)!;
    setNodes(JSON.parse(JSON.stringify(s.nodes)));
    setEdges([]);
    setFeedback(null);
  };

  const evaluateArchitecture = async () => {
    if (!aiClient) return;
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const graphState = {
        nodes: nodes.map(n => ({ id: n.id, label: n.data.label })),
        edges: edges.map(e => ({ source: nodes.find(n => n.id === e.source)?.data.label, target: nodes.find(n => n.id === e.target)?.data.label }))
      };

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are evaluating an Azure AI architecture diagram.\nScenario: ${scenario.title}\nDescription: ${scenario.description}\n\nThe user's graph:\n${JSON.stringify(graphState, null, 2)}\n\nDoes this graph represent a valid architecture for this scenario? Evaluate the correctness. Return ONLY raw JSON matching this schema: { "isCorrect": boolean, "message": "string (explanation)", "hint": "string (optional, provide if isCorrect is false)" }`,
        config: {
          responseMimeType: 'application/json'
        }
      });
      
      const data = JSON.parse(response.text);
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setFeedback({ isCorrect: false, message: 'An error occurred during evaluation.' });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-6 bg-[#000000] text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Network className="w-8 h-8 text-[#0078d4]" />
          <h2 className="text-3xl font-bold">Architecture Builder</h2>
        </div>
        <button 
          onClick={evaluateArchitecture}
          disabled={!isKeyValid || isEvaluating}
          className="bg-[#0078d4] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg"
        >
          {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          Evaluate Architecture
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-[#0078d4]">Select Scenario</h3>
            <div className="flex flex-col gap-3">
              {scenarios.map(s => (
                <button 
                  key={s.id}
                  onClick={() => handleScenarioChange(s.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${activeScenarioId === s.id ? 'bg-[#0078d4]/10 border-[#0078d4]' : 'bg-[#000000] border-white/5 hover:border-slate-600'}`}
                >
                  <strong className="block text-white mb-1">{s.title}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-xl flex-1">
            <h3 className="font-bold text-lg mb-4">Task Description</h3>
            <p className="text-slate-300 leading-relaxed bg-[#000000] p-4 rounded-xl border border-white/5">
              {scenario.description} Drag between node handles to create edges.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6">

      {feedback && (
        <div className={`p-4 rounded-xl border flex flex-col gap-2 animate-in slide-in-from-top-4 ${feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex items-center gap-2">
            {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
            <h3 className={`font-bold ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {feedback.isCorrect ? 'Valid Architecture!' : 'Architecture Needs Work'}
            </h3>
          </div>
          <p className="text-sm text-slate-300">{feedback.message}</p>
          {!feedback.isCorrect && feedback.hint && (
            <p className="text-sm text-amber-400 flex items-center gap-1 mt-1"><Lightbulb className="w-4 h-4" /> {feedback.hint}</p>
          )}
        </div>
      )}

        <div className="w-full h-[600px] bg-[#050505] rounded-2xl border border-white/10 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-[#050505]"
            colorMode="dark"
          >
            <Background color="#333" gap={16} />
            <Controls className="bg-slate-800 text-white fill-white border-white/10" />
          </ReactFlow>
        </div>
      </div>
    </div>
    </div>
  );
}
