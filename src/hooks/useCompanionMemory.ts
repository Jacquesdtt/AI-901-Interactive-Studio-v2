/**
 * useCompanionMemory
 *
 * Shared localStorage memory layer for all study companions.
 * Provides:
 *  - Per-companion chat history persistence (last 40 messages)
 *  - A shared "memory log" of key topics/facts the user has mentioned
 *    across ALL companions (so Lofi Girl knows what Dr. Keras discussed, etc.)
 *  - Helper to build a cross-companion context string for system prompts
 */

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

export interface SharedMemoryEntry {
  companion: string;   // which companion recorded this
  summary: string;     // short fact/topic
  timestamp: number;
}

const HISTORY_KEY = (id: string) => `companion_history_${id}`;
const SHARED_KEY = 'companion_shared_memory';
const MAX_HISTORY = 40;   // messages per companion
const MAX_SHARED = 20;    // global memory entries

// ─── Load / Save ─────────────────────────────────────────────────────────────

export function loadHistory(companionId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY(companionId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(companionId: string, messages: ChatMessage[]): void {
  const trimmed = messages.slice(-MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY(companionId), JSON.stringify(trimmed));
}

export function loadSharedMemory(): SharedMemoryEntry[] {
  try {
    const raw = localStorage.getItem(SHARED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendSharedMemory(entry: SharedMemoryEntry): void {
  const existing = loadSharedMemory();
  const updated = [...existing, entry].slice(-MAX_SHARED);
  localStorage.setItem(SHARED_KEY, JSON.stringify(updated));
}

export function clearSharedMemory(): void {
  localStorage.removeItem(SHARED_KEY);
}

export function saveSharedMemory(entries: SharedMemoryEntry[]): void {
  localStorage.setItem(SHARED_KEY, JSON.stringify(entries.slice(-MAX_SHARED)));
}

export function deleteSharedMemoryEntry(timestamp: number): void {
  const existing = loadSharedMemory();
  saveSharedMemory(existing.filter(e => e.timestamp !== timestamp));
}

export function updateSharedMemoryEntry(timestamp: number, newSummary: string): void {
  const existing = loadSharedMemory();
  saveSharedMemory(existing.map(e => e.timestamp === timestamp ? { ...e, summary: newSummary } : e));
}

export function clearCompanionHistory(companionId: string): void {
  localStorage.removeItem(HISTORY_KEY(companionId));
}

// ─── Extract memorable facts from a message ──────────────────────────────────

/**
 * Very lightweight heuristic: if the user mentions a topic keyword,
 * we record a short fact into shared memory.
 */
const TOPIC_KEYWORDS: Record<string, string> = {
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'neural network': 'Neural Networks',
  'transformer': 'Transformers',
  'mlops': 'MLOps',
  'rag': 'RAG pipelines',
  'responsible ai': 'Responsible AI',
  'azure': 'Azure AI Services',
  'flashcard': 'Flashcards / SRS review',
  'exam': 'Exam prep',
  'pomodoro': 'Pomodoro / focus sessions',
  'schedule': 'Study schedule planning',
  'generative ai': 'Generative AI',
  'genai': 'Generative AI',
  'foundation model': 'Foundation Models',
  'prompt engineer': 'Prompt Engineering',
  'tensor': 'Tensors / PyTorch',
  'backprop': 'Backpropagation',
  'gradient': 'Gradient descent',
  'overfitting': 'Overfitting / regularisation',
  'confusion matrix': 'Evaluation metrics',
};

export function extractAndStoreMemory(
  userMessage: string,
  companionId: string,
  companionName: string,
): void {
  const lower = userMessage.toLowerCase();
  for (const [keyword, topic] of Object.entries(TOPIC_KEYWORDS)) {
    if (lower.includes(keyword)) {
      appendSharedMemory({
        companion: companionName,
        summary: `User asked about "${topic}"`,
        timestamp: Date.now(),
      });
      break; // one entry per message is enough
    }
  }
}

// ─── Build system-prompt context block ───────────────────────────────────────

/**
 * Returns a short paragraph to inject into any companion's system prompt,
 * so they know what the user has discussed with the other companions.
 */
export function buildCrossCompanionContext(currentCompanionId: string): string {
  const memory = loadSharedMemory();
  if (memory.length === 0) return '';

  // Only show entries from OTHER companions
  const others = memory.filter(m =>
    !m.summary.toLowerCase().includes(currentCompanionId)
  );
  if (others.length === 0) return '';

  const lines = others
    .slice(-8) // last 8 relevant shared facts
    .map(m => `- ${m.companion} noted: "${m.summary}"`)
    .join('\n');

  return `\n\n[Shared Companion Memory]\nYour study companions have discussed the following with the user recently:\n${lines}\nYou can naturally reference these topics or other companions by name to feel like a connected team. Don't force it — only mention them when genuinely relevant.\n`;
}

/**
 * Build the "recent history" snippet to give the AI context of past exchanges.
 * Returns the last N messages formatted as a conversation string.
 */
export function buildHistoryContext(messages: ChatMessage[], n = 6): string {
  const recent = messages.slice(-n);
  if (recent.length === 0) return '';
  return '\n\n[Recent Conversation History]\n' +
    recent.map(m => `${m.role === 'user' ? 'User' : 'Companion'}: ${m.text}`).join('\n') +
    '\n';
}
