import React, { useState } from 'react';
import { useAi } from '../context/AiContext';
import { Code, Play, Lightbulb, Loader2, CheckCircle, XCircle } from 'lucide-react';

const scenarios = [
  {
    id: 's1',
    title: 'Hello Streamlit',
    description: 'Write Python code to import Streamlit, set a page title "AI Dashboard", and create a sidebar with a header "Navigation".',
    starterCode: '# TODO: Import Streamlit\n\n# TODO: Set the main page title\n\n# TODO: Create a sidebar with a header\n',
  },
  {
    id: 's2',
    title: 'Interactive Metrics',
    description: 'Use st.columns to create two columns. In the first column, render a metric named "Accuracy" with value "95%". In the second column, create a button labeled "Retrain Model".',
    starterCode: 'import streamlit as st\n\n# TODO: Create 2 columns\n\n# TODO: Render metric in col 1\n\n# TODO: Render button in col 2\n',
  }
];

export default function StreamlitSandbox() {
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
        contents: `You are evaluating Python code for a Streamlit Dashboard application.\nScenario: ${scenario.description}\nUser Code:\n\`\`\`python\n${code}\n\`\`\`\nEvaluate the correctness of the code based strictly on official Streamlit documentation. Return ONLY raw JSON matching this schema: { "isCorrect": boolean, "message": "string (explanation)", "hint": "string (optional, provide if isCorrect is false)" }`,
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
    <div className="flex flex-col w-full p-6 lg:p-8 gap-8 bg-[#0a0a0d] border-t border-indigo-900/30 text-white rounded-b-2xl">
      <div className="flex items-center gap-3 mb-2">
        <Code className="w-8 h-8 text-indigo-400" />
        <h2 className="text-3xl font-bold">Streamlit Coding Sandbox</h2>
      </div>
      <p className="text-slate-400 max-w-2xl">
        Practice writing Python code for Streamlit dashboards. Your code is evaluated by an AI judge in real-time.
      </p>

      {!isKeyValid && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200">
          <strong>API Key Required:</strong> You must set your Gemini API key in the AI Chatbot panel to use the Sandbox evaluation engine.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Instructions & Scenarios */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-sm mb-4 text-indigo-400 uppercase tracking-widest">Select Scenario</h3>
            <div className="flex flex-col gap-3">
              {scenarios.map(s => (
                <button 
                  key={s.id}
                  onClick={() => handleScenarioChange(s.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${activeScenarioId === s.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-[#181820] border-white/10 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
                >
                  <strong className="block mb-1">{s.title}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex-1">
            <h3 className="font-bold text-sm mb-4 text-slate-400 uppercase tracking-widest">Task Description</h3>
            <p className="text-slate-300 leading-relaxed bg-[#181820] p-4 rounded-xl border border-white/5">
              {scenario.description}
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#111116] border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2"><Code className="w-4 h-4 text-indigo-400" /> Editor (app.py)</h3>
              <button 
                onClick={evaluateCode}
                disabled={!isKeyValid || isEvaluating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
              >
                {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Run &amp; Evaluate
              </button>
            </div>
            
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 w-full bg-[#181820] border border-white/10 rounded-xl p-6 font-mono text-sm text-emerald-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none min-h-[300px]"
              spellCheck="false"
            />
          </div>

          {feedback && (
            <div className={`p-6 rounded-2xl border flex flex-col gap-3 animate-fadeIn ${feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />}
                <h3 className={`text-xl font-bold ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {feedback.isCorrect ? 'Success!' : 'Needs Improvement'}
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{feedback.message}</p>
              
              {!feedback.isCorrect && feedback.hint && (
                <div className="mt-4 p-4 bg-[#181820] rounded-xl border border-white/5 flex gap-3">
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
