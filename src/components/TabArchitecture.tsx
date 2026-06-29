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

const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'User Application' }, type: 'input' },
  { id: '2', position: { x: 300, y: 50 }, data: { label: 'Azure API Management' } },
  { id: '3', position: { x: 50, y: 200 }, data: { label: 'Azure AI Search' } },
  { id: '4', position: { x: 300, y: 200 }, data: { label: 'Azure OpenAI (LLM)' } },
  { id: '5', position: { x: 550, y: 200 }, data: { label: 'Azure Blob Storage (Docs)' } },
];

const initialEdges: Edge[] = [];

export default function TabArchitecture() {
  const { aiClient, isKeyValid } = useAi();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; hint?: string } | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

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
        contents: `You are evaluating an Azure AI architecture diagram for a standard RAG (Retrieval-Augmented Generation) pipeline.\n\nThe user's graph:\n${JSON.stringify(graphState, null, 2)}\n\nDoes this graph represent a valid RAG pattern connecting the User App to the LLM and the Search index? Evaluate the correctness. Return ONLY raw JSON matching this schema: { "isCorrect": boolean, "message": "string (explanation)", "hint": "string (optional, provide if isCorrect is false)" }`,
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
          Evaluate RAG Pipeline
        </button>
      </div>
      
      <p className="text-slate-400">
        Connect the nodes below to build a standard <strong>Retrieval-Augmented Generation (RAG)</strong> pattern on Azure. 
        Drag between node handles to create edges.
      </p>

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

      <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 overflow-hidden relative">
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
  );
}
