import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Zap, DollarSign, ShieldCheck, ArrowRightLeft } from 'lucide-react';

const comparison = [
  {
    category: 'Architecture',
    pgvector: 'Relational DB Extension',
    specialized: 'Purpose-built Vector Engine'
  },
  {
    category: 'Latency',
    pgvector: 'Low (if indexed properly), but shares CPU with transactional workloads',
    specialized: 'Ultra-low (optimized purely for vector ops in-memory)'
  },
  {
    category: 'Cost',
    pgvector: 'Free/Included (just pay for standard Postgres hosting)',
    specialized: 'Expensive (high compute/memory requirements, often SaaS pricing)'
  },
  {
    category: 'Developer Experience',
    pgvector: 'Excellent. Standard SQL. No new infrastructure to learn.',
    specialized: 'Requires learning new SDKs and managing a separate system.'
  },
  {
    category: 'Data Consistency',
    pgvector: 'Full ACID Compliance. Metadata and vectors update in exactly 1 transaction.',
    specialized: 'Eventual Consistency. Syncing Postgres metadata with Pinecone can lead to race conditions.'
  }
];

export default function Module8_DbBattle() {
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto h-full flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vector DB Battle</h1>
        <p className="text-slate-400">pgvector vs. Dedicated Vector Databases (Pinecone, Milvus, Qdrant).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-cyan-900/20 border border-cyan-800/50 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-cyan-500/20 text-cyan-400 rounded-xl"><Database className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold text-white">PostgreSQL + pgvector</h2>
            <p className="text-cyan-400/80 text-sm">The Pragmatic Choice</p>
          </div>
        </div>
        <div className="bg-rose-900/20 border border-rose-800/50 p-6 rounded-2xl flex items-center gap-4 flex-row-reverse text-right">
          <div className="p-4 bg-rose-500/20 text-rose-400 rounded-xl"><Zap className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold text-white">Dedicated Vector DBs</h2>
            <p className="text-rose-400/80 text-sm">The High-Scale Choice</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <th className="p-4 pl-6 w-1/4">Category</th>
              <th className="p-4 w-3/8 text-cyan-400 border-l border-slate-800">pgvector</th>
              <th className="p-4 w-3/8 text-rose-400 border-l border-slate-800">Specialized DBs</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, i) => (
              <tr 
                key={i} 
                onMouseEnter={() => setHoverRow(i)}
                onMouseLeave={() => setHoverRow(null)}
                className={`border-b border-slate-800/50 transition-colors ${hoverRow === i ? 'bg-slate-800/50' : ''}`}
              >
                <td className="p-4 pl-6 text-slate-300 font-medium">{row.category}</td>
                <td className="p-4 border-l border-slate-800/50 text-slate-400 text-sm leading-relaxed">{row.pgvector}</td>
                <td className="p-4 border-l border-slate-800/50 text-slate-400 text-sm leading-relaxed">{row.specialized}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex gap-4 items-start">
        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <h3 className="font-bold text-white text-lg mb-2">The Verdict</h3>
          <p className="text-slate-400 leading-relaxed">
            If you already use PostgreSQL, <strong>start with pgvector</strong>. It prevents the operational nightmare of syncing relational data (like User IDs or permissions) with a separate vector database. Only migrate to a dedicated vector database if you hit scale limits (typically &gt; 100M+ vectors) and require ultra-low latency distributed search.
          </p>
        </div>
      </div>

    </div>
  );
}
