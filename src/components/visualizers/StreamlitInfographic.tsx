import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, LayoutTemplate, Box, Server, Info } from 'lucide-react';

export default function StreamlitInfographic() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  // Auto-advance step every 1.5s if playing
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setStep(prev => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipBack = () => { setIsPlaying(false); setStep(prev => Math.max(0, prev - 1)); };
  const skipForward = () => { setIsPlaying(false); setStep(prev => Math.min(7, prev + 1)); };

  const stepsLabels = ["Init", "Imports", "Title", "Sidebar", "Inputs", "Metrics", "Chart", "Slider"];

  return (
    <div className="flex flex-col h-full w-full bg-[#000000] text-slate-100 overflow-hidden font-sans">
      
      {/* Header & Scrubber */}
      <div className="bg-[#050505] border-b border-white/10 px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-indigo-400" />
            Streamlit Architecture
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#111] p-1 rounded-lg border border-white/10">
              <button onClick={skipBack} className="p-1.5 hover:bg-white/10 rounded transition-colors" disabled={step === 0}><SkipBack className="w-4 h-4" /></button>
              <button onClick={togglePlay} className="p-1.5 hover:bg-white/10 rounded transition-colors text-indigo-400">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button onClick={skipForward} className="p-1.5 hover:bg-white/10 rounded transition-colors" disabled={step === 7}><SkipForward className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        
        <div className="relative pt-2 pb-6">
          <input 
            type="range" 
            min="0" max="7" 
            value={step}
            onChange={(e) => { setIsPlaying(false); setStep(parseInt(e.target.value)); }}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between absolute w-full mt-2 px-1">
            {stepsLabels.map((label, idx) => (
              <span key={idx} className={`text-[10px] uppercase font-bold tracking-wider cursor-pointer ${step >= idx ? 'text-indigo-400' : 'text-slate-600'}`} onClick={() => setStep(idx)}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area (3 Columns) */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
        
        {/* Column 1: IDE (app.py) */}
        <div className="flex-1 flex flex-col bg-[#111116] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="bg-[#181820] px-4 py-2 border-b border-white/10 text-xs font-mono flex justify-between">
            <span className="text-slate-400">app.py</span>
            <span className="text-slate-600">IDE</span>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar">
            
            <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-rose-400">import</span> streamlit <span className="text-rose-400">as</span> st<br/>
              <span className="text-rose-400">import</span> pandas <span className="text-rose-400">as</span> pd<br/><br/>
            </div>
            
            <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors"
                onMouseEnter={() => setActiveWidget('title')} onMouseLeave={() => setActiveWidget(null)}
              >
                st.<span className="text-blue-400">title</span>(<span className="text-green-400">"Sales Dashboard"</span>)
              </span><br/><br/>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors block"
                onMouseEnter={() => setActiveWidget('sidebar')} onMouseLeave={() => setActiveWidget(null)}
              >
                <span className="text-rose-400">with</span> st.sidebar:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;st.<span className="text-blue-400">header</span>(<span className="text-green-400">"Controls"</span>)
              </span><br/>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors block"
                onMouseEnter={() => setActiveWidget('button')} onMouseLeave={() => setActiveWidget(null)}
              >
                user_input = st.<span className="text-blue-400">text_input</span>(<span className="text-green-400">"Search"</span>)<br/>
                st.<span className="text-blue-400">button</span>(<span className="text-green-400">"Submit"</span>)
              </span><br/>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors block"
                onMouseEnter={() => setActiveWidget('metric')} onMouseLeave={() => setActiveWidget(null)}
              >
                col1, col2 = st.<span className="text-blue-400">columns</span>(<span className="text-amber-400">2</span>)<br/>
                col1.<span className="text-blue-400">metric</span>(<span className="text-green-400">"Revenue"</span>, <span className="text-green-400">"$1.2M"</span>)<br/>
                col2.<span className="text-blue-400">metric</span>(<span className="text-green-400">"Growth"</span>, <span className="text-green-400">"8%"</span>)
              </span><br/>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 6 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors block"
                onMouseEnter={() => setActiveWidget('chart')} onMouseLeave={() => setActiveWidget(null)}
              >
                data = pd.<span className="text-blue-400">DataFrame</span>([...])<br/>
                st.<span className="text-blue-400">line_chart</span>(data)
              </span><br/>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 7 ? 'opacity-100' : 'opacity-0'}`}>
              <span 
                className="cursor-crosshair hover:bg-white/5 rounded px-1 transition-colors block"
                onMouseEnter={() => setActiveWidget('slider')} onMouseLeave={() => setActiveWidget(null)}
              >
                st.<span className="text-blue-400">slider</span>(<span className="text-green-400">"Select range"</span>, <span className="text-amber-400">0</span>, <span className="text-amber-400">100</span>)
              </span>
            </div>
            
          </div>
          {/* Tooltip Overlay */}
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-lg backdrop-blur-sm flex items-start gap-2 text-indigo-200 text-xs shadow-xl">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p><strong>Rerun Model:</strong> Streamlit executes scripts top-to-bottom on every interaction. Hover over the declarative widgets to trace how they map directly to UI components.</p>
          </div>
        </div>

        {/* Column 2: Architecture */}
        <div className="flex-1 flex flex-col items-center py-8 relative bg-gradient-to-b from-[#111116] to-[#0a0a0d] border border-white/5 rounded-xl">
          <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Architecture</div>
          
          <div className={`transition-all duration-700 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-indigo-600 px-6 py-3 rounded-xl shadow-lg shadow-indigo-900/50 border border-indigo-400 font-bold flex items-center gap-2 z-10">
              <Box className="w-5 h-5" /> Streamlit Package
            </div>
            <div className="w-0.5 h-8 bg-indigo-500/50" />
            <div className="bg-[#181820] border border-white/20 px-4 py-2 rounded-lg text-sm text-slate-300 z-10">
              Prebuilt UI Components
            </div>
            <div className="w-0.5 h-12 bg-white/10 relative">
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/10" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 px-6 relative w-full max-w-sm">
            
            <ArchBlock id="sidebar" active={activeWidget === 'sidebar'} show={step >= 3} label="st.sidebar()" />
            <ArchBlock id="button" active={activeWidget === 'button'} show={step >= 4} label="st.button()" />
            <ArchBlock id="metric" active={activeWidget === 'metric'} show={step >= 5} label="st.metric()" />
            <ArchBlock id="chart" active={activeWidget === 'chart'} show={step >= 6} label="st.line_chart()" />
            <ArchBlock id="slider" active={activeWidget === 'slider'} show={step >= 7} label="st.slider()" />
            
          </div>
        </div>

        {/* Column 3: Web App UI Simulation */}
        <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
          {/* Browser Header */}
          <div className="bg-slate-200 px-4 py-2 flex items-center gap-2 border-b border-slate-300 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="mx-auto bg-white rounded px-24 py-1 text-[10px] text-slate-400 shadow-sm">localhost:8501</div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar UI */}
            <div className={`w-32 bg-[#f0f2f6] border-r border-slate-200 p-4 transition-all duration-500 ${step >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'} ${activeWidget === 'sidebar' ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50' : ''}`}>
              <div className="text-xs font-bold text-slate-700 mb-4">Controls</div>
              <div className="w-full h-2 bg-slate-300 rounded mb-2" />
              <div className="w-3/4 h-2 bg-slate-300 rounded" />
            </div>
            
            {/* Main Content UI */}
            <div className="flex-1 p-6 overflow-y-auto bg-white">
              {/* Title */}
              <div className={`transition-all duration-500 mb-8 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${activeWidget === 'title' ? 'text-indigo-600 scale-[1.02] transform origin-left' : 'text-slate-800'}`}>
                <h1 className="text-2xl font-bold">Sales Dashboard</h1>
              </div>
              
              {/* Inputs */}
              <div className={`transition-all duration-500 mb-8 flex gap-2 ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${activeWidget === 'button' ? 'ring-4 ring-indigo-200 rounded p-1 -m-1' : ''}`}>
                <div className="flex-1 border border-slate-300 rounded p-2 text-xs text-slate-400 bg-slate-50">Search...</div>
                <div className="bg-rose-500 text-white rounded px-4 py-2 text-xs font-bold shadow-sm">Submit</div>
              </div>

              {/* Metrics */}
              <div className={`transition-all duration-500 mb-8 flex gap-4 ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${activeWidget === 'metric' ? 'ring-4 ring-indigo-200 rounded p-1 -m-1' : ''}`}>
                <div className="flex-1 border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
                  <div className="text-xs text-slate-500">Revenue</div>
                  <div className="text-lg font-bold text-slate-800">$1.2M</div>
                </div>
                <div className="flex-1 border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
                  <div className="text-xs text-slate-500">Growth</div>
                  <div className="text-lg font-bold text-emerald-500">8% ↑</div>
                </div>
              </div>

              {/* Chart */}
              <div className={`transition-all duration-500 mb-8 ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${activeWidget === 'chart' ? 'ring-4 ring-indigo-200 rounded p-1 -m-1' : ''}`}>
                <div className="h-24 w-full border-b border-l border-slate-300 flex items-end justify-between px-2 pt-4 pb-1">
                  <div className="w-1/6 bg-blue-200 h-1/3 rounded-t" />
                  <div className="w-1/6 bg-blue-300 h-1/2 rounded-t" />
                  <div className="w-1/6 bg-blue-400 h-2/3 rounded-t" />
                  <div className="w-1/6 bg-blue-500 h-[90%] rounded-t" />
                  <div className="w-1/6 bg-blue-600 h-full rounded-t" />
                </div>
              </div>

              {/* Slider */}
              <div className={`transition-all duration-500 ${step >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${activeWidget === 'slider' ? 'ring-4 ring-indigo-200 rounded p-1 -m-1' : ''}`}>
                <div className="text-xs text-slate-700 mb-2">Select range</div>
                <div className="w-full h-1 bg-slate-200 rounded relative">
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-rose-500 rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ArchBlock({ id, active, show, label }: { id: string, active: boolean, show: boolean, label: string }) {
  return (
    <div className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-500 border ${
      !show ? 'opacity-0 scale-90' : 
      active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)] z-20' : 
      'bg-[#181820] border-white/10 text-slate-400 scale-100 z-10'
    }`}>
      {label}
    </div>
  );
}
