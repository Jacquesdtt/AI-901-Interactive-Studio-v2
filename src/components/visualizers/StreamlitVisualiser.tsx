import React, { useState } from 'react';
import { LayoutTemplate, RefreshCw, Database, Server, Play, MousePointer2 } from 'lucide-react';

export default function StreamlitVisualiser() {
  const [clickCount, setClickCount] = useState(0);
  const [useSessionState, setUseSessionState] = useState(false);

  const codeSnippet = useSessionState
    ? `import streamlit as st

if 'count' not in st.session_state:
    st.session_state.count = 0

if st.button("Click Me"):
    st.session_state.count += 1

st.write(f"Count: {st.session_state.count}")`
    : `import streamlit as st

count = 0

if st.button("Click Me"):
    count += 1

st.write(f"Count: {count}")`;

  return (
    <div className="flex w-full h-full p-6 gap-8">
      
      {/* Interactive App Simulator */}
      <div className="flex-1 bg-[#111116] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        <div className="bg-[#181820] p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <LayoutTemplate className="w-5 h-5" />
            Streamlit App Simulator
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Use st.session_state?</span>
            <button 
              onClick={() => { setUseSessionState(!useSessionState); setClickCount(0); }}
              className={`w-10 h-5 rounded-full relative transition-colors ${useSessionState ? 'bg-teal-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${useSessionState ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col items-center justify-center gap-6">
          <button 
            onClick={() => setClickCount(c => c + 1)}
            className="px-6 py-3 bg-[#181820] border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-lg font-bold shadow-lg"
          >
            <MousePointer2 className="w-5 h-5 text-teal-400" /> Click Me
          </button>
          
          <div className="text-2xl font-mono">
            Count: <span className="text-teal-400 font-bold">{useSessionState ? clickCount : (clickCount > 0 ? 1 : 0)}</span>
          </div>

          <div className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 text-sm text-slate-400 max-w-md text-center">
            {useSessionState 
              ? "With Session State, variables persist across the Top-to-Bottom reruns triggered by the button click."
              : "Without Session State, the script runs top-to-bottom on every click. 'count = 0' is executed every time, resetting the value."}
          </div>
        </div>
      </div>

      {/* Code and Execution Flow */}
      <div className="w-96 flex flex-col gap-6">
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> The Rerun Model
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Unlike traditional web frameworks, Streamlit runs the <strong>entire Python script from top to bottom</strong> whenever a user interacts with a widget (like a button).
          </p>
          <div className="relative pl-6 border-l-2 border-teal-500/30 space-y-4 py-2">
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-teal-500" />
              <div className="text-sm font-bold">1. User Interaction</div>
              <div className="text-xs text-slate-400">Button is clicked in the browser.</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-teal-500" />
              <div className="text-sm font-bold">2. Server Rerun</div>
              <div className="text-xs text-slate-400">Streamlit executes app.py from line 1.</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-teal-500" />
              <div className="text-sm font-bold">3. UI Update</div>
              <div className="text-xs text-slate-400">New HTML/JS is sent to the browser.</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111116] border border-white/5 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
          <div className="bg-[#181820] px-4 py-2 border-b border-white/5 font-mono text-xs text-slate-400">app.py</div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
            {codeSnippet}
          </pre>
        </div>
      </div>
      
    </div>
  );
}
