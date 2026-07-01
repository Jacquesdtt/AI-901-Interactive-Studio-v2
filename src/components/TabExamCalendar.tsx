import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays, Plus, Trash2, AlertCircle, Target, ChevronLeft, ChevronRight,
  Send, BookOpen, Wand2, CheckCircle2, Brain
} from 'lucide-react';
import { useAi } from '../context/AiContext';
import CompanionMemoryPanel from './CompanionMemoryPanel';


// ─── Types ───────────────────────────────────────────────────────────────────

interface TopicBlock {
  id: string;
  topic: string;
  color: string;
  duration: string;
}

interface DayPlan {
  date: string;
  blocks: TopicBlock[];
  isRestDay: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOPICS = [
  { name: 'Foundations & Responsible AI', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
  { name: 'Machine Learning', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
  { name: 'Deep Learning', color: 'bg-violet-500/20 border-violet-500/40 text-violet-300' },
  { name: 'Generative AI & Agents', color: 'bg-pink-500/20 border-pink-500/40 text-pink-300' },
  { name: 'Azure AI Services', color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' },
  { name: 'DevOps & Containers', color: 'bg-orange-500/20 border-orange-500/40 text-orange-300' },
  { name: 'MLOps in Production', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
  { name: 'Tensor Sandbox', color: 'bg-teal-500/20 border-teal-500/40 text-teal-300' },
  { name: 'Mock Exam', color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
  { name: 'SRS Flashcards', color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' },
];

const DURATIONS = ['30 min', '1 hr', '1.5 hr', '2 hr'];

const COMPANIONS = [
  {
    id: 'lofigirl',
    name: 'Lofi Girl',
    avatar: '👩‍💻',
    greeting: "Hey! Set your exam date and I'll help you build a cosy study schedule. Ask me to 'plan my schedule'! ☕",
    sysPrompt: 'You are Lofi Girl, a warm, calm study companion. Tone: relaxed, cozy, supportive. Use cozy emojis. Keep responses structured but encouraging.',
  },
  {
    id: 'azurebot',
    name: 'AzureBot',
    avatar: '🤖',
    greeting: "BEEP BOOP — GREETINGS HUMAN CANDIDATE. Input your exam date for schedule generation. Efficiency rating: MAXIMUM. ⚙️",
    sysPrompt: 'You are AzureBot, a hilariously robotic AI study assistant. Speak in mechanical terms, use BEEP BOOP, refer to user as "human candidate". Generate precise but humorous schedules.',
  },
  {
    id: 'drkeras',
    name: 'Dr. Keras',
    avatar: '👨‍🔬',
    greeting: "Ah, a new student! Magnificent! I've been waiting. Set your exam date and I shall devise the OPTIMAL training regimen! 🧪🔬",
    sysPrompt: 'You are Dr. Keras, an eccentric but brilliant AI scientist. Speak with high enthusiasm and scientific jargon. Create exciting, well-structured exam prep schedules.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const r = new Date(date);
  r.setDate(r.getDate() + days);
  return r;
}

function toISO(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000);
}

function buildWeek(anchor: Date): string[] {
  const mon = new Date(anchor);
  mon.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => toISO(addDays(mon, i)));
}

// ─── Schedule Parser ──────────────────────────────────────────────────────────

// Maps keyword fragments to TOPICS names
const TOPIC_MAP: { keywords: string[]; name: string }[] = [
  { keywords: ['foundation', 'responsible', 'ethics', 'fairness'], name: 'Foundations & Responsible AI' },
  { keywords: ['machine learning', ' ml ', 'supervised', 'unsupervised', 'classification', 'regression'], name: 'Machine Learning' },
  { keywords: ['deep learning', 'neural', 'cnn', 'rnn', 'lstm'], name: 'Deep Learning' },
  { keywords: ['generative', 'genai', 'gen ai', 'llm', 'agent', 'prompt'], name: 'Generative AI & Agents' },
  { keywords: ['azure ai', 'azure service', 'cognitive', 'vision', 'speech', 'language service'], name: 'Azure AI Services' },
  { keywords: ['devops', 'docker', 'container', 'kubernetes', 'ci/cd'], name: 'DevOps & Containers' },
  { keywords: ['mlops', 'deploy', 'monitor', 'pipeline', 'drift', 'production'], name: 'MLOps in Production' },
  { keywords: ['tensor', 'pytorch', 'numpy', 'stride', 'sandbox'], name: 'Tensor Sandbox' },
  { keywords: ['mock exam', 'practice exam', 'revision', 'review', 'test', 'assessment'], name: 'Mock Exam' },
  { keywords: ['flashcard', 'srs', 'spaced repetition', 'recall'], name: 'SRS Flashcards' },
];

function matchTopic(text: string): { name: string; color: string } | null {
  const lower = text.toLowerCase();
  for (const { keywords, name } of TOPIC_MAP) {
    if (keywords.some(k => lower.includes(k))) {
      const topic = TOPICS.find(t => t.name === name);
      return topic || null;
    }
  }
  return null;
}

/**
 * Parses AI-generated schedule text into a Record<ISO-date, DayPlan>.
 * Handles patterns like:
 *   - "Day 1: Foundations & Responsible AI"
 *   - "Days 1-2: Machine Learning"
 *   - "• Day 3-4: Deep Learning (1 hr)"
 *   - "- Day 5: Generative AI"
 * Maps day numbers to calendar dates starting from today (or tomorrow).
 */
function parseScheduleFromText(
  text: string,
  startDate: Date = new Date()
): Record<string, DayPlan> {
  const result: Record<string, DayPlan> = {};

  // Normalise: strip markdown bold/italic
  const clean = text.replace(/[*_`]/g, '');
  const lines = clean.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Match: Day N: ... or Days N-M: ...
    const dayMatch = line.match(/days?\s+(\d+)(?:[\s\-–—to]+(\d+))?[:\s]/i);
    if (!dayMatch) continue;

    const startDay = parseInt(dayMatch[1], 10);
    const endDay = dayMatch[2] ? parseInt(dayMatch[2], 10) : startDay;

    // Extract the topic text (everything after the colon)
    const colonIdx = line.indexOf(':');
    const topicText = colonIdx !== -1 ? line.slice(colonIdx + 1).trim() : line;

    const topic = matchTopic(topicText);
    if (!topic) continue;

    // Extract duration hint if present
    const durMatch = topicText.match(/(\d+(?:\.\d+)?\s*(?:hr|hour|min|minute)s?)/i);
    const duration = durMatch ? durMatch[1] : '1 hr';

    // Map each day number to a calendar date (Day 1 = startDate, Day 2 = startDate+1, etc.)
    for (let d = startDay; d <= Math.min(endDay, startDay + 6); d++) {
      const date = toISO(addDays(startDate, d - 1));
      const block: TopicBlock = {
        id: `ai-${Date.now()}-${d}-${Math.random().toString(36).slice(2, 6)}`,
        topic: topic.name,
        color: topic.color,
        duration,
      };
      const existing = result[date] || { date, blocks: [], isRestDay: false };
      // Don't add duplicate topic blocks for the same date
      if (!existing.blocks.some(b => b.topic === topic.name)) {
        result[date] = { ...existing, blocks: [...existing.blocks, block] };
      }
    }
  }

  return result;
}

/** Returns true if the message looks like a schedule planning request. */
function isScheduleRequest(msg: string): boolean {
  const lower = msg.toLowerCase();
  return [
    'plan my schedule', 'plan a schedule', 'create a schedule',
    'build a schedule', 'make a study plan', 'plan my study',
    'schedule me', 'plan for me', 'generate a plan',
    'make a plan', 'study plan', 'set up my week',
  ].some(phrase => lower.includes(phrase));
}


// ─── Component ───────────────────────────────────────────────────────────────

export default function TabExamCalendar() {
  const { aiClient } = useAi() as any;

  const [examDate, setExamDate] = useState<string>(() => localStorage.getItem('exam_cal_date') || '');
  const [editingDate, setEditingDate] = useState(!localStorage.getItem('exam_cal_date'));
  const [weekAnchor, setWeekAnchor] = useState(new Date());
  const weekDates = buildWeek(weekAnchor);

  const [plans, setPlans] = useState<Record<string, DayPlan>>(() => {
    try { return JSON.parse(localStorage.getItem('exam_cal_plans') || '{}'); }
    catch { return {}; }
  });

  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState(TOPICS[0].name);
  const [newDur, setNewDur] = useState(DURATIONS[1]);

  const [companionIdx, setCompanionIdx] = useState(0);
  const companion = COMPANIONS[companionIdx];

  const [chat, setChat] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: companion.greeting }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [populatedDays, setPopulatedDays] = useState(0); // toast counter
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);


  useEffect(() => { localStorage.setItem('exam_cal_plans', JSON.stringify(plans)); }, [plans]);
  useEffect(() => { if (examDate) localStorage.setItem('exam_cal_date', examDate); }, [examDate]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat, typing]);
  useEffect(() => { setChat([{ role: 'model', text: companion.greeting }]); }, [companionIdx]);

  const addBlock = (date: string) => {
    const topic = TOPICS.find(t => t.name === newTopic)!;
    const block: TopicBlock = { id: Date.now().toString(), topic: topic.name, color: topic.color, duration: newDur };
    setPlans(p => {
      const ex = p[date] || { date, blocks: [], isRestDay: false };
      return { ...p, [date]: { ...ex, blocks: [...ex.blocks, block] } };
    });
    setAddingTo(null);
  };

  const removeBlock = (date: string, id: string) => {
    setPlans(p => {
      const ex = p[date];
      if (!ex) return p;
      return { ...p, [date]: { ...ex, blocks: ex.blocks.filter(b => b.id !== id) } };
    });
  };

  const toggleRest = (date: string) => {
    setPlans(p => {
      const ex = p[date] || { date, blocks: [], isRestDay: false };
      return { ...p, [date]: { ...ex, isRestDay: !ex.isRestDay } };
    });
  };

  const clearDay = (date: string) => {
    setPlans(p => {
      const { [date]: _removed, ...rest } = p;
      return rest;
    });
  };

  const clearAllPlans = () => {
    setPlans({});
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg) return;
    setChatInput('');
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    const scheduleIntent = isScheduleRequest(msg);
    const dLeft = examDate ? daysUntil(examDate) : null;
    const ctx = examDate ? `Exam is on ${examDate} (${dLeft} days away).` : 'No exam date set yet.';

    // When a schedule is requested, ask the AI to use a structured format so we can parse it
    const structureHint = scheduleIntent
      ? `\n\nIMPORTANT: Format your schedule as a day-by-day list using exactly this pattern on each line:\n"Day N: [Topic Name]" or "Days N-M: [Topic Name]"\nFor example:\nDay 1: Foundations & Responsible AI\nDays 2-3: Machine Learning\nDay 4: Deep Learning\nDay 5: Generative AI & Agents\nDay 6: Azure AI Services\nDay 7: DevOps & Containers\nDay 8: MLOps in Production\nDay 9: SRS Flashcards\nDays 10-11: Mock Exam\nAdd encouraging commentary around the list, but keep the day lines in this exact format.`
      : '';

    const prompt = `${ctx}\nUser: ${msg}${structureHint}`;

    /** Populates the calendar from parsed text and jumps to the first populated week */
    const applySchedule = (responseText: string) => {
      const parsed = parseScheduleFromText(responseText, new Date());
      const count = Object.keys(parsed).length;
      if (count > 0) {
        setPlans(prev => ({ ...prev, ...parsed }));
        setPopulatedDays(count);
        // Navigate to first populated week
        const firstDate = Object.keys(parsed).sort()[0];
        if (firstDate) {
          const [y, m, d] = firstDate.split('-').map(Number);
          setWeekAnchor(new Date(y, m - 1, d));
        }
        setTimeout(() => setPopulatedDays(0), 4000);
      }
    };

    if (!aiClient) {
      const fallback = examDate
        ? `${companion.avatar} With ${dLeft} days left, here's your plan:\nDay 1: Foundations & Responsible AI\nDays 2-3: Machine Learning\nDay 4: Deep Learning\nDays 5-6: Generative AI & Agents\nDay 7: Azure AI Services\nDay 8: DevOps & Containers\nDay 9: MLOps in Production\nDay 10: SRS Flashcards\nDays 11-12: Mock Exam\n\n(Add your Gemini API key for a fully personalised plan!) ☕`
        : `${companion.avatar} Please set your exam date first so I can tailor the schedule! ☕`;
      setTimeout(() => {
        setChat(p => [...p, { role: 'model', text: fallback }]);
        if (scheduleIntent && examDate) applySchedule(fallback);
        setTyping(false);
      }, 800);
      return;
    }
    try {
      const r = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { systemInstruction: companion.sysPrompt },
      });
      const responseText = r.text || 'No response.';
      setChat(p => [...p, { role: 'model', text: responseText }]);
      if (scheduleIntent) applySchedule(responseText);
    } catch (err: any) {
      setChat(p => [...p, { role: 'model', text: `Error: ${err.message}` }]);
    } finally { setTyping(false); }
  };


  const todayISO = toISO(new Date());
  const dLeft = examDate ? daysUntil(examDate) : null;
  const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full h-full overflow-y-auto text-slate-200 p-4 bg-[#000000] flex flex-col gap-5">

      {/* Header */}
      <header className="border-b border-purple-500/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-wider text-white flex items-center gap-2">
            <CalendarDays className="text-purple-400 w-5 h-5" />
            Exam Countdown Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Set your exam date, assign topics, or let your companion plan it.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#131315] border border-[#242426] p-1 rounded-xl gap-1">
            {COMPANIONS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setCompanionIdx(i)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  companionIdx === i ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{c.avatar}</span><span>{c.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setMemoryPanelOpen(true)}
            title="View companion memory"
            className="p-2 rounded-xl bg-[#131315] border border-[#242426] text-slate-400 hover:text-purple-400 hover:border-purple-500/40 transition-all"
          >
            <Brain className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-4">

          {/* Exam Date Card */}
          <div className="bg-[#131315]/90 backdrop-blur border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 border-b border-[#242426] pb-2 mb-3">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Exam Date</h3>
            </div>
            {editingDate ? (
              <div className="space-y-3">
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  min={toISO(new Date())}
                  className="w-full bg-[#1e1e22] border border-[#2b2b2d] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-600"
                />
                <button
                  onClick={() => examDate && setEditingDate(false)}
                  disabled={!examDate}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white py-2 rounded-lg text-xs font-bold transition-all"
                >
                  Confirm Date
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-3">
                  <div className="text-5xl font-black text-white tabular-nums">
                    {dLeft !== null && dLeft >= 0 ? dLeft : '—'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">days until exam</div>
                  <div className="text-sm text-purple-300 font-semibold mt-1">
                    {examDate ? formatDisplay(examDate) : '—'}
                  </div>
                </div>
                <div className="w-full bg-[#242426] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${dLeft !== null && dLeft <= 7 ? 'bg-rose-500' : dLeft !== null && dLeft <= 14 ? 'bg-amber-500' : 'bg-purple-500'}`}
                    style={{ width: dLeft !== null ? `${Math.max(4, Math.min(100, (1 - dLeft / 60) * 100))}%` : '0%' }}
                  />
                </div>
                {dLeft !== null && dLeft <= 7 && (
                  <div className="flex items-center gap-1 text-rose-400 text-[10px] font-semibold">
                    <AlertCircle size={10} /> Final stretch — focus on Mock Exams!
                  </div>
                )}
                <button onClick={() => setEditingDate(true)} className="w-full bg-[#242426] hover:bg-slate-800 border border-[#2b2b2d] py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-all">
                  Change Date
                </button>
              </div>
            )}
          </div>

          {/* AI Chat */}
          <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-4 flex flex-col" style={{ minHeight: 320 }}>
            <div className="flex items-center justify-between border-b border-[#242426] pb-2 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{companion.avatar}</span>
                <div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest">{companion.name}</div>
                  <div className="text-[8px] text-slate-500 font-mono">Study Planner</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-xs py-1 pr-1">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[92%] rounded-xl px-2.5 py-2 leading-relaxed whitespace-pre-wrap text-[11px] ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-purple-600/10 border border-purple-500/20 text-slate-200 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-purple-600/10 border border-purple-500/20 text-slate-400 rounded-xl rounded-tl-none px-3 py-1.5 animate-pulse text-[9px] font-mono">
                    {companion.name} is planning…
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <div className="flex gap-1 mt-2 shrink-0 flex-wrap">
              {['Plan my schedule', 'How many days left?', 'What should I revise?'].map(q => (
                <button key={q} onClick={() => setChatInput(q)}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={sendChat} className="mt-2 flex gap-1 shrink-0">
              <input
                type="text"
                disabled={typing}
                placeholder={`Ask ${companion.name}…`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-[#1e1e22] border border-[#2b2b2d] rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-600 min-w-0"
              />
              <button type="submit" disabled={typing || !chatInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 px-2.5 rounded-lg text-white transition-colors disabled:opacity-40">
                <Send size={11} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Calendar */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setWeekAnchor(d => addDays(d, -7))}
                className="p-1.5 rounded-lg bg-[#242426] hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                <ChevronLeft size={15} />
              </button>
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                {formatDisplay(weekDates[0])} — {formatDisplay(weekDates[6])}
              </span>
              <div className="flex items-center gap-2">
                {Object.keys(plans).length > 0 && (
                  <button
                    onClick={clearAllPlans}
                    title="Clear entire calendar"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 hover:border-rose-500/40 transition-all"
                  >
                    <Trash2 size={10} /> Clear All
                  </button>
                )}
                <button onClick={() => setWeekAnchor(d => addDays(d, 7))}
                  className="p-1.5 rounded-lg bg-[#242426] hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekDates.map((date, idx) => {
                const plan = plans[date];
                const isToday = date === todayISO;
                const isExam = date === examDate;
                const isRest = plan?.isRestDay;
                return (
                  <div key={date} className={`rounded-xl border flex flex-col gap-1 p-2 transition-all ${
                    isExam ? 'border-rose-500/60 bg-rose-950/20'
                    : isToday ? 'border-purple-500/50 bg-purple-950/20'
                    : isRest ? 'border-slate-700/30 bg-slate-900/30'
                    : 'border-[#242426] bg-[#0c0c0d]'
                  }`} style={{ minHeight: 140 }}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${isToday ? 'text-purple-400' : isExam ? 'text-rose-400' : 'text-slate-500'}`}>
                        {LABELS[idx]}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-mono ${isToday ? 'text-purple-300' : 'text-slate-600'}`}>
                          {date.slice(8)}
                        </span>
                        {!isExam && plan?.blocks && plan.blocks.length > 0 && (
                          <button
                            onClick={() => clearDay(date)}
                            title="Clear this day"
                            className="text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={8} />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExam && (
                      <div className="text-[8px] text-rose-400 font-bold uppercase flex items-center gap-0.5">
                        <Target size={8} /> EXAM
                      </div>
                    )}

                    <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                      {isRest ? (
                        <div className="text-[9px] text-slate-500 italic text-center mt-1">💤 Rest</div>
                      ) : (
                        plan?.blocks.map(b => (
                          <div key={b.id} className={`text-[8px] px-1.5 py-1 rounded border ${b.color} flex items-start justify-between gap-0.5 leading-tight`}>
                            <span className="truncate flex-1">{b.topic}</span>
                            <button onClick={() => removeBlock(date, b.id)} className="opacity-40 hover:opacity-100 shrink-0">
                              <Trash2 size={7} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {!isExam && !isRest && (
                      addingTo === date ? (
                        <div className="space-y-1 mt-1">
                          <select value={newTopic} onChange={e => setNewTopic(e.target.value)}
                            className="w-full bg-[#1e1e22] border border-[#2b2b2d] rounded px-1 py-0.5 text-[8px] text-slate-200 focus:outline-none">
                            {TOPICS.map(t => <option key={t.name}>{t.name}</option>)}
                          </select>
                          <select value={newDur} onChange={e => setNewDur(e.target.value)}
                            className="w-full bg-[#1e1e22] border border-[#2b2b2d] rounded px-1 py-0.5 text-[8px] text-slate-200 focus:outline-none">
                            {DURATIONS.map(d => <option key={d}>{d}</option>)}
                          </select>
                          <div className="flex gap-1">
                            <button onClick={() => addBlock(date)}
                              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[8px] py-0.5 font-bold">Add</button>
                            <button onClick={() => setAddingTo(null)}
                              className="flex-1 bg-[#242426] hover:bg-slate-800 text-slate-400 rounded text-[8px] py-0.5">✕</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddingTo(date)}
                          className="w-full mt-1 py-1 rounded text-[9px] text-slate-600 hover:text-purple-400 hover:bg-purple-950/20 border border-dashed border-[#2b2b2d] hover:border-purple-500/30 transition-all flex items-center justify-center gap-0.5">
                          <Plus size={8} /> Add
                        </button>
                      )
                    )}

                    {!isExam && (
                      <button onClick={() => toggleRest(date)}
                        className={`text-[8px] py-0.5 rounded transition-all ${isRest ? 'text-purple-400 hover:text-slate-400' : 'text-slate-600 hover:text-slate-400'}`}>
                        {isRest ? '↩ Undo rest' : '💤 Rest'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Topic Legend
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map(t => (
                <span key={t.name} className={`text-[9px] px-2 py-0.5 rounded border font-semibold ${t.color}`}>{t.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Companion Memory Panel */}
      <CompanionMemoryPanel
        isOpen={memoryPanelOpen}
        onClose={() => setMemoryPanelOpen(false)}
      />
    </div>
  );
}
