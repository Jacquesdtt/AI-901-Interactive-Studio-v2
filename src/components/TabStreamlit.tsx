import React from 'react';
import StreamlitInfographic from './visualizers/StreamlitInfographic';
import StreamlitSandbox from './StreamlitSandbox';

export default function TabStreamlit() {
  return (
    <div className="flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-[#000000]">
      <div className="flex-none h-[800px] border-b border-indigo-500/20">
        <StreamlitInfographic />
      </div>
      <div className="flex-none shrink-0">
        <StreamlitSandbox />
      </div>
    </div>
  );
}
