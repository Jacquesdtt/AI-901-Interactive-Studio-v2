import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
  Panel,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export type CustomNodeData = {
  id?: string;
  label: string;
  value: number;
  grad: number;
  op?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CustomNode = Node<CustomNodeData>;

// =======================
// CUSTOM NODE COMPONENTS
// =======================

const ValueNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className="px-4 py-3 shadow-2xl shadow-teal-900/10 rounded-xl bg-gray-900/90 backdrop-blur-md border border-gray-700 min-w-[180px] hover:border-teal-500/50 transition-colors">
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-teal-400 border-2 border-gray-900" />
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold border border-teal-500/30">
          {data.id}
        </div>
        <div className="text-gray-200 text-sm font-semibold tracking-wide">{data.label}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col">
          <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Forward Value</label>
          <input
            type="number"
            value={data.value}
            onChange={data.onChange}
            className="w-full bg-gray-950/80 text-teal-300 font-mono text-sm rounded-md py-1.5 px-2 border border-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none nodrag transition-all"
            step="0.1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex justify-between">
            <span>Backward Grad</span>
            <span className="text-orange-400/70">∂L / ∂{data.id}</span>
          </label>
          <div className="w-full bg-gray-950/80 text-orange-400 font-mono text-sm rounded-md py-1.5 px-2 border border-gray-800">
            {data.grad?.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};

const OpNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className="px-5 py-4 shadow-2xl shadow-indigo-900/10 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-gray-700 min-w-[160px] text-center flex flex-col items-center justify-center relative hover:border-indigo-500/50 transition-colors group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-400 border-2 border-gray-900" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-400 border-2 border-gray-900" />
      
      <div className="absolute -top-3 bg-gray-800 border border-gray-700 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest text-indigo-300 uppercase shadow-lg">
        {data.label}
      </div>

      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 mb-3 group-hover:scale-110 transition-transform">
        <span className="text-2xl text-indigo-300 font-light">{data.op}</span>
      </div>
      
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs bg-gray-950/80 px-2 py-1.5 rounded border border-gray-800">
          <span className="text-gray-400 font-medium">Forward</span>
          <span className="text-teal-300 font-mono font-semibold">{data.value?.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center text-xs bg-gray-950/80 px-2 py-1.5 rounded border border-gray-800">
          <span className="text-gray-400 font-medium">∂L / ∂{data.id}</span>
          <span className="text-orange-400 font-mono font-semibold">{data.grad?.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};

const OutputNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className="px-5 py-4 shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-2xl bg-gray-900/90 backdrop-blur-md border border-red-900/50 min-w-[180px] hover:border-red-500/50 transition-colors">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-400 border-2 border-gray-900" />
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold border border-red-500/30">
          L
        </div>
        <div className="text-gray-200 text-sm font-semibold tracking-wide">Final Output</div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col">
          <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Loss Value</label>
          <div className="w-full bg-gray-950/80 text-white font-mono text-sm rounded-md py-1.5 px-2 border border-gray-700 shadow-inner">
            {data.value?.toFixed(3)}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Base Gradient</label>
          <div className="w-full bg-gray-950/80 text-orange-400 font-mono text-sm rounded-md py-1.5 px-2 border border-gray-800 flex justify-between items-center">
            <span>∂L / ∂L</span>
            <span>1.000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  valueNode: ValueNode,
  opNode: OpNode,
  outputNode: OutputNode,
};

// =======================
// MAIN COMPONENT
// =======================

export default function TabBackpropSandbox() {
  const [x, setX] = useState(2.0);
  const [w, setW] = useState(3.0);
  const [b, setB] = useState(1.0);

  const handleXChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setX(Number(e.target.value)), []);
  const handleWChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setW(Number(e.target.value)), []);
  const handleBChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setB(Number(e.target.value)), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([
    { id: 'x', type: 'valueNode', position: { x: 50, y: 50 }, data: { id: 'x', label: 'Input', value: x, grad: 0, onChange: handleXChange } },
    { id: 'w', type: 'valueNode', position: { x: 50, y: 280 }, data: { id: 'w', label: 'Weight', value: w, grad: 0, onChange: handleWChange } },
    { id: 'mul', type: 'opNode', position: { x: 380, y: 165 }, data: { id: 'm', label: 'Multiply', op: '×', value: 0, grad: 0 } },
    { id: 'b', type: 'valueNode', position: { x: 380, y: 400 }, data: { id: 'b', label: 'Bias', value: b, grad: 0, onChange: handleBChange } },
    { id: 'add', type: 'opNode', position: { x: 700, y: 280 }, data: { id: 'y', label: 'Add', op: '+', value: 0, grad: 0 } },
    { id: 'y', type: 'outputNode', position: { x: 1020, y: 280 }, data: { id: 'L', label: 'Loss Function', value: 0, grad: 0 } }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Math logic for forward pass
    const m = w * x;
    const y = m + b;

    // Math logic for backward pass (assuming L = y)
    const dy = 1.0;
    const db = 1.0 * dy;
    const dm = 1.0 * dy;
    const dw = x * dm;
    const dx = w * dm;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'x') {
          return { ...node, data: { ...node.data, value: x, grad: dx, onChange: handleXChange } };
        }
        if (node.id === 'w') {
          return { ...node, data: { ...node.data, value: w, grad: dw, onChange: handleWChange } };
        }
        if (node.id === 'mul') {
          return { ...node, data: { ...node.data, value: m, grad: dm } };
        }
        if (node.id === 'b') {
          return { ...node, data: { ...node.data, value: b, grad: db, onChange: handleBChange } };
        }
        if (node.id === 'add') {
          return { ...node, data: { ...node.data, value: y, grad: dy } };
        }
        if (node.id === 'y') {
          return { ...node, data: { ...node.data, value: y, grad: dy } };
        }
        return node;
      })
    );

    const getLabelStyle = (color: string) => ({ fill: color, fontWeight: 600, fontSize: 12 });
    const getLabelBgStyle = () => ({ fill: '#111827', stroke: '#1f2937', strokeWidth: 1 });

    setEdges([
      {
        id: 'e-x-mul', source: 'x', target: 'mul', animated: true, type: 'smoothstep',
        label: `x = ${x.toFixed(1)}`,
        style: { stroke: '#2dd4bf', strokeWidth: 2, opacity: 0.7 },
        labelStyle: getLabelStyle('#2dd4bf'),
        labelBgStyle: getLabelBgStyle(),
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
      },
      {
        id: 'e-w-mul', source: 'w', target: 'mul', animated: true, type: 'smoothstep',
        label: `w = ${w.toFixed(1)}`,
        style: { stroke: '#2dd4bf', strokeWidth: 2, opacity: 0.7 },
        labelStyle: getLabelStyle('#2dd4bf'),
        labelBgStyle: getLabelBgStyle(),
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
      },
      {
        id: 'e-mul-add', source: 'mul', target: 'add', animated: true, type: 'smoothstep',
        label: `m = ${m.toFixed(1)}`,
        style: { stroke: '#818cf8', strokeWidth: 2, opacity: 0.7 },
        labelStyle: getLabelStyle('#818cf8'),
        labelBgStyle: getLabelBgStyle(),
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
      },
      {
        id: 'e-b-add', source: 'b', target: 'add', animated: true, type: 'smoothstep',
        label: `b = ${b.toFixed(1)}`,
        style: { stroke: '#2dd4bf', strokeWidth: 2, opacity: 0.7 },
        labelStyle: getLabelStyle('#2dd4bf'),
        labelBgStyle: getLabelBgStyle(),
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
      },
      {
        id: 'e-add-y', source: 'add', target: 'y', animated: true, type: 'smoothstep',
        label: `y = ${y.toFixed(1)}`,
        style: { stroke: '#f87171', strokeWidth: 2, opacity: 0.7 },
        labelStyle: getLabelStyle('#f87171'),
        labelBgStyle: getLabelBgStyle(),
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
      },
    ]);

  }, [x, w, b, setNodes, setEdges, handleXChange, handleWChange, handleBChange]);

  return (
    <div className="w-full h-full min-h-[700px] bg-[#030712] flex flex-col font-sans">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#030712]"
          colorMode="dark"
        >
          <Background color="#1f2937" gap={16} variant={BackgroundVariant.Dots} />
          <Controls className="bg-gray-800 border-gray-700 fill-gray-300" />
          <Panel position="top-left" className="bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-xl max-w-sm m-4">
            <h2 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Computational Graph
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Observe the forward pass computing the values and the backward pass computing the gradients dynamically. 
              The target function is <code className="text-teal-300 bg-gray-800 px-1 py-0.5 rounded font-mono">y = w * x + b</code>.
              Try tweaking the <span className="text-teal-300 font-semibold">Inputs</span> on the left!
            </p>
          </Panel>
          <Panel position="bottom-right" className="bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-gray-800 shadow-xl m-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
               <span className="text-gray-300">Forward Flow (Values)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"></div>
               <span className="text-gray-300">Backward Flow (Gradients)</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
