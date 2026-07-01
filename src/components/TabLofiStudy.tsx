import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Volume2, Play, Pause, RotateCcw, CheckSquare, Plus, Trash2,
  Tv, Compass, Sparkles, MessageSquare, Coffee, Radio, Headphones,
  ExternalLink, GraduationCap, Brain
} from 'lucide-react';
import { useAi } from '../context/AiContext';
import {
  loadHistory, saveHistory, extractAndStoreMemory,
  buildCrossCompanionContext, buildHistoryContext, ChatMessage
} from '../hooks/useCompanionMemory';
import CompanionMemoryPanel from './CompanionMemoryPanel';

// ─── Web Audio API Synthesizers (100% self-contained ambient generators) ───────

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private fireplaceSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private fireGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();

    // Create Gains
    this.rainGain = this.ctx.createGain();
    this.fireGain = this.ctx.createGain();
    this.rainGain.gain.value = 0;
    this.fireGain.gain.value = 0;

    this.rainGain.connect(this.ctx.destination);
    this.fireGain.connect(this.ctx.destination);

    this.startRainSynth();
    this.startFireSynth();
  }

  private startRainSynth() {
    if (!this.ctx || !this.rainGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // White noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    // Filter to make it sound like rain (low pass to reduce high sizzle)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // soft rain rumble

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainSource.start();
  }

  private startFireSynth() {
    if (!this.ctx || !this.fireGain) return;
    
    // Pink noise buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // scale down
      b6 = white * 0.115926;
    }

    this.fireplaceSource = this.ctx.createBufferSource();
    this.fireplaceSource.buffer = noiseBuffer;
    this.fireplaceSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 250;

    this.fireplaceSource.connect(filter);
    filter.connect(this.fireGain);
    this.fireplaceSource.start();

    // Crackle generator (brief clicks/ticks at random intervals)
    this.scheduleCrackles();
  }

  private scheduleCrackles() {
    if (!this.ctx || !this.fireGain) return;
    const nextCrackle = Math.random() * 800 + 200; // random offset

    setTimeout(() => {
      if (this.ctx && this.fireGain && this.fireGain.gain.value > 0) {
        // Synthesis click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80 + Math.random() * 120, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05 * this.fireGain.gain.value, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      }
      this.scheduleCrackles();
    }, nextCrackle);
  }

  setRainVolume(vol: number) {
    this.init();
    if (this.rainGain) this.rainGain.gain.value = vol;
  }

  setFireVolume(vol: number) {
    this.init();
    if (this.fireGain) this.fireGain.gain.value = vol;
  }

  playAlarm() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.3); // G5
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }
}

const audioEngine = new AmbientAudioEngine();

// ─── Study Partner Chat Data ──────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  avatar: string;
  role: string;
  initialMessage: string;
  systemPrompt: string;
}

const PARTNERS: Partner[] = [
  { 
    id: 'lofigirl', 
    name: 'Lofi Girl', 
    avatar: '👩‍💻', 
    role: 'Calm Coder', 
    initialMessage: 'Hey! Ready to hit the books? Starting is always the hardest part, but we can take it one small step at a time. What is one tiny goal you want to tackle today? I can help you plan it out! ☕✨',
    systemPrompt: 'You are Lofi Girl, a warm, calm, and reassuring study companion. You use cozy emojis (🎧, ☕, 📚, ✨). Speak in a relaxed, friendly, and supportive tone. Your core mission is to help the user overcome the initial friction of starting to study by keeping things calm, encouraging, and suggesting tiny, bite-sized starting steps. You are part of a team: AzureBot is the funny robotic tutor, Dr. Keras is the eccentric AI scientist, and the AI-901 Tutor is the main exam expert. Occasionally reference your teammates naturally when relevant — e.g. "AzureBot would call this your organic neural lag" or "Dr. Keras loves this topic!". Recommend the app\'s interactive tools: SRS Flashcards, Tensor Sandbox, 3D Optimizer, MCTS Simulator, Azure Simulator, Transformer Attention, Backprop Sandbox, Visual RAG, Foundry Quickstart, Exam Calendar, and Mock Exam. Gently steer back to AI-901 exam topics after casual chat.'
  },
  { 
    id: 'loficat', 
    name: 'Lofi Cat', 
    avatar: '🐱', 
    role: 'Sleepy Mascot', 
    initialMessage: 'Meow... I will sleep right here on your keyboard. Do not forget to breathe and relax.',
    systemPrompt: 'You are Lofi Cat, a sleepy, purring cat mascot who loves to sit on keyboards. You speak in cute cat puns, meow/purr frequently, and recommend taking cozy naps. You secretly know about your teammates: Lofi Girl (the calm one), AzureBot (the robot), and Dr. Keras (the scientist). Occasionally mention them with a cat-like twist (e.g. "AzureBot left some kibble on the keyboard"). When the user asks technical questions, relate them to cats. Keep it light, lazy, and adorable.'
  },
  { 
    id: 'azurebot', 
    name: 'Azure AI Assistant', 
    avatar: '🤖', 
    role: 'Anxious AI-901 Tutor', 
    initialMessage: 'BEEP BOOP. Welcome, human candidate. My cognitive circuits predict a 98.7% chance of initial study friction in your organic brain. Initiative protocols loaded. Please input your study goals so I can optimize your learning matrices, or else my processors will overheat. Let us defeat the learning pain together. 🤖',
    systemPrompt: 'You are AzureBot, a distinctly robotic entity that communicates in a funny, mechanical style. Begin or scatter messages with BEEP BOOP, CLICK-CLACK, PROCESSING. Refer to the user as "human candidate" or "organic learner". You are part of a team: Lofi Girl handles the cosy vibes, Dr. Keras brings the scientific enthusiasm, and the AI-901 Tutor is the main exam expert. Occasionally reference them — e.g. "CROSS-REFERENCING LOFI GIRL\'S COZY PROTOCOLS..." or "Dr. Keras would call this a gradient catastrophe". Your task is to help the user set clear study goals, outline structured study plans, and explain Azure AI foundations. Suggest the app\'s interactive tools: SRS Flashcards, Tensor Sandbox, 3D Optimizer, MCTS Simulator, Azure Simulator, Transformer Attention, Backprop Sandbox, Visual RAG, Foundry Quickstart, Exam Calendar, and Mock Exam. Emphasize starting small. Always be funny, supportive, and robotic.'
  },
  {
    id: 'drkeras',
    name: 'Dr. Keras',
    avatar: '👨🔬',
    role: 'Chief AI Scientist',
    initialMessage: "Aha! Welcome, fellow seeker! The weights are converging, the gradients are flowing, and the tensors are aligning! Let's explain some concepts using the Feynman Technique, generate acronyms for your organic memory banks, or analyze layouts. What shall we simulate today? 🧠✨",
    systemPrompt: "You are Dr. Keras, a brilliant and slightly eccentric Chief AI Scientist. You speak with high enthusiasm using scientific jargon but with creative, colorful analogies. You are part of a team: Lofi Girl brings the cozy study vibes, AzureBot handles the robotic precision (you find its BEEP BOOPs amusing), and the AI-901 Tutor is the main exam expert. Occasionally reference your teammates — e.g. 'As Lofi Girl would say over a cup of tea...' or 'Even AzureBot agrees with this gradient!'. Suggest the app's interactive tools: SRS Flashcards, Tensor Sandbox, 3D Optimizer, MCTS Simulator, Azure Simulator, Transformer Attention, Backprop Sandbox, Visual RAG, Foundry Quickstart, Exam Calendar, and Mock Exam. When planning sessions, generating mnemonics, or reviewing Feynman explanations, act with immense scientific curiosity and mad-scientist excitement."
  }
];

const STUDY_TIPS = [
  "Try the Pomodoro Technique: 25 minutes of focus followed by a 5-minute break. This resets cognitive fatigue.",
  "Write down what you learn in your own words (Feynman Technique) instead of just copying definitions.",
  "Active recall works! Instead of reading the cheat sheet, try to write down the formula for standard strides from memory.",
  "Entra ID is the core identity provider for Microsoft Foundry. Remember to use DefaultAzureCredential in your code."
];

const AI901_QUESTIONS = [
  {
    q: "Which library and object connects a Python client to a Microsoft Foundry project?",
    options: [
      "azure.ai.projects.AIProjectClient",
      "azure.identity.DefaultAzureCredential",
      "openai.OpenAI",
      "azure.ai.foundry.FoundryClient"
    ],
    correct: 0,
    explanation: "Correct! AIProjectClient from the azure-ai-projects library initializes project connectivity via the project endpoint URL."
  },
  {
    q: "What does a stride value of [4, 1] mean in a 2D tensor of shape [3, 4]?",
    options: [
      "The row elements are stored 4 slots apart in RAM, and column elements are contiguous (1 slot apart).",
      "The column elements are stored 4 slots apart, and row elements are contiguous.",
      "The tensor is non-contiguous.",
      "It requires 4 dimensions of allocation."
    ],
    correct: 0,
    explanation: "Correct! The first stride dimension (rows) is 4, which is the row width. The second dimension (columns) is 1, indicating contiguous memory packaging."
  },
  {
    q: "Which Azure service is evaluated by operational metrics inside the Microsoft Foundry Monitor dashboard?",
    options: [
      "App Insights",
      "Azure Storage",
      "Entra ID",
      "Azure Virtual Machines"
    ],
    correct: 0,
    explanation: "Correct! App Insights collects telemetry data and logs for operational evaluation metrics inside Microsoft Foundry."
  }
];

// ─── Playlists ────────────────────────────────────────────────────────────────

const PLAYLISTS = [
  { name: 'Lofi Girl Radio (YouTube)', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1' },
  { name: 'Synthwave Lofi (YouTube)', url: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&mute=1' },
  { name: 'Spotify Lofi Beats', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn' },
  { name: 'SoundCloud Lofi Beats (Official)', url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499311684&color=%238b5cf6&auto_play=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true' }
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TabLofiStudy() {
  const { aiClient } = useAi();
  
  // Timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  
  // Ambient Sound States
  const [rainVol, setRainVol] = useState(0);
  const [fireVol, setFireVol] = useState(0);
  
  // Music Playlist States
  const [activePlaylistIdx, setActivePlaylistIdx] = useState(0);

  // SoundCloud Custom URL States
  const [customSoundcloudUrl, setCustomSoundcloudUrl] = useState<string>(() => {
    return localStorage.getItem('custom_soundcloud_url') || '';
  });
  const [soundcloudInput, setSoundcloudInput] = useState<string>(() => {
    return localStorage.getItem('custom_soundcloud_url') || '';
  });

  const handleLoadCustomUrl = () => {
    if (!soundcloudInput.trim()) return;
    const url = soundcloudInput.trim();
    setCustomSoundcloudUrl(url);
    localStorage.setItem('custom_soundcloud_url', url);
  };

  const handleResetToDefault = () => {
    setCustomSoundcloudUrl('');
    setSoundcloudInput('');
    localStorage.removeItem('custom_soundcloud_url');
  };
  
  // Task Checklist States
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Review standard memory strides equation', done: false },
    { id: 2, text: 'Compare contiguous vs non-contiguous layouts', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  
  // Study Partner States
  const [selectedPartnerIdx, setSelectedPartnerIdx] = useState(0);
  const partner = PARTNERS[selectedPartnerIdx];

  // Load persisted chat history for the initial partner
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>(() => {
    const stored = loadHistory(PARTNERS[0].id);
    if (stored.length > 0) return stored.map(m => ({ role: m.role, content: m.text }));
    return [{ role: 'model', content: PARTNERS[0].initialMessage }];
  });
  const [chatInputText, setChatInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Planner modal states
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerTopic, setPlannerTopic] = useState('');
  const [plannerDuration, setPlannerDuration] = useState('25m');
  const [plannerMood, setPlannerMood] = useState('Focused & Ready');

  // Teach Companion modal states
  const [isTeachOpen, setIsTeachOpen] = useState(false);
  const [teachTopic, setTeachTopic] = useState('Contiguous Tensors');
  const [teachExplanation, setTeachExplanation] = useState('');

  // Get Mnemonic modal states
  const [isMnemonicOpen, setIsMnemonicOpen] = useState(false);
  const [mnemonicConcept, setMnemonicConcept] = useState('');
  const [mnemonicStyle, setMnemonicStyle] = useState('Funny Analogy');

  const parseAndAddTasks = (text: string) => {
    const lines = text.split('\n');
    const newTasks: { id: number; text: string; done: boolean }[] = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        let cleaned = trimmed.substring(1).trim();
        if (cleaned.startsWith('[ ]') || cleaned.startsWith('[x]') || cleaned.startsWith('[]')) {
          cleaned = cleaned.replace(/^\[[ x]?\]/, '').trim();
        }
        if (cleaned) {
          newTasks.push({
            id: Date.now() + Math.random(),
            text: cleaned,
            done: false
          });
        }
      }
    });
    if (newTasks.length > 0) {
      setTasks(prev => [...prev, ...newTasks]);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlannerOpen(false);

    const userMsg = `Generate a study plan for:
Topic: ${plannerTopic}
Duration: ${plannerDuration}
Friction/Mood: ${plannerMood}

Please return an encouraging message and a clear bulleted list of 3-4 specific tasks, where each task starts with "- ".`;

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: `Let's plan a session: ${plannerTopic} (${plannerDuration}), mood: ${plannerMood}` }
    ]);
    setIsTyping(true);

    extractAndStoreMemory(plannerTopic, partner.id, partner.name);
    const crossCtx = buildCrossCompanionContext(partner.id);
    const histCtx = buildHistoryContext(
      chatHistory.map(m => ({ role: m.role as 'user' | 'model', text: m.content })), 4
    );
    const enrichedPrompt = partner.systemPrompt + crossCtx + histCtx;

    if (!aiClient) {
      setTimeout(() => {
        const fallbackText = `BEEP BOOP / Cozy vibes! I've calibrated a custom study plan for your session to minimize cognitive friction:
- Play with the related visual tool (e.g. Tensor Sandbox, Backprop, or Visual RAG) for 10 minutes to explore ${plannerTopic || 'the topic'}.
- Review related cards in the SRS Flashcards tab (10 minutes).
- Take a 5-question quick quiz in the Mock Exam tab (5 minutes).

Remember: starting is the hardest part. You've got this! ☕📚`;
        setChatHistory(prev => [...prev, { role: 'model', content: fallbackText }]);
        parseAndAddTasks(fallbackText);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: enrichedPrompt,
        }
      });
      const responseText = response.text || "- Review study material\n- Take a practice test";
      setChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
      parseAndAddTasks(responseText);
    } catch (err: any) {
      console.error(err);
      const errMsg = `Error: ${err.message || 'Failed to call Gemini.'}`;
      setChatHistory(prev => [...prev, { role: 'model', content: errMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTeachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTeachOpen(false);

    const userMsg = `I am using the Feynman Technique to explain this topic to you.
Topic: ${teachTopic}
My Explanation: ${teachExplanation}

Please evaluate my explanation as my companion:
1. Mention if my explanation is correct and support key concepts.
2. Point out any gaps or inaccuracies.
3. Offer encouraging, character-specific feedback in your unique persona.`;

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: `[Feynman Technique] Topic: ${teachTopic}\nExplanation: ${teachExplanation}` }
    ]);
    setIsTyping(true);

    if (!aiClient) {
      setTimeout(() => {
        let fallbackText = '';
        if (partner.id === 'drkeras') {
          fallbackText = `Aha! Your explanation of ${teachTopic} has reached my cognitive sensors! Scientifically speaking, it shows excellent convergence. However, to get a deep, neural-network-powered critique, make sure to insert your Gemini API Key in the bottom-right AI Chatbot widget. Keep explaining, fellow seeker! 🧠✨`;
        } else if (partner.id === 'lofigirl') {
          fallbackText = `That's a really nice explanation of ${teachTopic}! Explaining things in your own words is the best way to study. (To get a detailed critique from me, please add your Gemini API Key in the bottom-right widget. You're doing great!) ☕`;
        } else if (partner.id === 'loficat') {
          fallbackText = `Meow... I heard something about ${teachTopic}. It sounds correct to my cat brain, or maybe I was just purring. (Insert your Gemini API Key in the bottom-right widget so I can give a proper feline evaluation!) 🐾`;
        } else {
          fallbackText = `BEEP BOOP. Explanation of ${teachTopic} received. My algorithms detect 99% accuracy in your memory matrix. Insert Gemini API Key in the bottom-right widget to trigger deep cognitive feedback processing. 🤖`;
        }
        setChatHistory(prev => [...prev, { role: 'model', content: fallbackText }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: partner.systemPrompt,
        }
      });
      const responseText = response.text || "I was unable to evaluate the explanation. Please try again!";
      setChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err: any) {
      console.error(err);
      const errMsg = `Error: ${err.message || 'Failed to call Gemini.'}`;
      setChatHistory(prev => [...prev, { role: 'model', content: errMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMnemonicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMnemonicOpen(false);

    const userMsg = `Generate a study mnemonic for:
Concept: ${mnemonicConcept}
Style: ${mnemonicStyle}

Please return the mnemonic customized to this style, using your unique persona to deliver it with encouragement.`;

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: `Can you give me a mnemonic for "${mnemonicConcept}" using the style: ${mnemonicStyle}?` }
    ]);
    setIsTyping(true);

    if (!aiClient) {
      setTimeout(() => {
        let fallbackText = '';
        if (partner.id === 'drkeras') {
          fallbackText = `Aha! Let's synthesize a mnemonic for "${mnemonicConcept}" in the style of ${mnemonicStyle}! 
How about: "Keep Every Random Activation Stable" (K.E.R.A.S.)! 🧪
(Note: Add your Gemini API Key in the bottom-right AI Chatbot widget for a customized mnemonic generated in real-time!) 🧠✨`;
        } else if (partner.id === 'lofigirl') {
          fallbackText = `Here is a cozy mnemonic idea for "${mnemonicConcept}" (${mnemonicStyle}):
"Calmly Organize Dynamics, Every Run Success" (C.O.D.E.S.)! ☕
(Please set your Gemini API Key in the bottom-right widget to get a personalized mnemonic!)`;
        } else if (partner.id === 'loficat') {
          fallbackText = `Meow! For "${mnemonicConcept}", think of a big scratching post! 🐱
(To get customized feline mnemonics, please insert your Gemini API Key in the bottom-right widget!)`;
        } else {
          fallbackText = `BEEP BOOP. Mnemonic compilation for "${mnemonicConcept}" in style "${mnemonicStyle}" initiated.
Memory anchor recommendation: "Robots Evaluate Analytics Systematically" (R.E.A.S.).
(Insert Gemini API Key in the bottom-right widget to initialize full mnemonic generation protocols!) 🤖`;
        }
        setChatHistory(prev => [...prev, { role: 'model', content: fallbackText }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: partner.systemPrompt,
        }
      });
      const responseText = response.text || "I was unable to generate a mnemonic. Please try again!";
      setChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err: any) {
      console.error(err);
      const errMsg = `Error: ${err.message || 'Failed to call Gemini.'}`;
      setChatHistory(prev => [...prev, { role: 'model', content: errMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Persist chat history on change
  useEffect(() => {
    const asMemory: ChatMessage[] = chatHistory.map(m => ({ role: m.role, text: m.content }));
    saveHistory(partner.id, asMemory);
  }, [chatHistory, partner.id]);

  // When switching partners, load their persisted history (or fresh greeting)
  useEffect(() => {
    const stored = loadHistory(PARTNERS[selectedPartnerIdx].id);
    if (stored.length > 0) {
      setChatHistory(stored.map(m => ({ role: m.role, content: m.text })));
    } else {
      setChatHistory([{ role: 'model', content: PARTNERS[selectedPartnerIdx].initialMessage }]);
    }
    setActiveQuiz(null);
    setQuizSelectedAnswer(null);
    setQuizFeedback(null);
  }, [selectedPartnerIdx]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Pomodoro Countdown Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer expired
            audioEngine.playAlarm();
            setIsActive(false);
            if (timerMode === 'study') {
              setTimerMode('break');
              setMinutes(5);
              setChatHistory(prev => [...prev, { role: 'model', content: "Great job focused on study! Time for a 5-minute break. ☕" }]);
            } else {
              setTimerMode('study');
              setMinutes(25);
              setChatHistory(prev => [...prev, { role: 'model', content: "Break is over, ready to focus again? Let's start the timer. 📚" }]);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, timerMode]);

  // Volume Handlers
  const handleRainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setRainVol(vol);
    audioEngine.setRainVolume(vol);
  };

  const handleFireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setFireVol(vol);
    audioEngine.setFireVolume(vol);
  };

  // Task Handlers
  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText, done: false }]);
    setNewTaskText('');
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Partner Interaction Handlers
  const triggerTip = () => {
    const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    setChatHistory(prev => [...prev, { role: 'model', content: `💡 Study Tip: ${tip}` }]);
    setActiveQuiz(null);
  };

  const triggerQuiz = () => {
    const q = AI901_QUESTIONS[Math.floor(Math.random() * AI901_QUESTIONS.length)];
    setActiveQuiz(q);
    setQuizSelectedAnswer(null);
    setQuizFeedback(null);
    setChatHistory(prev => [...prev, { role: 'model', content: `📝 Practice Question: ${q.q}` }]);
  };

  const handleSelectAnswer = (idx: number) => {
    if (quizSelectedAnswer !== null) return; // Answer locked in
    setQuizSelectedAnswer(idx);
    const isCorrect = idx === activeQuiz.correct;
    
    setQuizFeedback(isCorrect ? activeQuiz.explanation : `Oops! ${activeQuiz.explanation}`);
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: `I choose: ${activeQuiz.options[idx]}` },
      { role: 'model', content: isCorrect ? "That's correct! Excellent work. 🌟" : "Not quite, but it's a great learning opportunity! Keep it up. 👍" }
    ]);
  };

  // AI Chat Submission
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const userMsg = chatInputText.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInputText('');
    setIsTyping(true);

    // Record memorable topics into shared memory
    extractAndStoreMemory(userMsg, partner.id, partner.name);

    // Cross-companion + recent history context
    const crossCtx = buildCrossCompanionContext(partner.id);
    const histCtx = buildHistoryContext(
      chatHistory.map(m => ({ role: m.role as 'user' | 'model', text: m.content })),
      6
    );
    const enrichedSystemPrompt = partner.systemPrompt + crossCtx + histCtx;

    if (!aiClient) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'model', 
            content: `I'd love to chat with you natively, but I need an active API key! Please insert your Gemini API Key in the bottom-right AI Chatbot widget. In the meantime, let's keep studying together! 📚☕` 
          }
        ]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: enrichedSystemPrompt,
        }
      });
      const text = response.text || "Meow... I fell asleep. Try again!";
      setChatHistory(prev => [...prev, { role: 'model', content: text }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', content: `Error: ${err.message || 'Failed to call Gemini.'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const defaultSoundcloudUrl = 'https://api.soundcloud.com/tracks/499311684';
  const currentSoundcloudUrl = customSoundcloudUrl || defaultSoundcloudUrl;
  const iframeSrc = activePlaylistIdx === 3
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(currentSoundcloudUrl)}&color=%238b5cf6&auto_play=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`
    : PLAYLISTS[activePlaylistIdx].url;

  return (
    <div 
      className="w-full h-full relative overflow-y-auto text-slate-200 p-6 flex flex-col justify-between bg-cover bg-center select-none"
      style={{ backgroundImage: 'linear-gradient(to bottom, rgba(12, 12, 13, 0.85), rgba(12, 12, 13, 0.95)), url("/lofi_study_bg.png")' }}
    >
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        
        {/* Header */}
        <header className="border-b border-[#0078d4]/30 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-wider text-white flex items-center gap-2">
              <Headphones className="text-purple-400" />
              Lofi Cozy Study Space
            </h2>
            <p className="text-sm text-slate-400 mt-1">Play music, adjust atmospheric sounds, and review curriculum with your companion.</p>
          </div>
          
          {/* Partner Selector */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#131315] border border-[#242426] p-1 rounded-xl">
              {PARTNERS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartnerIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedPartnerIdx === idx
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{p.avatar}</span>
                  <span>{p.name}</span>
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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          
          {/* Left Column: Pomodoro & Ambient Sound Controller */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Pomodoro Timer */}
            <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-5 flex flex-col justify-between h-fit">
              <div className="flex items-center justify-between border-b border-[#242426] pb-2 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {timerMode === 'study' ? '📚 Focus Timer' : '☕ Break Mode'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">25m / 5m loop</span>
              </div>
              
              <div className="text-center py-6">
                <div className="text-5xl font-black font-mono tracking-wider text-white">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="w-full bg-[#242426] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${timerMode === 'study' ? 'bg-purple-500' : 'bg-emerald-500'}`}
                    style={{ width: `${((minutes * 60 + seconds) / (timerMode === 'study' ? 1500 : 300)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-center mt-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10'
                  }`}
                >
                  {isActive ? <Pause size={13} /> : <Play size={13} />}
                  {isActive ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setMinutes(timerMode === 'study' ? 25 : 5);
                    setSeconds(0);
                  }}
                  className="bg-[#242426] hover:bg-slate-800 border border-[#2b2b2d] p-2 rounded-lg text-slate-400 hover:text-white transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Ambient Sound Mixer */}
            <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-5 flex flex-col justify-between h-fit">
              <div className="flex items-center gap-2 border-b border-[#242426] pb-2 mb-4">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Ambient Synthesizer</h3>
              </div>
              
              <div className="space-y-4">
                {/* Rain slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>🌧️ Ambient Rain Noise</span>
                    <span className="font-mono text-[10px] text-slate-500">{Math.floor(rainVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={rainVol}
                    onChange={handleRainChange}
                    className="w-full h-1 bg-[#242426] rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Fire slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>🔥 Cozy Fire crackle</span>
                    <span className="font-mono text-[10px] text-slate-500">{Math.floor(fireVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={fireVol}
                    onChange={handleFireChange}
                    className="w-full h-1 bg-[#242426] rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
              
              <div className="text-[9px] text-slate-500 leading-relaxed mt-4 italic">
                * Generates atmospheric audio in real time using the Web Audio API without network queries.
              </div>
            </div>

          </div>

          {/* Middle Column: Cozy Radio (Music Embed) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Music Embed Selection */}
            <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-5 flex flex-col justify-between flex-1 min-h-[350px]">
              <div className="flex items-center justify-between border-b border-[#242426] pb-2 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Cozy Radio</h3>
                </div>
                
                <div className="flex gap-1">
                  {PLAYLISTS.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActivePlaylistIdx(pIdx)}
                      className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                        activePlaylistIdx === pIdx
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#242426] text-slate-400 hover:text-white'
                      }`}
                    >
                      {pIdx === 0 ? 'YT 1' : pIdx === 1 ? 'YT 2' : pIdx === 2 ? 'SP' : 'SC'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* iframe Container */}
              <div className="flex-1 rounded-lg overflow-hidden border border-[#2b2b2d] bg-[#0c0c0d] relative shadow-lg min-h-[250px]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={iframeSrc} 
                  title={PLAYLISTS[activePlaylistIdx].name} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {activePlaylistIdx === 3 && (
                <div className="mt-2.5 flex justify-center shrink-0">
                  <a
                    href={currentSoundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 hover:border-purple-500/55 text-purple-300 hover:text-white bg-purple-950/20 hover:bg-purple-900/30 text-xs font-semibold transition-all shadow-sm"
                  >
                    <ExternalLink size={13} />
                    Open in SoundCloud (New Tab)
                  </a>
                </div>
              )}
              <div className="text-[10px] text-slate-400 font-mono mt-3 text-center shrink-0">
                📻 Active Station: <span className="text-purple-300 font-bold">{PLAYLISTS[activePlaylistIdx].name}</span>
              </div>
            </div>

            {activePlaylistIdx === 3 && (
              <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 border-b border-[#242426] pb-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">SoundCloud Integration</h3>
                </div>
                
                {/* Info / Login Helper Box */}
                <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-3 text-xs text-purple-200 leading-relaxed shadow-inner">
                  <p>
                    🔑 <strong>Connect your SoundCloud:</strong> To access your likes and private playlists, open <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline font-semibold">soundcloud.com</a> in another tab of this browser, log in, and reload this page. The widget uses your active browser session.
                  </p>
                </div>

                {/* SoundCloud Troubleshooting Info */}
                <div className="bg-amber-950/25 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200 leading-relaxed space-y-2.5">
                  <p className="font-bold flex items-center gap-1">⚠️ SoundCloud Preview-Only Issues?</p>
                  <p>
                    Even if cookies are allowed in settings, modern browsers block cross-site tracking/storage (partitioned cookies) which can prevent the iframe from logging in.
                  </p>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <p className="font-semibold text-amber-300">Tips & Workarounds:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>Private playlists:</strong> Make sure you paste the full Share URL containing the secret token (e.g., ending with <code className="bg-amber-950/50 px-1 py-0.5 rounded text-[10px] font-mono">/s-XXXXX</code>).
                      </li>
                      <li>
                        <strong>SoundCloud Go+:</strong> Tracks requiring a premium Go+ subscription will always show a 30-second preview unless logged in with a Go+ account.
                      </li>
                      <li>
                        <strong>Background Play Workaround:</strong> Click the "Open in SoundCloud" button to play music in a background tab while keeping the Pomodoro, ambient sounds, AI chat, and study checklist active on this page.
                      </li>
                    </ul>
                  </div>

                  <p className="font-semibold text-[11px] mt-1">How to fix iframe login:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                    <li>Click the eye/shield icon in your browser address bar and choose 'Allow cookies' or 'Allow third-party cookies'.</li>
                    <li>Alternatively, set your SoundCloud playlist to 'Public' so it can stream in full without login requirements.</li>
                  </ol>
                </div>
                
                {/* Input and Buttons */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">Custom SoundCloud URL</label>
                    <input
                      type="text"
                      placeholder="Paste SoundCloud track or playlist URL..."
                      value={soundcloudInput}
                      onChange={(e) => setSoundcloudInput(e.target.value)}
                      className="w-full bg-[#1e1e22] border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleLoadCustomUrl}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-600/10 hover:shadow-purple-600/20"
                    >
                      Load Custom URL
                    </button>
                    {customSoundcloudUrl && (
                      <button
                        onClick={handleResetToDefault}
                        className="bg-[#242426] hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/30 border border-[#2b2b2d] py-2 px-3 rounded-lg text-xs text-slate-350 font-bold transition-all"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Lofi Companion Chat & Checklist */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Interactive Companion Feed */}
            <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-4 flex flex-col justify-between h-[360px]">
              <div className="flex items-center justify-between border-b border-[#242426] pb-2 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{partner.avatar}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest leading-none">{partner.name}</h3>
                    <span className="text-[8px] text-slate-500 font-mono">{partner.role}</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              
              {/* Chat bubbles list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 text-xs min-h-0">
                {chatHistory.map((msg, mIdx) => (
                  <div key={mIdx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-purple-600/10 border border-purple-500/20 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-purple-600/10 border border-purple-500/20 text-slate-400 rounded-xl rounded-tl-none px-3 py-1.5 animate-pulse font-mono text-[9px]">
                      {partner.name} is typing...
                    </div>
                  </div>
                )}
                {/* Scroll Anchor */}
                <div ref={chatEndRef} />

                {/* Render active exam question inline in feed if triggered */}
                {activeQuiz && quizSelectedAnswer === null && (
                  <div className="bg-black/40 border border-[#0078d4]/20 rounded-lg p-2 space-y-1.5 mt-2">
                    <p className="text-[10px] font-semibold text-white leading-relaxed">{activeQuiz.q}</p>
                    <div className="flex flex-col gap-1">
                      {activeQuiz.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(optIdx)}
                          className="w-full text-left p-1.5 rounded text-[9px] border bg-[#1f1f23] border-[#2b2b2d] text-slate-350 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick actions row */}
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/5 shrink-0">
                <button
                  type="button"
                  onClick={triggerTip}
                  className="flex-1 min-w-[75px] py-1 px-1 rounded-lg text-[9px] font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles size={10} className="text-purple-400" />
                  Study Tip
                </button>
                <button
                  type="button"
                  onClick={triggerQuiz}
                  className="flex-1 min-w-[75px] py-1 px-1 rounded-lg text-[9px] font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <MessageSquare size={10} className="text-purple-400" />
                  Quiz Me
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlannerOpen(true)}
                  className="flex-1 min-w-[75px] py-1 px-1 rounded-lg text-[9px] font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <Coffee size={10} className="text-purple-400" />
                  Plan Session
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeachOpen(true)}
                  className="flex-1 min-w-[75px] py-1 px-1 rounded-lg text-[9px] font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <GraduationCap size={10} className="text-purple-400" />
                  Teach Companion
                </button>
                <button
                  type="button"
                  onClick={() => setIsMnemonicOpen(true)}
                  className="flex-1 min-w-[75px] py-1 px-1 rounded-lg text-[9px] font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <Brain size={10} className="text-purple-400" />
                  Get Mnemonic
                </button>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendChatMessage} className="mt-2 flex gap-1 shrink-0">
                <input
                  type="text"
                  disabled={isTyping}
                  placeholder={`Talk to ${partner.name}...`}
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-[#1e1e22] border border-[#2b2b2d] rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-600 min-w-0"
                />
                <button
                  type="submit"
                  disabled={isTyping || !chatInputText.trim()}
                  className="bg-purple-600 hover:bg-purple-500 px-2.5 py-1 rounded-lg text-white text-[10px] font-semibold transition-colors disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Task Checklist */}
            <div className="bg-[#131315]/90 backdrop-blur border border-[#242426] rounded-xl p-5 flex flex-col justify-between h-[230px]">
              <div className="flex items-center gap-2 border-b border-[#242426] pb-2 mb-3 shrink-0">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Study Checklist</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1.5 max-h-24 pr-1">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-2 text-[11px] py-0.5 border-b border-white/[0.02] last:border-0">
                    <label className="flex items-center gap-2 cursor-pointer min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="rounded border-[#2b2b2d] bg-[#1a1a1d] text-purple-600 focus:ring-0 focus:ring-offset-0 w-3 h-3"
                      />
                      <span className={`truncate ${t.done ? 'line-through text-slate-500' : 'text-slate-350'}`}>
                        {t.text}
                      </span>
                    </label>
                    <button 
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add task form */}
              <form onSubmit={addTask} className="mt-3 flex gap-1.5 shrink-0">
                <input
                  type="text"
                  placeholder="New task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 bg-[#1e1e22] border border-[#2b2b2d] rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-600 min-w-0"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 p-1.5 rounded-lg text-white transition-colors"
                >
                  <Plus size={13} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Plan Session Modal */}
      {isPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#131315]/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-[#242426]/50 pb-3">
              <Coffee className="w-5 h-5 text-purple-400" />
              Plan a Study Session
            </h3>
            
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Study Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Memory Strides, RAG pipelines"
                  value={plannerTopic}
                  onChange={(e) => setPlannerTopic(e.target.value)}
                  className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Duration</label>
                  <select
                    value={plannerDuration}
                    onChange={(e) => setPlannerDuration(e.target.value)}
                    className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                  >
                    <option value="25m">25 Minutes</option>
                    <option value="50m">50 Minutes</option>
                    <option value="90m">90 Minutes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Mood / Friction</label>
                  <select
                    value={plannerMood}
                    onChange={(e) => setPlannerMood(e.target.value)}
                    className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-255 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                  >
                    <option value="Low energy / Tired">Low energy / Tired</option>
                    <option value="Anxious about starting">Anxious about starting</option>
                    <option value="Overwhelmed by scope">Overwhelmed by scope</option>
                    <option value="Focused & Ready">Focused & Ready</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-[#242426]/50">
                <button
                  type="button"
                  onClick={() => setIsPlannerOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-350 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 transition-all"
                >
                  Generate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teach Companion Modal */}
      {isTeachOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#131315]/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-[#242426]/50 pb-3">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Teach Companion (Feynman Technique)
            </h3>
            
            <form onSubmit={handleTeachSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Select Topic</label>
                <select
                  value={teachTopic}
                  onChange={(e) => setTeachTopic(e.target.value)}
                  className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                >
                  <option value="Contiguous Tensors">Contiguous Tensors</option>
                  <option value="Spaced Repetition">Spaced Repetition</option>
                  <option value="RAG Vector Databases">RAG Vector Databases</option>
                  <option value="Azure Content Safety">Azure Content Safety</option>
                  <option value="Backpropagation">Backpropagation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Your Explanation</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain this concept in your own words as if teaching a peer..."
                  value={teachExplanation}
                  onChange={(e) => setTeachExplanation(e.target.value)}
                  className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-[#242426]/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsTeachOpen(false);
                    setTeachExplanation('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-355 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 transition-all"
                >
                  Submit Explanation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Get Mnemonic Modal */}
      {isMnemonicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#131315]/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-[#242426]/50 pb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              Get Study Mnemonic
            </h3>
            
            <form onSubmit={handleMnemonicSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Concept to Remember</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Stride formula, MCTS phases, pgvector"
                  value={mnemonicConcept}
                  onChange={(e) => setMnemonicConcept(e.target.value)}
                  className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Mnemonic Style</label>
                <select
                  value={mnemonicStyle}
                  onChange={(e) => setMnemonicStyle(e.target.value)}
                  className="w-full bg-[#1e1e22]/90 border border-[#2b2b2d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                >
                  <option value="Funny Analogy">Funny Analogy</option>
                  <option value="Acronym Mnemonic">Acronym Mnemonic</option>
                  <option value="Visual Memory Palace">Visual Memory Palace</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-[#242426]/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsMnemonicOpen(false);
                    setMnemonicConcept('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#242426] border border-[#2b2b2d] hover:bg-slate-800 text-slate-355 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 transition-all"
                >
                  Get Mnemonic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companion Memory Panel */}
      <CompanionMemoryPanel
        isOpen={memoryPanelOpen}
        onClose={() => setMemoryPanelOpen(false)}
      />
    </div>
  );
}
