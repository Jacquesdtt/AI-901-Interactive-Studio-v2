import React, { useState } from 'react';
import { useAi } from '../context/AiContext';
import { Code, Play, Lightbulb, Loader2, CheckCircle, XCircle } from 'lucide-react';

const scenarios = [
  {
    id: 's1',
    title: 'Initialize FoundryClient',
    description: 'Write Python code to import and initialize the FoundryClient using an endpoint and key.',
    starterCode: 'from __future__ import annotations\n# TODO: Import FoundryClient\n\n# TODO: Initialize client\nclient = ',
  },
  {
    id: 's2',
    title: 'Create an Agent',
    description: 'Use the Foundry SDK to create an agent named "ResearchBot" with the instruction "You are a researcher.".',
    starterCode: '# Assume client is already initialized as `client`\n\n# TODO: Create the agent\nagent = ',
  }
];

export default function TabSandbox() {
  const { aiClient, isKeyValid } = useAi();
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [code, setCode] = useState(scenarios[0].starterCode);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; hint?: string } | null>(null);

  const scenario = scenarios.find(s => s.id === activeScenarioId)!;

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    const s = scenarios.find(x => x.id === id)!;
    setCode(s.starterCode);
    setFeedback(null);
  };

  const evaluateCode = async () => {
    if (!aiClient) return;
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are evaluating Python code for the Microsoft Foundry SDK.\nScenario: ${scenario.description}\nUser Code:\n\`\`\`python\n${code}\n\`\`\`\nEvaluate the correctness of the code based strictly on official Microsoft documentation. Return ONLY raw JSON matching this schema: { "isCorrect": boolean, "message": "string (explanation)", "hint": "string (optional, provide if isCorrect is false)" }`,
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
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 bg-[#000000] text-white overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <Code className="w-8 h-8 text-[#0078d4]" />
        <h2 className="text-3xl font-bold">Interactive Coding Sandbox</h2>
      </div>
      <p className="text-slate-400 max-w-2xl">
        Practice writing Python code for the Microsoft Foundry SDK. Your code is evaluated against official documentation in real-time.
      </p>

      {!isKeyValid && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200">
          <strong>API Key Required:</strong> You must set your Gemini API key in the AI Chatbot panel to use the Sandbox evaluation engine.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Instructions & Scenarios */}
        <div className="lg:col-span-1 flex flex-col gap-6">
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
              {scenario.description}
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#050505] border border-[#0078d4]/20 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2"><Code className="w-5 h-5 text-[#0078d4]" /> Editor (Python)</h3>
              <button 
                onClick={evaluateCode}
                disabled={!isKeyValid || isEvaluating}
                className="bg-[#0078d4] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg"
              >
                {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Run &amp; Evaluate
              </button>
            </div>
            
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 w-full bg-[#000000] border border-white/10 rounded-xl p-6 font-mono text-sm text-green-400 focus:outline-none focus:border-[#0078d4] resize-none min-h-[300px]"
              spellCheck="false"
            />
          </div>

          {feedback && (
            <div className={`p-6 rounded-2xl border flex flex-col gap-3 animate-in slide-in-from-bottom-4 ${feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />}
                <h3 className={`text-xl font-bold ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {feedback.isCorrect ? 'Success!' : 'Needs Improvement'}
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{feedback.message}</p>
              
              {!feedback.isCorrect && feedback.hint && (
                <div className="mt-4 p-4 bg-[#000000] rounded-xl border border-white/5 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-slate-400 text-sm"><strong>Hint:</strong> {feedback.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
