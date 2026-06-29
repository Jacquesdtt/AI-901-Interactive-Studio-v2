import React, { useState } from 'react';
import { useAi } from '../context/AiContext';
import { Search, BookOpen, Loader2, Link as LinkIcon, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TabDocs() {
  const { aiClient, isKeyValid } = useAi();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !aiClient) return;
    
    setIsSearching(true);
    setResult(null);

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are a RAG-powered documentation explorer strictly grounded in Microsoft Learn and Azure AI documentation. The user is searching for: "${query}".\n\nProvide a concise, highly accurate summary as if you are quoting Microsoft Docs. Include code snippets if relevant. At the bottom, include 1-2 simulated reference links in markdown format (e.g., "[Microsoft Learn: Azure OpenAI](https://learn.microsoft.com/...)"). If the query is completely unrelated to Azure or AI, refuse to answer and remind the user to stay on topic. DO NOT HALLUCINATE FEATURES that do not exist in Azure.`,
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

      {result && (
        <div className="flex-1 bg-[#050505] border border-white/10 rounded-2xl p-8 shadow-xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/10">
            <ShieldCheck className="w-5 h-5 text-[#0078d4]" />
            <h3 className="font-bold text-[#0078d4]">Microsoft Learn RAG Synthesis</h3>
          </div>
          <div className="prose prose-invert prose-blue max-w-none text-slate-300">
            <pre className="whitespace-pre-wrap font-sans bg-transparent border-0 p-0 text-slate-300">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
