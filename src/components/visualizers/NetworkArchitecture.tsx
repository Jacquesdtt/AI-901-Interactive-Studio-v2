import React, { useState } from 'react';
import ProgressiveReveal from '../ui/ProgressiveReveal';
import { Network, Server, ArrowRight, RefreshCcw, AlertOctagon } from 'lucide-react';

const tcpSteps = [
  { state: 'LISTEN', client: 'CLOSED', server: 'LISTEN', desc: 'Server is passively listening for incoming connections.' },
  { state: 'SYN_SENT', client: 'SYN_SENT', server: 'SYN_RCVD', desc: 'Client sends a SYN packet to initiate connection.', packet: 'SYN ➜' },
  { state: 'SYN_RCVD', client: 'ESTABLISHED', server: 'SYN_RCVD', desc: 'Server responds with SYN-ACK.', packet: '⬅ SYN-ACK' },
  { state: 'ESTABLISHED', client: 'ESTABLISHED', server: 'ESTABLISHED', desc: 'Client responds with ACK. Connection is established.', packet: 'ACK ➜' },
];

export default function NetworkArchitecture() {
  const [step, setStep] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextStep = () => {
    if (chaosMode && step === 1) {
      setErrorMsg('Error: Connection Refused (ECONNREFUSED) - Server not listening on port');
      return;
    }
    if (step < tcpSteps.length - 1) setStep(s => s + 1);
  };

  const reset = () => {
    setStep(0);
    setErrorMsg('');
  };

  const currentStep = tcpSteps[step];

  const l1Content = (
    <div className="flex flex-col gap-6">
      <p className="text-slate-400">Software communicates over a network using Sockets. A socket is an endpoint for sending or receiving data.</p>
      <div className="flex items-center justify-between bg-[#181820] p-6 rounded-xl border border-white/5">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 mb-2"><Network className="w-8 h-8 text-blue-400" /></div>
          <span className="font-bold text-white">Client</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative px-8">
          <div className="w-full h-1 bg-slate-700 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111116] px-2 text-xs font-mono text-teal-400">TCP Connection</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50 mb-2"><Server className="w-8 h-8 text-emerald-400" /></div>
          <span className="font-bold text-white">Server</span>
        </div>
      </div>
    </div>
  );

  const l2Content = (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-[#181820] p-4 rounded-lg border border-white/5">
        <div>
          <h4 className="font-bold text-blue-400 mb-1">Client State</h4>
          <span className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-white">{currentStep.client}</span>
        </div>
        <div className="flex flex-col items-center flex-1 mx-4">
          <span className="text-xs text-slate-400 mb-2">{currentStep.desc}</span>
          <div className="w-full h-12 relative flex items-center justify-center">
            {errorMsg ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse"><AlertOctagon className="w-4 h-4" /> {errorMsg}</span>
            ) : currentStep.packet ? (
              <span className="text-teal-400 font-bold font-mono text-lg animate-in fade-in zoom-in slide-in-from-left-8 duration-500">{currentStep.packet}</span>
            ) : (
              <span className="text-slate-600">IDLE</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <h4 className="font-bold text-emerald-400 mb-1">Server State</h4>
          <span className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-white">{currentStep.server}</span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"><RefreshCcw className="w-4 h-4" /> Reset</button>
        <button onClick={nextStep} disabled={step === tcpSteps.length - 1 || !!errorMsg} className="px-6 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0c] font-bold rounded-lg flex items-center gap-2 transition-colors">
          Step Forward <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const l3Content = (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400">At the OS level, sockets map to file descriptors. The kernel manages the TCP state machine.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
          <h4 className="font-bold text-blue-400 text-sm mb-2">Client OS File Descriptors</h4>
          <pre className="text-[10px] text-emerald-400 font-mono">{`fd 3: socket(AF_INET, SOCK_STREAM, 0)\nfd 3: connect(192.168.1.10:8080)\nState: ${currentStep.client}`}</pre>
        </div>
        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
          <h4 className="font-bold text-emerald-400 text-sm mb-2">Server OS File Descriptors</h4>
          <pre className="text-[10px] text-emerald-400 font-mono">{`fd 3: socket(AF_INET, SOCK_STREAM, 0)\nfd 3: bind(0.0.0.0:8080)\nfd 3: listen(5)\nfd 4: accept() -> returns new fd when ESTABLISHED\nState: ${currentStep.server}`}</pre>
        </div>
      </div>
    </div>
  );

  const l4Content = (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400">Implementing a basic socket connection in Python.</p>
      <pre className="text-xs bg-[#0e0e13] p-4 rounded-xl border border-white/10 text-slate-300 font-mono overflow-x-auto">
        <code className="language-python">
{`import socket

# Server Side
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 8080))
s.listen(1)
print("Listening on 8080...")
conn, addr = s.accept()  # Blocks until ESTABLISHED
print(f"Connected by {addr}")

# Client Side (in another script)
c = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
c.connect(('localhost', 8080))
c.sendall(b'Hello World')`}
        </code>
      </pre>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Ports, Sockets &amp; IPC</h2>
          <p className="text-slate-400">Software Communication Stack Visualizer</p>
        </div>
        <div className="flex items-center gap-3 bg-[#181820] px-4 py-2 rounded-lg border border-white/5">
          <span className="text-sm font-bold text-slate-300">Chaos Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={chaosMode} onChange={() => { setChaosMode(!chaosMode); reset(); }} />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>
      </div>
      <ProgressiveReveal title="TCP 3-Way Handshake" l1Content={l1Content} l2Content={l2Content} l3Content={l3Content} l4Content={l4Content} />
    </div>
  );
}
