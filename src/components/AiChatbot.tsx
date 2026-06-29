import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Key, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { useAi } from '../context/AiContext';

export default function AiChatbot({ isExamActive }: { isExamActive: boolean }) {
  const { apiKey, setApiKey, isKeyValid, clearKey, aiClient } = useAi();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputKey, setInputKey] = useState('');
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Hello! I am your AI-901 Assistant powered by Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  if (isExamActive) {
    return null; // Hide completely during exam to prevent cheating
  }

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  const handleClearKey = () => {
    clearKey();
    setInputKey('');
  };

  const sendMessage = async () => {
    if (!input.trim() || !aiClient) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: "You are an expert tutor for the Microsoft AI-901 Azure AI Fundamentals exam. Your goal is to help the user understand Microsoft Foundry SDK, AI agents, Azure OpenAI, Machine Learning concepts, and Responsible AI. Keep responses concise, encouraging, and accurate.",
        }
      });
      
      const text = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message || 'Failed to fetch response. Please check your API key or network connection.'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-300 ${isOpen ? (isExpanded ? 'w-[600px] h-[80vh]' : 'w-[350px] h-[500px]') : 'w-auto h-auto'}`}>
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#0078d4] hover:bg-blue-500 text-white p-4 rounded-full shadow-[0_0_15px_rgba(0,120,212,0.5)] transition-all hover:scale-110 flex items-center justify-center group"
        >
          <Bot className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}

      {isOpen && (
        <div className="w-full h-full bg-[#050505] border border-[#0078d4]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#000000] border-b border-[#0078d4]/20 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5 text-[#0078d4]" />
              <h3 className="font-bold">AI-901 Tutor</h3>
            </div>
            <div className="flex items-center gap-2">
              {isKeyValid && (
                <button onClick={handleClearKey} className="text-slate-400 hover:text-rose-400 transition-colors" title="Clear API Key">
                  <Key className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white transition-colors">
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isKeyValid ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <Key className="w-12 h-12 text-[#0078d4] mb-4" />
              <h4 className="text-white font-bold mb-2">Gemini API Key Required</h4>
              <p className="text-slate-400 text-sm mb-6">Enter your Google Gemini API key to enable AI tutoring. It will be stored locally in your browser.</p>
              <input 
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#000000] border border-white/10 rounded-lg p-3 text-white mb-4 focus:outline-none focus:border-[#0078d4]"
              />
              <button 
                onClick={handleSaveKey}
                disabled={!inputKey.trim()}
                className="w-full bg-[#0078d4] hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Save Key
              </button>
            </div>
          ) : (
            <>
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                    <div className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-[#0078d4] text-white rounded-tr-none' : 'bg-[#162137] text-slate-200 border border-white/5 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="self-start max-w-[85%] bg-[#162137] text-slate-200 border border-white/5 p-3 rounded-xl rounded-tl-none text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0078d4] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#0078d4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#0078d4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#000000] border-t border-[#0078d4]/20 flex gap-2 shrink-0">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-[#0078d4] text-sm"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#0078d4] hover:bg-blue-500 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
