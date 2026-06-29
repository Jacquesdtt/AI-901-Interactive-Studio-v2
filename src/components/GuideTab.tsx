import React, { useState } from 'react';
import { BookOpen, ShieldAlert, CheckCircle, Search, HelpCircle, Layers, Sparkles, Brain, Eye, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';

interface DomainContent {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  topics: { name: string; desc: string; detail: string }[];
  keyTerms: string[];
}

export default function GuideTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const domains: DomainContent[] = [
    {
      id: 'domain1',
      title: 'Domain 1: Artificial Intelligence Workloads & Principles',
      badge: '15-20% of exam',
      icon: <Brain className="w-5 h-5 text-teal-400" />,
      summary: 'Covers core AI workloads (Prediction, Anomaly Detection, CV, NLP, Conversational AI) and the six foundational Microsoft Responsible AI Principles.',
      topics: [
        {
          name: "Fairness",
          desc: "AI systems should treat all people fairly.",
          detail: "Ensure that system outputs do not exhibit bias based on gender, ethnicity, or group traits. (e.g., An automated recruiting agent must grade resumes equally regardless of applicant demographics)."
        },
        {
          name: "Reliability & Safety",
          desc: "AI systems must perform reliably and safely.",
          detail: "A systems must withstand malicious attacks, edge cases, and unexpected inputs. Includes rigorous testing before deployments. (e.g., Collision avoidance systems in self-driving cars)."
        },
        {
          name: "Privacy & Security",
          desc: "AI systems must be secure and respect privacy.",
          detail: "Data sources used to train models must comply with safety regulations (GDPR, HIPAA). Data-plane security includes Entra ID access controls and encryption."
        },
        {
          name: "Inclusiveness",
          desc: "AI systems should empower everyone and engage people.",
          detail: "Designs should be highly accessible to individuals with diverse physical or cognitive capabilities. (e.g., Adding automated live-captions to voice software)."
        },
        {
          name: "Transparency",
          desc: "AI systems should be understandable.",
          detail: "Users must be fully aware when they are interacting with an AI system, and the algorithms should have high interpretability. (e.g., Disclosing the use of bots)."
        },
        {
          name: "Accountability",
          desc: "People should be accountable for AI systems.",
          detail: "Human-in-the-loop validation ensures that final outcomes have human oversight and governance. Designers and developers hold liability for system behaviors."
        }
      ],
      keyTerms: ['Responsible AI', 'Fairness', 'Reliability', 'Transparency', 'Inclusiveness', 'Anomaly Detection']
    },
    {
      id: 'domain2',
      title: 'Domain 2: Machine Learning Principles',
      badge: '30-35% of exam',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      summary: 'Core terminology of predictive modeling: regression (continuous values), classification (categorical), clustering (grouping), supervised and unsupervised paradigms.',
      topics: [
        {
          name: "Supervised Learning",
          desc: "Training with labeled historical data.",
          detail: "Includes Regression (predicting numbers, e.g., real estate value) and Classification (predicting classes, e.g., spam vs ham email)."
        },
        {
          name: "Unsupervised Learning",
          desc: "Training with unlabeled raw data to find hidden structures.",
          detail: "Includes Clustering algorithms (e.g., K-Means) which group similar items together without pre-existing human tags (e.g., customer segmentation)."
        },
        {
          name: "Feature Engineering",
          desc: "Selecting and modifying input columns.",
          detail: "Selecting, cleaning, and transforming data attributes to boost model performance during the training phase."
        }
      ],
      keyTerms: ['Regression', 'Classification', 'Clustering', 'Labels', 'Features', 'Validation Set']
    },
    {
      id: 'domain3',
      title: 'Domain 3: Computer Vision Workloads',
      badge: '15-20% of exam',
      icon: <Eye className="w-5 h-5 text-teal-400" />,
      summary: 'Focuses on visual cognitive capabilities including object detection, semantic segmentation, facial analysis, OCR, and spatial intelligence.',
      topics: [
        {
          name: "Image Classification",
          desc: "Determining what main item is in an image.",
          detail: "Outputs a single tag or category for the entire image (e.g., 'This is a dog')."
        },
        {
          name: "Object Detection",
          desc: "Locating and categorizing multiple items in an image.",
          detail: "Identifies the classification label AND outputs pixel coordinates (bounding boxes) for each item found."
        },
        {
          name: "Semantic Segmentation",
          desc: "Classifying individual pixels in an image.",
          detail: "Color-codes pixels to represent separate object masks (e.g., separating road, sky, and sidewalk pixels in autonomous driving feeds)."
        },
        {
          name: "OCR & Read API",
          desc: "Optical Character Recognition.",
          detail: "Extracts handwritten and typed text from papers, PDFs, billboards, or photos into clean string structures."
        }
      ],
      keyTerms: ['Object Detection', 'Bounding Box', 'OCR', 'Segmentation', 'Face Analysis']
    },
    {
      id: 'domain4',
      title: 'Domain 4: Natural Language Processing (NLP)',
      badge: '15-20% of exam',
      icon: <MessageSquare className="w-5 h-5 text-teal-400" />,
      summary: 'Analysing written text and audio feeds: keyphrase extraction, entity recognition, sentiment scoring, translation, and text-to-speech.',
      topics: [
        {
          name: "Keyphrase Extraction",
          desc: "Identifying main points of discussion.",
          detail: "Finds the core concepts or central words in long-form paragraphs to gauge the overall discussion topic."
        },
        {
          name: "Named Entity Recognition (NER)",
          desc: "Identifying people, dates, organizations, and places.",
          detail: "Categorizes nouns into predefined structures (e.g., recognizing 'Satya Nadella' as Person, 'Microsoft' as Organization)."
        },
        {
          name: "Sentiment Analysis",
          desc: "Gauging the emotional tone of text input.",
          detail: "Returns score probabilities ranging from 0.0 (highly negative) to 1.0 (highly positive) to assess user feedback."
        }
      ],
      keyTerms: ['NER', 'Sentiment Score', 'Keyphrase Extraction', 'Speech Synthesis', 'Translation']
    },
    {
      id: 'domain5',
      title: 'Domain 5: Generative AI Workloads',
      badge: '10-15% of exam',
      icon: <Sparkles className="w-5 h-5 text-teal-400" />,
      summary: 'Modern large language models, Azure OpenAI studio capabilities, prompting concepts, and orchestration agents.',
      topics: [
        {
          name: "Large Language Models (LLMs)",
          desc: "Deep learning models trained on trillions of words.",
          detail: "Predicts the next most probable word (token) in a sequence, generating cohesive human-like text."
        },
        {
          name: "Prompt Engineering",
          desc: "Crafting effective queries to guide LLM output.",
          detail: "Leveraging strategies like Zero-Shot, Few-Shot (providing examples), and System instructions to direct model output."
        },
        {
          name: "Copilots & Agents",
          desc: "Orchestration layers wrapping LLM cores.",
          detail: "Extending models with state (threads), security boundaries, and API integrations to automate tasks on behalf of users."
        }
      ],
      keyTerms: ['Tokens', 'System Message', 'Few-Shot Learning', 'Azure OpenAI', 'Agent Orchestration']
    }
  ];

  // Misconception Matrix Data
  const misconceptions = [
    {
      concept: "AI-901 Exam Theory",
      reality: "Enterprise AI Engineering Reality",
      description: "How theoretical Azure service limits compare to real-world cloud deployment architectures.",
      icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
      badge: "Architecture & SDK"
    },
    {
      concept: "Authentication via hardcoded tokens is fine for fast testing.",
      reality: "Zero-Trust: You must use DefaultAzureCredential & Entra ID.",
      description: "Passwords expire and leak. Modern Azure SDKs enforce passwordless tokens directly mapped to Managed Identities.",
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      badge: "Security"
    },
    {
      concept: "The LLM retains your conversation state inside its brain.",
      reality: "The LLM is stateless. Conversation state is managed by Cloud Threads.",
      description: "LLMs do not store memories between API requests. You must send historical data or rely on Azure AI Foundry Thread instances.",
      icon: <HelpCircle className="w-5 h-5 text-teal-400" />,
      badge: "Orchestration"
    },
    {
      concept: "Code Interpreter sandboxes are full virtual machines running continuously.",
      reality: "Sandboxes are lightweight, short-lived micro-containers.",
      description: "Azure launches isolated, ephemeral workspaces on-the-fly to execute the generated code and kills them immediately to save costs.",
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      badge: "Compute"
    },
    {
      concept: "Responsible AI is a simple legal disclaimer checklist at the end of a project.",
      reality: "Responsible AI requires active code-level guardrails, filters, and feedback loops.",
      description: "Azure Content Safety and prompt templates actively block toxic payloads and prompt injection at runtime.",
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      badge: "Governance"
    }
  ];

  const filteredDomains = domains.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.topics.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.detail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDomain = selectedDomain === 'all' || d.id === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="ai901-guide-tab">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-mono text-sm mb-1">
            <BookOpen className="w-4 h-4 animate-pulse" />
            <span>EXAM COMPANION & CERTIFICATION GUIDE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Microsoft AI-901 Study Guide
          </h1>
          <p className="text-slate-400 mt-1 max-w-3xl">
            A comprehensive curriculum and comparison matrix mapping Microsoft's formal AI-901 examination objectives directly to raw cloud execution realities.
          </p>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#121216] border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-sm text-slate-100 focus:outline-none focus:border-teal-500 w-56 transition-all"
            />
          </div>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-[#121216] border border-white/10 rounded-md py-1.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="domain1">Domain 1 (Responsible AI)</option>
            <option value="domain2">Domain 2 (Machine Learning)</option>
            <option value="domain3">Domain 3 (Computer Vision)</option>
            <option value="domain4">Domain 4 (NLP)</option>
            <option value="domain5">Domain 5 (Generative AI)</option>
          </select>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Domains */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full uppercase font-bold border border-teal-500/30 shadow-[0_0_10px_rgba(45,212,191,0.2)]">Curriculum Domains</span>
            <span className="text-sm text-slate-400">Objectives & Deep Dives</span>
          </div>

          {filteredDomains.length === 0 ? (
            <div className="bg-[#121216] border border-white/10 rounded-lg p-8 text-center">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No curriculum domains matched your active search filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedDomain('all'); }} 
                className="text-teal-400 text-xs hover:underline mt-2"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredDomains.map((domain) => (
              <div key={domain.id} className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all hover:border-teal-500/30">
                {/* Domain Header */}
                <div className="p-5 border-b border-white/5 bg-[#121218] flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      {domain.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">{domain.title}</h2>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">{domain.summary}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-teal-400 bg-teal-500/15 border border-teal-500/20 px-2.5 py-0.5 rounded-md shrink-0">
                    {domain.badge}
                  </span>
                </div>

                {/* Topics Accordion Grid */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Key Testable Concepts (Click to expand technical details)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {domain.topics.map((topic, idx) => {
                      const isExpanded = expandedTopic === `${domain.id}-${idx}`;
                      return (
                        <div 
                          key={idx}
                          onClick={() => setExpandedTopic(isExpanded ? null : `${domain.id}-${idx}`)}
                          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 select-none ${
                            isExpanded 
                              ? 'bg-teal-950/20 border-teal-500/40 shadow-sm shadow-teal-500/5' 
                              : 'bg-[#121216] border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-200">{topic.name}</span>
                            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                              {isExpanded ? 'Hide Specs' : 'View Specs'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{topic.desc}</p>
                          
                          {isExpanded && (
                            <div className="mt-3 pt-2.5 border-t border-teal-500/20 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                              <p className="leading-relaxed bg-[#0a0a0c] p-2 rounded border border-teal-500/10">{topic.detail}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tags Footer */}
                <div className="px-5 py-3.5 bg-[#121217]/50 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-slate-500 mr-2 uppercase">Tags:</span>
                  {domain.keyTerms.map((term, i) => (
                    <span key={i} className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      #{term}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Column: Additional Tools & Matrices */}
        <div className="space-y-6">
          
          {/* AI Service Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase font-semibold">Service Selector</span>
              <span className="text-sm text-slate-400">Choose the Right Tool</span>
            </div>
            <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-5 space-y-5 shadow-lg">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Service Selector Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The exam tests your ability to differentiate between similar-sounding services, particularly the new AI-901 additions vs. legacy tools.
                </p>
              </div>

              <div className="space-y-4">
                {/* Content Understanding */}
                <div className="p-4 bg-[#121216] rounded-lg border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-blue-300">Content Understanding</h4>
                  <p className="text-xs text-slate-400">Extracts structured data from documents, forms, images, and audio/video.</p>
                  <div className="flex flex-col gap-1 mt-2 text-xs font-mono">
                    <span className="text-emerald-400">✓ USE FOR: Processing multi-modal documents, invoices, receipts.</span>
                    <span className="text-rose-400">✗ DO NOT USE FOR: Legacy Form Recognizer tasks (it replaced it).</span>
                  </div>
                </div>

                {/* Azure Speech vs Language */}
                <div className="p-4 bg-[#121216] rounded-lg border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-blue-300">Azure Speech vs. Language</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/5 p-2 rounded">
                      <strong className="text-xs text-slate-200">Speech</strong>
                      <p className="text-[10px] text-slate-400 mt-1">Text-to-speech, speech-to-text transcription.</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <strong className="text-xs text-slate-200">Language</strong>
                      <p className="text-[10px] text-slate-400 mt-1">Keyword extraction, entity detection, sentiment analysis.</p>
                    </div>
                  </div>
                </div>

                {/* Multimodal Models */}
                <div className="p-4 bg-[#121216] rounded-lg border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-blue-300">General Multimodal Models</h4>
                  <p className="text-xs text-slate-400">Foundation models capable of processing both text and images natively.</p>
                  <div className="flex flex-col gap-1 mt-2 text-xs font-mono">
                    <span className="text-emerald-400">✓ USE FOR: Answering questions about an image or visual reasoning.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase font-semibold">Expose Fallacies</span>
              <span className="text-sm text-slate-400">AI-901 vs. Reality Matrix</span>
            </div>
          </div>

          <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-5 space-y-5 shadow-lg">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-400" />
                Common Exam Misconceptions
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparing simplified theoretical questions inside the exam with absolute cloud deployment engineering realities.
              </p>
            </div>

            <div className="space-y-4">
              {misconceptions.map((item, index) => (
                <div key={index} className="p-4 bg-[#121216] rounded-lg border border-white/5 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-all duration-300" />
                  
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <span>#0{index + 1}</span>
                    </div>
                  </div>

                  {/* Theoretical block */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Theoretical Misconception:
                    </div>
                    <p className="text-sm font-semibold text-rose-300/90 pl-3 border-l border-rose-500/30">
                      &quot;{item.concept}&quot;
                    </p>
                  </div>

                  {/* Reality block */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Cloud Reality:
                    </div>
                    <p className="text-sm font-bold text-emerald-400 pl-3 border-l border-emerald-400/30">
                      {item.reality}
                    </p>
                  </div>

                  {/* Description breakdown */}
                  <p className="text-xs text-slate-400 leading-relaxed pt-1.5 border-t border-white/5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
