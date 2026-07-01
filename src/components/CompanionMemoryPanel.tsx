/**
 * CompanionMemoryPanel
 *
 * A slide-in panel showing everything the companions remember about the user:
 *  - Shared topic memory entries (editable, deletable, manually addable)
 *  - Per-companion chat history stats with option to clear
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain, X, Trash2, Plus, Pencil, Check, XCircle,
  MessageSquare, RefreshCcw, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import {
  loadSharedMemory, saveSharedMemory, clearSharedMemory,
  deleteSharedMemoryEntry, updateSharedMemoryEntry, appendSharedMemory,
  loadHistory, clearCompanionHistory, SharedMemoryEntry,
} from '../hooks/useCompanionMemory';

// ─── Companion definitions (same across tabs) ────────────────────────────────

const COMPANIONS = [
  { id: 'lofigirl',    name: 'Lofi Girl',         avatar: '👩‍💻', color: 'text-purple-400' },
  { id: 'loficat',    name: 'Lofi Cat',           avatar: '🐱',   color: 'text-pink-400'   },
  { id: 'azurebot',   name: 'AzureBot',           avatar: '🤖',   color: 'text-cyan-400'   },
  { id: 'drkeras',    name: 'Dr. Keras',          avatar: '👨‍🔬', color: 'text-emerald-400'},
  { id: 'ai901tutor', name: 'AI-901 Tutor',       avatar: '🎓',   color: 'text-blue-400'   },
];

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MemoryEntry({
  entry,
  onDelete,
  onUpdate,
}: {
  entry: SharedMemoryEntry;
  onDelete: () => void;
  onUpdate: (s: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.summary);

  const commit = () => {
    if (draft.trim()) { onUpdate(draft.trim()); }
    setEditing(false);
  };

  return (
    <div className="group flex items-start gap-2 bg-[#0c0c0d] border border-[#242426] hover:border-purple-500/30 rounded-lg px-3 py-2 transition-all">
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
            className="w-full bg-[#1a1a1d] border border-purple-500/40 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
          />
        ) : (
          <p className="text-[11px] text-slate-300 leading-snug truncate">{entry.summary}</p>
        )}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[9px] text-purple-400/70 font-semibold">{entry.companion}</span>
          <span className="text-[9px] text-slate-600">·</span>
          <span className="text-[9px] text-slate-600">{timeAgo(entry.timestamp)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {editing ? (
          <>
            <button onClick={commit} className="text-emerald-400 hover:text-emerald-300 p-0.5 transition-colors">
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white p-0.5 transition-colors">
              <XCircle size={12} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { setDraft(entry.summary); setEditing(true); }} className="text-slate-500 hover:text-purple-400 p-0.5 transition-colors">
              <Pencil size={11} />
            </button>
            <button onClick={onDelete} className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors">
              <Trash2 size={11} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanionMemoryPanel({ isOpen, onClose }: Props) {
  const [memories, setMemories] = useState<SharedMemoryEntry[]>([]);
  const [historyStats, setHistoryStats] = useState<Record<string, number>>({});
  const [newFact, setNewFact] = useState('');
  const [newFactCompanion, setNewFactCompanion] = useState(COMPANIONS[0].name);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [historyPreview, setHistoryPreview] = useState<{ role: string; text: string }[]>([]);

  const reload = useCallback(() => {
    setMemories(loadSharedMemory());
    const stats: Record<string, number> = {};
    for (const c of COMPANIONS) {
      stats[c.id] = loadHistory(c.id).length;
    }
    setHistoryStats(stats);
  }, []);

  useEffect(() => { if (isOpen) reload(); }, [isOpen, reload]);

  const handleDelete = (ts: number) => {
    deleteSharedMemoryEntry(ts);
    reload();
  };

  const handleUpdate = (ts: number, summary: string) => {
    updateSharedMemoryEntry(ts, summary);
    reload();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    appendSharedMemory({
      companion: newFactCompanion,
      summary: newFact.trim(),
      timestamp: Date.now(),
    });
    setNewFact('');
    reload();
  };

  const handleClearAll = () => {
    clearSharedMemory();
    reload();
  };

  const handleClearHistory = (id: string) => {
    clearCompanionHistory(id);
    setExpandedHistory(null);
    reload();
  };

  const handleExpandHistory = (id: string) => {
    if (expandedHistory === id) { setExpandedHistory(null); return; }
    setExpandedHistory(id);
    setHistoryPreview(loadHistory(id).slice(-6));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-[#0a0a0b] border-l border-purple-500/20 flex flex-col shadow-2xl shadow-purple-900/20 animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242426] shrink-0">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Companion Memory</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Shared Memory ── */}
          <section className="p-4 border-b border-[#1a1a1d]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Shared Topics</h3>
                <span className="text-[9px] bg-purple-600/20 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                  {memories.length}
                </span>
              </div>
              {memories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-[9px] text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 size={10} /> Clear all
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Topics your companions have noticed you discussing. They use these to stay in sync across conversations.
            </p>

            {memories.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <AlertCircle className="w-8 h-8 text-slate-700" />
                <p className="text-[11px] text-slate-500">No memories yet.</p>
                <p className="text-[10px] text-slate-600">Chat with any companion to start building memory.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...memories].reverse().map(entry => (
                  <MemoryEntry
                    key={entry.timestamp}
                    entry={entry}
                    onDelete={() => handleDelete(entry.timestamp)}
                    onUpdate={s => handleUpdate(entry.timestamp, s)}
                  />
                ))}
              </div>
            )}

            {/* Add custom memory */}
            <form onSubmit={handleAdd} className="mt-3 space-y-2">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Add a note manually</div>
              <div className="flex gap-1.5">
                <select
                  value={newFactCompanion}
                  onChange={e => setNewFactCompanion(e.target.value)}
                  className="bg-[#1a1a1d] border border-[#242426] rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-purple-500 shrink-0"
                >
                  {COMPANIONS.map(c => (
                    <option key={c.id} value={c.name}>{c.avatar} {c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newFact}
                  onChange={e => setNewFact(e.target.value)}
                  placeholder="e.g. User is weak on MLOps..."
                  className="flex-1 bg-[#1a1a1d] border border-[#242426] rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!newFact.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-2.5 rounded-lg transition-colors shrink-0"
                >
                  <Plus size={13} />
                </button>
              </div>
            </form>
          </section>

          {/* ── Per-Companion Chat History ── */}
          <section className="p-4">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Chat Histories
            </h3>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Each companion remembers your past conversations. You can preview or clear individual histories here.
            </p>

            <div className="space-y-2">
              {COMPANIONS.map(c => {
                const count = historyStats[c.id] ?? 0;
                const isExpanded = expandedHistory === c.id;

                return (
                  <div key={c.id} className="bg-[#0c0c0d] border border-[#242426] rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2">
                      <button
                        onClick={() => handleExpandHistory(c.id)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <span className="text-base">{c.avatar}</span>
                        <div>
                          <div className={`text-[11px] font-semibold ${c.color}`}>{c.name}</div>
                          <div className="text-[9px] text-slate-600">
                            {count > 0 ? `${count} messages stored` : 'No history yet'}
                          </div>
                        </div>
                        <span className="ml-auto text-slate-600">
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                      </button>
                      {count > 0 && (
                        <button
                          onClick={() => handleClearHistory(c.id)}
                          title="Clear history"
                          className="ml-2 text-slate-600 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>

                    {/* Collapsed message preview */}
                    {isExpanded && (
                      <div className="border-t border-[#1a1a1d] px-3 py-2 space-y-1.5 max-h-48 overflow-y-auto">
                        {historyPreview.length === 0 ? (
                          <p className="text-[10px] text-slate-600 italic">No messages yet.</p>
                        ) : (
                          <>
                            <p className="text-[9px] text-slate-600 mb-1">Showing last {historyPreview.length} messages:</p>
                            {historyPreview.map((msg, i) => (
                              <div key={i} className={`text-[10px] px-2 py-1.5 rounded-lg leading-relaxed ${
                                msg.role === 'user'
                                  ? 'bg-purple-600/10 border border-purple-500/20 text-purple-200 text-right'
                                  : 'bg-[#131315] border border-[#242426] text-slate-300'
                              }`}>
                                <span className="font-semibold text-[8px] uppercase tracking-wide opacity-60">
                                  {msg.role === 'user' ? 'You' : c.name}:
                                </span>
                                <p className="mt-0.5 line-clamp-3">{msg.text}</p>
                              </div>
                            ))}
                            <button
                              onClick={() => handleClearHistory(c.id)}
                              className="w-full mt-1 py-1 rounded-lg text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-500/10 hover:border-rose-500/30 transition-all flex items-center justify-center gap-1"
                            >
                              <Trash2 size={10} /> Clear {c.name}'s history
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1a1a1d] shrink-0">
          <button
            onClick={() => { clearSharedMemory(); COMPANIONS.forEach(c => clearCompanionHistory(c.id)); reload(); }}
            className="w-full py-2 rounded-lg text-[11px] font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCcw size={12} /> Reset all companion memory
          </button>
        </div>
      </div>
    </>
  );
}
