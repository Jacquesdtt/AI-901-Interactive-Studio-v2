import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

const challengeCommands = {
  help: 'Available commands: help, status, ping <ip>, connect <port>',
  status: 'System: ONLINE\nNetwork: DEGRADED\nFirewall: ACTIVE',
  'ping 192.168.1.1': 'Pinging 192.168.1.1... \nReply from 192.168.1.1: bytes=32 time=14ms TTL=64',
  'connect 8080': 'Error: Connection Refused. Port might be closed by firewall.',
  'connect 443': 'Connection Established! Access granted to Secret Data.',
};

export default function TabSecret() {
  const [logs, setLogs] = useState<string[]>(['> INIT SECURE SHELL v2.4.1', '> Enter command (type "help" for options)']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setInput('');
      if (!cmd) return;
      const newLogs = [...logs, `> ${cmd}`];
      setTimeout(() => {
        const response = (challengeCommands as Record<string, string>)[cmd.toLowerCase()] || `Command not found: ${cmd}`;
        setLogs(prev => [...prev, response]);
      }, 300);
      setLogs(newLogs);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-amber-400">
          <ShieldAlert className="w-8 h-8" /> Classified Content
        </h2>
        <p className="text-slate-400">Network Debugging Mini-Game (Easter Egg)</p>
      </div>
      <div className="flex-1 bg-black rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col font-mono text-sm">
        <div className="absolute top-0 left-0 w-full h-8 bg-[#181820] flex items-center px-4 gap-2 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400 ml-4 flex items-center gap-2"><Terminal className="w-3 h-3" /> secure_shell@admin</span>
        </div>
        <div className="flex-1 mt-8 overflow-y-auto flex flex-col gap-2">
          {logs.map((log, idx) => (
            <div key={idx} className={`${log.startsWith('>') ? 'text-emerald-500 font-bold' : 'text-slate-300'} whitespace-pre-wrap leading-relaxed`}>{log}</div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-500 font-bold">root@host:~#</span>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} className="flex-1 bg-transparent outline-none text-emerald-400 font-bold" autoFocus />
          </div>
          <div ref={bottomRef} />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjAxIiAvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1IiAvPjwvc3ZnPg==')] opacity-50" />
      </div>
    </div>
  );
}
