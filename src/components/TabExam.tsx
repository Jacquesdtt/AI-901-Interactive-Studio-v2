import React, { useState } from 'react';
import FlipCard from './ui/FlipCard';
import { activeRecallCards, examQuestions } from '../data/curriculum';
import { useMastery } from '../context/MasteryContext';
import { useAi } from '../context/AiContext';
import { ShieldCheck, Target, AlertTriangle, ArrowRight, PlayCircle, Code, BookOpen, CheckCircle, XCircle, Bot, Loader2 } from 'lucide-react';

export default function TabExam() {
  const { updateScore } = useMastery();
  const { aiClient, isKeyValid } = useAi();
  
  const [examState, setExamState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [examMode, setExamMode] = useState<'static' | 'ai'>('static');
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [dynamicQ, setDynamicQ] = useState<typeof examQuestions[0] | null>(null);
  const [dynamicFeedback, setDynamicFeedback] = useState<string | null>(null);
  
  // selectedAns can be a number (for MCQ) or string (for short answer)
  const [selectedAns, setSelectedAns] = useState<number | string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [shortAnswerInput, setShortAnswerInput] = useState('');

  // Track results for personalized feedback
  const [results, setResults] = useState<{q: typeof examQuestions[0], userAns: any, isCorrect: boolean}[]>([]);

  React.useEffect(() => {
    if (examState === 'running' && isStrictMode && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (examState === 'running' && isStrictMode && timeLeft === 0) {
      // Auto submit
      setExamState('completed');
      if (examMode === 'ai') generateFeedback(results);
    }
  }, [examState, isStrictMode, timeLeft, examMode, results]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const generateQuestion = async (index: number) => {
    if (!aiClient) return null;
    setIsLoading(true);
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Generate a difficult scenario-based question for the AI-901 Azure AI Fundamentals exam (specifically covering Microsoft Foundry SDK or Agentic AI). The question should test deep understanding rather than memorization. If it's a short-answer question, do NOT provide leading context that makes the answer obvious; it must require exact knowledge of a command, API, or concept. Make sure it adheres strictly to the official documentation. Return ONLY raw JSON matching this schema: 
        { "id": "string", "topic": "string", "difficulty": "medium" | "hard", "type": "mcq" | "short-answer", "scenario": "string", "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": number (index 0-3), "correctAnswerText": "string", "explanation": "string", "codeSnippet": "string (optional)" }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text);
      setDynamicQ(data);
      return data;
    } catch (err) {
      console.error("Failed to generate question:", err);
      // Fallback to static if it fails
      setDynamicQ(examQuestions[index]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeedback = async (finalResults: typeof results) => {
    if (!aiClient) return;
    setIsLoading(true);
    try {
      const summary = finalResults.map((r, i) => `Q: ${r.q.question}\nCorrect: ${r.isCorrect}`).join('\n');
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are an AI-901 expert tutor. Review the following exam results and provide a brief, personalized 2-paragraph feedback report highlighting strengths and specific weaknesses to study further.\n\nResults:\n${summary}`
      });
      setDynamicFeedback(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startExam = async (mode: 'static' | 'ai') => {
    setExamMode(mode);
    setExamState('running');
    setCurrentQ(0);
    setScore(0);
    setSelectedAns(null);
    setIsEvaluated(false);
    setShortAnswerInput('');
    setResults([]);
    setDynamicFeedback(null);
    setTimeLeft(45 * 60);
    
    if (mode === 'ai') {
      await generateQuestion(0);
    } else {
      setDynamicQ(examQuestions[0]);
    }
  };

  const submitShortAnswer = () => {
    if (!shortAnswerInput.trim() || isEvaluated) return;
    const q = dynamicQ!;
    const isCorrect = shortAnswerInput.trim().toLowerCase() === q.correctAnswerText?.toLowerCase();
    
    setSelectedAns(shortAnswerInput);
    if (!isStrictMode) {
      setIsEvaluated(true);
    }
    
    if (isCorrect) setScore(s => s + 1);
    setResults(prev => [...prev, { q, userAns: shortAnswerInput, isCorrect }]);
  };

  const handleAnswerMCQ = (index: number) => {
    if (isEvaluated && !isStrictMode) return; // Prevent changing if evaluated, but in strict mode we just let them click next? Wait, if they click an answer we should just select it.
    // If strict mode, they can change answer before clicking Next. So let's handle that.
    const q = dynamicQ!;
    const isCorrect = index === q.correctAnswer;
    
    setSelectedAns(index);
    if (!isStrictMode) {
      setIsEvaluated(true);
      if (isCorrect) setScore(s => s + 1);
      setResults(prev => [...prev, { q, userAns: index, isCorrect }]);
    } else {
      // In strict mode, we'll wait for "Next Question" to save the result.
      // We can just store selectedAns for now.
    }
  };

  const nextQuestion = async () => {
    if (isStrictMode && selectedAns !== null) {
      // Record answer on next
      const q = dynamicQ!;
      let isCorrect = false;
      if (q.type === 'mcq') {
        isCorrect = selectedAns === q.correctAnswer;
      } else {
        isCorrect = (selectedAns as string).trim().toLowerCase() === q.correctAnswerText?.toLowerCase();
      }
      if (isCorrect) setScore(s => s + 1);
      setResults(prev => [...prev, { q, userAns: selectedAns, isCorrect }]);
    }

    const totalQ = examMode === 'static' ? examQuestions.length : 5; // AI exam has 5 questions
    if (currentQ < totalQ - 1) {
      const nextIdx = currentQ + 1;
      setCurrentQ(nextIdx);
      setSelectedAns(null);
      setIsEvaluated(false);
      setShortAnswerInput('');
      
      if (examMode === 'ai') {
        await generateQuestion(nextIdx);
      } else {
        setDynamicQ(examQuestions[nextIdx]);
      }
    } else {
      setExamState('completed');
      const percent = Math.round((score / totalQ) * 100);
      updateScore('foundations', percent);
      
      if (examMode === 'ai') {
        generateFeedback(results);
      }
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const q = dynamicQ;
  const totalQ = examMode === 'static' ? examQuestions.length : 5;

  return (
    <div className="flex flex-col w-full p-6 lg:p-12 gap-10 bg-[#000000] text-white overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-[#0078d4]" />
        <h2 className="text-3xl font-bold">Adaptive Exam &amp; Gamification</h2>
      </div>

      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Spaced Repetition: Active Recall</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRecallCards.map((card) => (
            <FlipCard 
              key={card.id}
              topic={card.topic}
              question={card.question}
              answer={card.answer}
              onMastery={(s) => updateScore('foundations', s)}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#0a0f1c] border border-[#0078d4]/20 rounded-2xl p-8 relative shadow-xl mt-8 min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/50 to-transparent" />
        
        {examState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="w-16 h-16 text-rose-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Final Certification Challenge</h3>
            <p className="text-slate-400 max-w-lg mb-8">Test your knowledge with dynamic scenarios, code reading challenges, and fill-in-the-blank questions.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => startExam('static')} className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors">
                <PlayCircle className="w-5 h-5" /> Start Static Exam
              </button>
              
              <button 
                onClick={() => startExam('ai')} 
                disabled={!isKeyValid}
                className="bg-[#0078d4] hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-[#0078d4] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors relative group"
              >
                <Bot className="w-5 h-5" /> Start AI-Generated Exam
                {!isKeyValid && (
                  <span className="absolute -top-10 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Requires API Key
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {examState === 'running' && isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
            <Loader2 className="w-12 h-12 text-[#0078d4] animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Generating Question...</h3>
            <p className="text-sm text-slate-400">Consulting official Microsoft Foundry documentation</p>
          </div>
        )}

        {examState === 'running' && !isLoading && q && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0078d4]/10 rounded-lg">
                  <Bot className="w-6 h-6 text-[#0078d4]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Question {currentQ + 1} of {totalQ}</h2>
                  <div className="flex gap-3 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {q.topic}</span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className={`w-4 h-4 ${q.difficulty === 'hard' ? 'text-rose-400' : 'text-amber-400'}`} /> 
                      {q.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              {isStrictMode && (
                <div className="flex items-center gap-2 bg-[#050505] border border-rose-500/30 px-4 py-2 rounded-xl">
                  <span className={`font-mono font-bold text-lg ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {q.scenario && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3 text-indigo-100 text-sm">
                <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                <p>{q.scenario}</p>
              </div>
            )}

            <h3 className="text-xl font-bold text-white">{q.question}</h3>

            {q.codeSnippet && (
              <div className="bg-[#000000] border border-white/5 p-4 rounded-xl font-mono text-sm text-slate-300 relative">
                <Code className="w-4 h-4 text-slate-500 absolute top-4 right-4" />
                <pre className="whitespace-pre-wrap">{q.codeSnippet}</pre>
              </div>
            )}

            {q.type === 'mcq' && q.options && (
              <div className="flex flex-col gap-3 mt-2">
                {q.options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-slate-300 flex items-center justify-between group ";
                  if (!isEvaluated || isStrictMode) {
                    if (selectedAns === idx) {
                      btnClass += "border-[#0078d4] bg-[#0078d4]/10 text-white shadow-[0_0_10px_rgba(0,120,212,0.2)]";
                    } else {
                      btnClass += "border-slate-700 bg-[#050505] hover:bg-[#0a0a0a] hover:border-slate-500";
                    }
                  } else {
                    if (idx === q.correctAnswer) {
                      btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                    } else if (selectedAns === idx) {
                      btnClass += "border-rose-500 bg-rose-500/20 text-rose-100";
                    } else {
                      btnClass += "border-slate-800 bg-[#000000] opacity-50";
                    }
                  }
                  return (
                    <button key={idx} onClick={() => handleAnswerMCQ(idx)} className={btnClass} disabled={isEvaluated && !isStrictMode}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'short-answer' && (
              <div className="flex flex-col gap-4 mt-2">
                <input 
                  type="text" 
                  value={shortAnswerInput}
                  onChange={(e) => setShortAnswerInput(e.target.value)}
                  disabled={isEvaluated && !isStrictMode}
                  placeholder="Type your exact command, concept, or function name here..."
                  className="flex-1 bg-[#02040a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#0078d4] transition-colors disabled:opacity-50"
                />
                {!isEvaluated && (
                  <button 
                    onClick={submitShortAnswer}
                    disabled={!shortAnswerInput.trim()}
                    className="bg-[#0078d4] hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {(isEvaluated || (isStrictMode && selectedAns !== null)) && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-bottom-4">
                {!isStrictMode && (
                  <div className={`p-6 rounded-xl border mb-6 ${selectedAns === (q.type === 'mcq' ? q.correctAnswer : q.correctAnswerText) ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                    <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${selectedAns === (q.type === 'mcq' ? q.correctAnswer : q.correctAnswerText) ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedAns === (q.type === 'mcq' ? q.correctAnswer : q.correctAnswerText) ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      {selectedAns === (q.type === 'mcq' ? q.correctAnswer : q.correctAnswerText) ? 'Correct!' : 'Incorrect'}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="w-full bg-[#050505] border border-white/10 hover:bg-[#0a0a0a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {currentQ < totalQ - 1 ? 'Next Question' : 'Finish Exam'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {examState === 'completed' && (
          <div className="flex flex-col py-6 animate-in zoom-in-95 fade-in gap-8">
            <div className="text-center">
              <ShieldCheck className="w-16 h-16 text-[#0078d4] mx-auto mb-4" />
              <h3 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0078d4] to-blue-400">Exam Complete!</h3>
              <p className="text-xl text-slate-300">You scored {score} out of {totalQ} ({(score/totalQ*100).toFixed(0)}%)</p>
            </div>

            {examMode === 'ai' && isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-[#02040a] rounded-2xl border border-white/5">
                <Loader2 className="w-8 h-8 text-[#0078d4] animate-spin mb-4" />
                <h4 className="text-white font-bold mb-1">Generating Personalized Feedback...</h4>
                <p className="text-slate-400 text-sm">Analyzing your responses to provide targeted study recommendations.</p>
              </div>
            )}

            {examMode === 'ai' && !isLoading && dynamicFeedback && (
              <div className="bg-[#0078d4]/10 rounded-2xl border border-[#0078d4]/30 p-6">
                <h4 className="font-bold text-lg mb-4 text-[#0078d4] flex items-center gap-2">
                  <Bot className="w-5 h-5" /> AI Tutor Assessment
                </h4>
                <div className="prose prose-invert prose-blue max-w-none text-sm text-slate-300">
                  <pre className="whitespace-pre-wrap font-sans bg-transparent border-0 p-0 text-slate-300">{dynamicFeedback}</pre>
                </div>
              </div>
            )}

            {/* Results breakdown in Strict Mode */}
            {isStrictMode && (
              <div className="mt-6 flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <h4 className="font-bold text-lg text-white mb-2">Exam Results Breakdown</h4>
                {results.map((res, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${res.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-1">{res.q.question}</p>
                      {!res.isCorrect && (
                        <div className="text-xs text-slate-400 mt-2 p-2 bg-black/40 rounded border border-white/5 font-mono">
                          <span className="text-rose-400">Your Answer:</span> {res.q.type === 'mcq' ? res.q.options?.[res.userAns as number] : res.userAns}
                          <br/>
                          <span className="text-[#0078d4]">Correct Answer:</span> {res.q.type === 'mcq' ? res.q.options?.[res.q.correctAnswer as number] : res.q.correctAnswerText}
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{res.q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <button onClick={() => setExamState('idle')} className="bg-[#0f172a] border border-white/10 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-xl">
                Return to Exam Dashboard
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
