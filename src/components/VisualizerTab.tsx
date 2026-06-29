import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  FastForward,
  Info,
  RotateCcw,
  AlertOctagon,
  Terminal,
  ShieldAlert,
  Cpu,
  Layers,
  HelpCircle,
  FileCode2,
  FolderOpen,
  Settings,
  CheckCircle2,
  Flame,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { STEPS_DATA } from "../data/stepsData";
import { ChaosState, ExecutionStep } from "../types";

export default function VisualizerTab() {
  // Navigation & View States
  const [activeView, setActiveView] = useState<"infrastructure" | "pipeline">(
    "infrastructure",
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<
    ".env" | "app.py" | "agent_client.py" | "requirements.txt"
  >("app.py");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 1x, 1.5x, 2x, 0.5x
  const [activeSubTab, setActiveSubTab] = useState<
    "files" | "code" | "telemetry"
  >("code");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [chaos, setChaos] = useState<ChaosState>({
    latency: false,
    invalidApiKey: false,
    corruptUri: false,
  });

  // Fullscreen isolated node selection
  const [selectedFullscreenNodeId, setSelectedFullscreenNodeId] = useState<
    string | null
  >(null);

  // Modal / Deep Dive Node State
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [deepDiveTab, setDeepDiveTab] = useState<"overview" | "component" | "state" | "implementation">("overview");

  // Layout Sizing States (Resizable columns/rows)
  const [fileTreeWidth, setFileTreeWidth] = useState<number>(240);
  const [diagramHeight, setDiagramHeight] = useState<number>(240);
  const [monitorHeight, setMonitorHeight] = useState<number>(250);

  // Dragging Ref States
  const [isDraggingFileTree, setIsDraggingFileTree] = useState<boolean>(false);
  const [isDraggingDiagram, setIsDraggingDiagram] = useState<boolean>(false);
  const [isDraggingMonitor, setIsDraggingMonitor] = useState<boolean>(false);

  // Expanded Widget Focus States (for maximizing widgets)
  const [expandedWidget, setExpandedWidget] = useState<
    "diagram" | "code" | "terminal" | null
  >(null);

  useEffect(() => {
    if (expandedWidget !== "diagram") {
      setSelectedFullscreenNodeId(null);
    }
  }, [expandedWidget]);

  // Global Zoom/Enlarged Scale State
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);

  // Adjust widget sizes when global scale toggled
  useEffect(() => {
    if (isEnlarged) {
      setDiagramHeight(340);
      setMonitorHeight(240);
      setFileTreeWidth(280);
    } else {
      setDiagramHeight(240);
      setMonitorHeight(180);
      setFileTreeWidth(240);
    }
  }, [isEnlarged]);

  // Coordinates Mapping for 2D branching and layered layouts
  const getNodeCoords = (nodeId: string) => {
    // We define top and left in percentages, and compute cx/cy based on 1000x300 viewBox
    const defs: Record<string, { top: number; left: number }> = {
      // Service Infrastructure
      user: { top: 40, left: 8 },
      fastapi: { top: 40, left: 20 },
      agent_client: { top: 40, left: 32 },
      entra: { top: 75, left: 32 },
      gateway: { top: 40, left: 50 },
      agent_service: { top: 40, left: 70 },
      sandbox: { top: 40, left: 88 },

      // Pipeline Logic
      usr: { top: 25, left: 12 },
      fe: { top: 25, left: 32 },
      pyapp: { top: 25, left: 52 },
      pyd: { top: 25, left: 72 },
      sdk: { top: 75, left: 52 },
      http: { top: 75, left: 72 },
      az: { top: 75, left: 90 },
      llm: { top: 25, left: 90 },
    };

    const d = defs[nodeId] || { top: 50, left: 50 };
    return {
      top: `${d.top}%`,
      left: `${d.left}%`,
      cx: (d.left / 100) * 1000,
      cy: (d.top / 100) * 300,
    };
  };

  // Terminal Logs State
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const fileTreeRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);

  const activeStep: ExecutionStep = STEPS_DATA[currentStepIndex];

  // Sync selected file to the active step's file when the step changes
  useEffect(() => {
    setSelectedFile(activeStep.file);
  }, [currentStepIndex]);

  // Initialise logs
  useEffect(() => {
    setLiveLogs([...activeStep.logs]);
  }, [currentStepIndex]);

  // Autoplay Scrubber Engine
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const delay = (chaos.latency ? 4000 : 2000) / playSpeed;
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= STEPS_DATA.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playSpeed, chaos.latency]);

  // Handle Chaos Events Logging
  const toggleChaos = (type: keyof ChaosState) => {
    setChaos((prev) => {
      const nextState = { ...prev, [type]: !prev[type] };

      // Inject alert logs
      if (nextState[type]) {
        let warningLog = "";
        if (type === "latency") {
          warningLog = `[WARN] CHAOS ACTIVATED: Injecting high network latency. Packet delivery delayed by 4000ms.`;
        } else if (type === "invalidApiKey") {
          warningLog = `[FATAL] CHAOS ACTIVATED: Injecting API Key corruption. Authentication tokens will reject with HTTP 401 Unauthorized.`;
        } else if (type === "corruptUri") {
          warningLog = `[CRITICAL] CHAOS ACTIVATED: Injecting URI corruption. Request routes will fail with HTTP 404 Endpoint Not Found.`;
        }
        setLiveLogs((prevLogs) => [...prevLogs, warningLog]);
      } else {
        setLiveLogs((prevLogs) => [
          ...prevLogs,
          `[INFO] CHAOS SOLVED: Restored default Azure Project Client status.`,
        ]);
      }

      return nextState;
    });
  };

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveLogs]);

  // Resize Drag Handlers (Mouse movement tracking)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingFileTree && fileTreeRef.current) {
        const rect = fileTreeRef.current.getBoundingClientRect();
        const newWidth = Math.max(160, Math.min(400, e.clientX - rect.left));
        setFileTreeWidth(newWidth);
      }
      if (isDraggingDiagram && diagramRef.current) {
        const rect = diagramRef.current.getBoundingClientRect();
        const newHeight = Math.max(150, Math.min(800, e.clientY - rect.top));
        setDiagramHeight(newHeight);
      }
      if (isDraggingMonitor && monitorRef.current) {
        // We calculate height relative to the TOP of the monitor to avoid shifting issues when resizing from top.
        // Wait, the drag handle is at the TOP of the monitor, so moving mouse down decreases height.
        // Therefore, monitor bottom is static, drag handle is at `rect.top`.
        const rect = monitorRef.current.getBoundingClientRect();
        const newHeight = Math.max(100, Math.min(800, rect.bottom - e.clientY));
        setMonitorHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingFileTree(false);
      setIsDraggingDiagram(false);
      setIsDraggingMonitor(false);
    };

    if (isDraggingFileTree || isDraggingDiagram || isDraggingMonitor) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingFileTree, isDraggingDiagram, isDraggingMonitor]);

  // Define Nodes for diagrams
  const infraNodes = [
    {
      id: "user",
      label: "User Client",
      type: "user",
      spec: "Represents the human operator sending natural language prompts.",
      analogy: "The customer lodging a complaint.",
      misconception:
        "Users talk to the LLM directly; reality is they talk to intermediate application microservices.",
    },
    {
      id: "fastapi",
      label: "FastAPI Server",
      type: "app",
      spec: "A gateway backend serving HTTP assets.",
      analogy: "The front desk receptionist.",
      misconception:
        "A client script acts as a sovereign database; reality is it proxies credentials safely via FastAPI routes.",
    },
    {
      id: "agent_client",
      label: "Agent Client",
      type: "app",
      spec: "Instantiates connection string objects.",
      analogy: "The supervisor assigned to coordinate the request.",
      misconception:
        "Azure Project Clients run full LLMs locally; reality is they are just thin SDK wrapper libraries.",
    },
    {
      id: "entra",
      label: "Entra ID Auth",
      type: "auth",
      spec: "Unified directory and security access management.",
      analogy: "Security checkpoints checking identity cards.",
      misconception:
        "API keys are optimal for enterprise safety; reality is passwordless Entra ID is standard.",
    },
    {
      id: "gateway",
      label: "AI Gateway",
      type: "gateway",
      spec: "Azure API regional endpoints routing requests safely.",
      analogy: "The head office router directing departments.",
      misconception:
        "Requests bypass firewall checks; reality is gateway monitors throughput rates.",
    },
    {
      id: "agent_service",
      label: "Agent Service",
      type: "service",
      spec: "Sovereign orchestrator directing thread states.",
      analogy: "The planner organizing the solution booklet.",
      misconception:
        "Agents operate without state; reality is they maintain cloud-side thread context.",
    },
    {
      id: "sandbox",
      label: "Code Sandbox",
      type: "sandbox",
      spec: "Ephemeral multitenant container executing dynamic python.",
      analogy: "A secured isolated testing laboratory.",
      misconception:
        "Code sandboxes have infinite storage; reality is they are recycled immediately.",
    },
  ];

  const pipelineNodes = [
    {
      id: "usr",
      label: "User Trigger",
      type: "user",
      spec: "User inputs question.",
      analogy: "Asking a teacher.",
      misconception: "LLMs parse queries manually.",
    },
    {
      id: "fe",
      label: "Frontend UI",
      type: "app",
      spec: "React/TypeScript dynamic interface.",
      analogy: "The blackboard.",
      misconception: "Frontend has direct access to database secrets.",
    },
    {
      id: "pyapp",
      label: "Python App",
      type: "app",
      spec: "Script orchestrator loading .env configs.",
      analogy: "The project manager.",
      misconception: "Code can be modified at runtime.",
    },
    {
      id: "pyd",
      label: "Pydantic Model",
      type: "validation",
      spec: "Type validation schemas.",
      analogy: "The blueprint inspector.",
      misconception: "Invalid API formats fail gracefully by default.",
    },
    {
      id: "sdk",
      label: "OpenAI SDK",
      type: "library",
      spec: "Transports credentials into protocol objects.",
      analogy: "The courier truck.",
      misconception: "SDK operates peer-to-peer.",
    },
    {
      id: "http",
      label: "HTTP Client",
      type: "transport",
      spec: "Axios or Requests posting packets.",
      analogy: "The postal service.",
      misconception: "WebSockets are the only way to manage agent telemetry.",
    },
    {
      id: "az",
      label: "Azure Services",
      type: "service",
      spec: "The unified Cloud Run or App Service host.",
      analogy: "The entire school.",
      misconception: "Services operate within a single shared virtual space.",
    },
    {
      id: "llm",
      label: "GPT LLM API",
      type: "llm",
      spec: "The target predictive model core.",
      analogy: "The omniscient central database.",
      misconception: "Models think. They just perform probability predictions.",
    },
  ];

  // Explicit connections for views
  const infraConnections = [
    { source: "user", target: "fastapi", type: "http" },
    { source: "fastapi", target: "agent_client", type: "internal" },
    { source: "agent_client", target: "entra", type: "auth" },
    { source: "agent_client", target: "gateway", type: "api" },
    { source: "gateway", target: "agent_service", type: "api" },
    { source: "agent_service", target: "sandbox", type: "sandbox" },
  ];

  const pipelineConnections = [
    { source: "usr", target: "fe", type: "ui" },
    { source: "fe", target: "pyapp", type: "http" },
    { source: "pyapp", target: "pyd", type: "validation" },
    { source: "pyapp", target: "sdk", type: "lib" },
    { source: "sdk", target: "http", type: "transport" },
    { source: "http", target: "az", type: "api" },
    { source: "az", target: "llm", type: "llm" },
  ];

  const activeNodes =
    activeView === "infrastructure" ? infraNodes : pipelineNodes;
  const activeConnections =
    activeView === "infrastructure" ? infraConnections : pipelineConnections;

  // Active highlighted connection mapping for 10 steps to show active packet location
  const getActiveConnection = (): { source: string; target: string } | null => {
    if (activeView === "infrastructure") {
      if (currentStepIndex === 0) return { source: "user", target: "fastapi" };
      if (currentStepIndex === 1)
        return { source: "agent_client", target: "entra" };
      if (currentStepIndex >= 2 && currentStepIndex <= 6)
        return { source: "agent_client", target: "gateway" };
      if (currentStepIndex === 7)
        return { source: "agent_service", target: "sandbox" };
      if (currentStepIndex === 8)
        return { source: "agent_client", target: "gateway" };
      if (currentStepIndex === 9)
        return { source: "gateway", target: "agent_service" };
      return null;
    } else {
      if (currentStepIndex === 0) return { source: "fe", target: "pyapp" };
      if (currentStepIndex === 1) return { source: "pyapp", target: "sdk" };
      if (currentStepIndex === 2) return { source: "sdk", target: "http" };
      if (currentStepIndex >= 3 && currentStepIndex <= 5)
        return { source: "http", target: "az" };
      if (currentStepIndex === 6) return { source: "az", target: "llm" };
      if (currentStepIndex === 7) return { source: "az", target: "llm" };
      if (currentStepIndex === 8) return { source: "http", target: "az" };
      if (currentStepIndex === 9) return { source: "pyapp", target: "fe" }; // Return to FE
      return null;
    }
  };

  const activeConnection = getActiveConnection();
  const getActiveNodeIndex = (): number => {
    if (activeView === "infrastructure") {
      if (currentStepIndex === 0) return 0; // User
      if (currentStepIndex === 1) return 3; // Entra ID
      if (currentStepIndex === 2) return 2; // Agent Client
      if (currentStepIndex === 3) return 5; // Agent Service
      if (currentStepIndex === 4) return 5; // Agent Service
      if (currentStepIndex === 5) return 4; // Gateway
      if (currentStepIndex === 6) return 5; // Agent Service
      if (currentStepIndex === 7) return 6; // Code Sandbox
      if (currentStepIndex === 8) return 2; // Agent Client
      return 5; // Response
    } else {
      if (currentStepIndex === 0) return 2; // Python App
      if (currentStepIndex === 1) return 4; // OpenAI SDK
      if (currentStepIndex === 2) return 6; // Azure Services
      if (currentStepIndex === 3) return 6;
      if (currentStepIndex === 4) return 1; // Frontend
      if (currentStepIndex === 5) return 6;
      if (currentStepIndex === 6) return 7; // LLM API
      if (currentStepIndex === 7) return 7;
      if (currentStepIndex === 8) return 6;
      return 1; // Frontend
    }
  };

  const activeNodeIdx = getActiveNodeIndex();
  const activeNode = activeNodes[activeNodeIdx] || activeNodes[0];

  let displayNodeIdx = activeNodeIdx;
  if (expandedWidget === "diagram" && selectedFullscreenNodeId) {
    const idx = activeNodes.findIndex((n) => n.id === selectedFullscreenNodeId);
    if (idx !== -1) displayNodeIdx = idx;
  }
  const displayNode = activeNodes[displayNodeIdx] || activeNodes[0];

  const renderScrubber = () => (
    <div
      className="bg-[#111116] border-t border-white/10 px-6 py-3 flex flex-col gap-2.5 select-none shrink-0"
      id="scrubber-timeline-bar"
    >
      {/* Scrubber controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded border border-teal-500/20 transition-all flex items-center gap-1"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              {isPlaying ? "PAUSE" : "PLAY"}
            </span>
          </button>
          <div className="flex items-center bg-[#181820] border border-white/5 rounded px-2 py-1">
            <span className="text-[10px] font-mono text-slate-500 mr-1.5">
              Speed:
            </span>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(parseFloat(e.target.value))}
              className="bg-transparent border-none text-[11px] font-mono text-teal-400 focus:outline-none cursor-pointer"
            >
              <option value="0.5">0.5x (Slow)</option>
              <option value="1">1.0x (Normal)</option>
              <option value="1.5">1.5x (Fast)</option>
              <option value="2">2.0x (Turbo)</option>
            </select>
          </div>
        </div>

        {/* Active File Pulse Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Running script:
          </span>
          <span className="bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse block" />
            {activeStep.file}
          </span>
        </div>
      </div>

      {/* Scrubber slider range */}
      <div className="w-full">
        <input
          type="range"
          min="0"
          max={STEPS_DATA.length - 1}
          value={currentStepIndex}
          onChange={(e) => {
            setCurrentStepIndex(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-1.5 bg-[#1e1e24] rounded-lg appearance-none cursor-pointer accent-teal-400 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${(currentStepIndex / (STEPS_DATA.length - 1)) * 100}%, #1e1e24 ${(currentStepIndex / (STEPS_DATA.length - 1)) * 100}%, #1e1e24 100%)`,
          }}
        />
      </div>

      {/* Step Ticks Row */}
      <div className="flex justify-between text-center overflow-x-auto gap-2">
        {STEPS_DATA.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 min-w-[40px] text-left focus:outline-none transition-all ${
                isCurrent
                  ? "text-teal-400 opacity-100 font-bold scale-105"
                  : isPassed
                    ? "text-teal-300/60 opacity-80"
                    : "text-slate-500 opacity-60 hover:opacity-90"
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-mono bg-white/5 w-4 h-4 rounded-full flex items-center justify-center border ${
                    isCurrent
                      ? "border-teal-400 bg-teal-500/10"
                      : "border-white/5"
                  }`}
                >
                  {step.id}
                </span>

                {isCurrent && (
                  <span className="text-[10px] font-semibold truncate uppercase tracking-tight hidden lg:inline-block max-w-[120px]">
                    {step.title.split(". ")[1] || step.title}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDiagramMap = (isLarge: boolean = false) => {
    // node dimensions
    const nodeWidthClasses = isLarge ? "w-32 md:w-36" : "w-28 md:w-32";
    const nodeHeightClasses = isLarge ? "h-[80px]" : "h-[68px]";
    // roughly half width for horizontal edge, half height for vertical edge
    const padding = isLarge ? 65 : 55;

    // marker sizing
    const markerSuffix = isLarge ? "-lg" : "";
    const strokeW = isLarge ? 4 : 1.8;
    const packetR = isLarge ? 8 : 6;
    const textSz = isLarge ? "11" : "10";

    return (
      <div
        className={`relative w-full ${isLarge ? "h-[500px]" : "h-full min-h-[300px]"} min-w-[900px] border border-white/5 bg-[#09090d] rounded-2xl p-6 shadow-inner flex items-center justify-around overflow-x-auto`}
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Visual Boundary Zones / Background Group Labels */}
        {activeView === "infrastructure" ? (
          <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-6 py-4">
            <div className="w-[38%] border border-dashed border-white/5 rounded-2xl bg-white/2 flex flex-col justify-end p-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Client &amp; Web Zone
              </span>
            </div>
            <div className="w-[20%] border border-dashed border-white/5 rounded-2xl bg-white/2 flex flex-col justify-end p-3 mx-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold text-center">
                Auth Gateway
              </span>
            </div>
            <div className="w-[38%] border border-dashed border-white/5 rounded-2xl bg-white/2 flex flex-col justify-end p-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold text-right">
                Azure Stateful Compute
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between py-4 px-6">
            <div className="h-[46%] border-b border-dashed border-white/5 bg-white/2 flex items-center pl-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Host Script Interaction Layer
              </span>
            </div>
            <div className="h-[50%] bg-white/2 flex items-end pl-3 pb-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Azure SDK Client Cores
              </span>
            </div>
          </div>
        )}

        {/* Dynamic SVG Connection Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id={`arrow-green${markerSuffix}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
            </marker>
            <marker
              id={`arrow-gray${markerSuffix}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.15)" />
            </marker>
            <marker
              id={`arrow-red${markerSuffix}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
            </marker>
          </defs>

          {activeConnections.map((conn, i) => {
            const c1 = getNodeCoords(conn.source);
            const c2 = getNodeCoords(conn.target);
            const isPassing =
              activeConnection?.source === conn.source &&
              activeConnection?.target === conn.target;
            const isBroken =
              isPassing && (chaos.invalidApiKey || chaos.corruptUri);

            // Calculate shortened line so arrows don't overlap with nodes
            const dx = c2.cx - c1.cx;
            const dy = c2.cy - c1.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Shorten the line from the center points by 'padding' radius
            const startX = dist > 0 ? c1.cx + (dx / dist) * padding : c1.cx;
            const startY = dist > 0 ? c1.cy + (dy / dist) * padding : c1.cy;
            const endX = dist > 0 ? c2.cx - (dx / dist) * padding : c2.cx;
            const endY = dist > 0 ? c2.cy - (dy / dist) * padding : c2.cy;

            return (
              <g key={`${conn.source}-${conn.target}`}>
                {/* Connection Line */}
                <path
                  d={`M ${startX} ${startY} L ${endX} ${endY}`}
                  stroke={
                    isPassing
                      ? isBroken
                        ? "#f87171"
                        : "#2dd4bf"
                      : "rgba(255,255,255,0.15)"
                  }
                  strokeWidth={isPassing ? strokeW : strokeW * 0.75}
                  strokeDasharray={isPassing ? "none" : "4 4"}
                  markerEnd={
                    isPassing
                      ? isBroken
                        ? `url(#arrow-red${markerSuffix})`
                        : `url(#arrow-green${markerSuffix})`
                      : `url(#arrow-gray${markerSuffix})`
                  }
                  className="transition-all duration-300"
                />

                {/* Interactive Animated Signal Packet */}
                {isPassing && !isBroken && (
                  <circle
                    r={packetR}
                    fill="#2dd4bf"
                    className="shadow-lg shadow-teal-500/50"
                  >
                    <animate
                      attributeName="cx"
                      from={startX}
                      to={endX}
                      dur={chaos.latency ? "4.5s" : "1.2s"}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      from={startY}
                      to={endY}
                      dur={chaos.latency ? "4.5s" : "1.2s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Shattered Packet Indicator under Failover */}
                {isPassing && isBroken && (
                  <g
                    transform={`translate(${(startX + endX) / 2}, ${(startY + endY) / 2})`}
                  >
                    <circle
                      r={packetR}
                      fill="#ef4444"
                      className="animate-ping"
                    />
                    <text
                      fill="#ef4444"
                      fontSize={textSz}
                      fontWeight="bold"
                      textAnchor="middle"
                      y="-15"
                      className="animate-bounce"
                    >
                      ⚡ BLOCKED
                    </text>
                    <line
                      x1="-5"
                      y1="-5"
                      x2="5"
                      y2="5"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <line
                      x1="5"
                      y1="-5"
                      x2="-5"
                      y2="5"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* 2D Nodes Placement Container */}
        <div className="absolute inset-0 z-20">
          {activeNodes.map((node, i) => {
            const isActive =
              activeConnection?.source === node.id ||
              activeConnection?.target === node.id;
            const isBroken =
              isActive && (chaos.invalidApiKey || chaos.corruptUri);
            const coords = getNodeCoords(node.id);

            const isSelected = isLarge && selectedFullscreenNodeId === node.id;

            let nodeBg = "bg-[#121217] border-white/10 text-slate-300";
            if (isActive) {
              nodeBg = isBroken
                ? "bg-red-950/50 border-red-500 text-red-200 shadow-xl shadow-red-500/40 animate-shake ring-2 ring-red-500/50"
                : "bg-teal-950/30 border-teal-500 text-teal-300 shadow-xl shadow-teal-500/40 ring-2 ring-teal-400/40";
            }
            if (isSelected) {
              nodeBg += " ring-2 ring-white/80 scale-105";
            }

            return (
              <div
                key={node.id}
                onClick={() => {
                  if (isLarge) {
                    setSelectedFullscreenNodeId(node.id);
                  } else {
                    setSelectedNode(node);
                  }
                }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  transform: "translate(-50%, -50%)",
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center cursor-pointer transition-all duration-300 hover:scale-105 select-none ${nodeWidthClasses} ${nodeHeightClasses} ${nodeBg}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? (isBroken ? "bg-red-500 animate-ping" : "bg-teal-400 animate-ping") : "bg-slate-600"}`}
                  />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Node {i + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold tracking-tight font-sans truncate w-full px-1">
                  {node.label}
                </h4>
                <p className="text-[9px] font-mono text-teal-400 mt-0.5 truncate w-full px-1 uppercase font-semibold">
                  {node.type}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col min-h-[900px] h-full bg-[#0a0a0c] text-slate-100 overflow-visible"
      id="visualizer-tab-workspace"
    >
      {/* ACTIVE CHAOS ALERT BANNER */}
      {(chaos.invalidApiKey || chaos.corruptUri || chaos.latency) && (
        <div className="bg-rose-950/40 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between gap-4 animate-pulse shrink-0">
          <div className="flex items-center gap-3">
            <AlertOctagon
              className={`w-5 h-5 ${chaos.invalidApiKey || chaos.corruptUri ? "text-rose-400 animate-bounce" : "text-amber-400 animate-pulse"}`}
            />
            <div className="text-xs">
              <span className="font-bold text-white uppercase tracking-wider font-mono mr-2">
                [SYSTEM ALERT:{" "}
                {chaos.invalidApiKey
                  ? "HTTP 401"
                  : chaos.corruptUri
                    ? "HTTP 404"
                    : "NET LATENCY"}
                ]
              </span>
              <span className="text-slate-300">
                {chaos.invalidApiKey &&
                  "Authentication token rejected. Security validation failed at Entra ID Node."}
                {chaos.corruptUri &&
                  "Request endpoint not found. Invalid route URI configuration detected."}
                {chaos.latency &&
                  "High network latency injected. Simulation execution delayed by 4000ms."}
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            <span>AI-901 Fault Test</span>
          </div>
        </div>
      )}

      {/* 1. TOP PANEL: DIAGRAM VIEW (Vertically Resizable) */}
      <div
        ref={diagramRef}
        style={{ height: `${diagramHeight}px` }}
        className="relative bg-[#0d0d11] border-b border-white/10 flex flex-col justify-between overflow-hidden select-none shrink-0"
      >
        {/* Diagram Headers */}
        <div className="px-4 py-3 bg-[#111116] border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-semibold">
              Diagram Stage
            </span>
            <div className="flex bg-[#181820] rounded-md p-0.5 border border-white/5">
              <button
                onClick={() => setActiveView("infrastructure")}
                className={`px-3 py-1 text-[11px] font-mono rounded font-medium transition-all ${
                  activeView === "infrastructure"
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Service Infrastructure
              </button>
              <button
                onClick={() => setActiveView("pipeline")}
                className={`px-3 py-1 text-[11px] font-mono rounded font-medium transition-all ${
                  activeView === "pipeline"
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Pipeline Logic
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Size Slider Indicator */}
            <button
              onClick={() => setIsEnlarged(!isEnlarged)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-all flex items-center gap-1 ${
                isEnlarged
                  ? "bg-teal-500/15 border-teal-500/30 text-teal-300"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
              }`}
              title="Globally magnify all visualizer widgets"
            >
              <span>Widget Size: {isEnlarged ? "Enlarged" : "Normal"}</span>
            </button>

            {/* Maximize Diagram Trigger */}
            <button
              onClick={() =>
                setExpandedWidget(
                  expandedWidget === "diagram" ? null : "diagram",
                )
              }
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200 transition-colors"
              title="Maximize Diagram to Fullscreen Focus"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Connected Node Map - 2D Coordinate Engine */}
        <div className="relative flex-1 overflow-x-auto overflow-y-hidden bg-[#08080b]">
          {renderDiagramMap(false)}
        </div>

        {/* Vertical Resize Handle */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setIsDraggingDiagram(true); }}
          className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-teal-500/20 transition-colors z-20 -translate-y-1"
        />
      </div>

      {/* 2. TIMELINE SCRUBBER (Fixed Height) */}
      {renderScrubber()}

      {/* 3. THREE COLUMN WORKSPACE (Flex, overflow hidden) */}
      <div
        className="flex flex-col md:flex-row flex-1 relative min-h-[600px]"
        id="three-column-workspace-layout"
      >
        {/* Mobile Viewports Navigation Sub-Tabs */}
        <div className="md:hidden bg-[#0d0d12] border-b border-white/10 flex p-1 shrink-0 z-10">
          <button
            onClick={() => setActiveSubTab("files")}
            className={`flex-1 py-2 text-center text-[10px] font-mono rounded font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 ${
              activeSubTab === "files"
                ? "bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📁 Files
          </button>
          <button
            onClick={() => setActiveSubTab("code")}
            className={`flex-1 py-2 text-center text-[10px] font-mono rounded font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 ${
              activeSubTab === "code"
                ? "bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💻 Code Trace
          </button>
          <button
            onClick={() => setActiveSubTab("telemetry")}
            className={`flex-1 py-2 text-center text-[10px] font-mono rounded font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 ${
              activeSubTab === "telemetry"
                ? "bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📊 Telemetry
          </button>
        </div>

        {/* COLUMN 1: FILE EXPLORER (Horizontally Resizable on Desktop) */}
        <div
          ref={fileTreeRef}
          style={{ width: isMobile ? "100%" : `${fileTreeWidth}px` }}
          className={`bg-[#0b0b0e] md:border-r border-white/10 flex-col justify-between overflow-hidden shrink-0 ${
            activeSubTab === "files" ? "flex flex-1" : "hidden"
          } md:flex`}
        >
          {/* File explorer listing */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="px-3.5 py-3 border-b border-white/5 flex items-center gap-2 text-slate-400">
              <FolderOpen className="w-4 h-4 text-teal-500" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider">
                WORKSPACE FILES
              </span>
            </div>

            <div className="p-2 space-y-1">
              {[
                { name: "app.py", type: "py", color: "text-blue-400" },
                { name: "agent_client.py", type: "py", color: "text-blue-400" },
                { name: ".env", type: "env", color: "text-amber-400" },
                {
                  name: "requirements.txt",
                  type: "txt",
                  color: "text-slate-400",
                },
              ].map((file) => {
                const isActiveFile = file.name === selectedFile;
                const isStepFile = file.name === activeStep.file;

                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name as any)}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors text-xs font-mono group ${
                      isActiveFile
                        ? "bg-teal-500/10 text-teal-300 border-l-2 border-teal-500 font-semibold"
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode2 className={`w-3.5 h-3.5 ${file.color}`} />
                      <span>{file.name}</span>
                    </div>

                    {isStepFile && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping shrink-0"
                        title="Active execution target"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 1 Footer: Exam Tips Badge */}
          <div className="p-3 border-t border-white/5 bg-[#101015]/80 space-y-2">
            <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[10px] font-bold">
              <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
              <span>AI-901 EXAM SPEC</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans line-clamp-4">
              {activeStep.examTip}
            </p>
          </div>

          {/* Horizontal Resize handle */}
          <div
            onMouseDown={(e) => { e.preventDefault(); setIsDraggingFileTree(true); }}
            className="hidden md:block absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize bg-white/5 hover:bg-teal-500/40 transition-colors z-20"
            style={{ left: `${fileTreeWidth - 4}px` }}
          />
        </div>

        {/* COLUMN 2: CODE CONTEXT VIEWER & METAPHOR PARSER (Flex-1) */}
        <div
          className={`flex-grow flex-col lg:flex-row overflow-hidden bg-[#070709] ${
            activeSubTab === "code" ? "flex flex-1" : "hidden"
          } md:flex`}
          id="code-context-engine"
        >
          {/* Left partition: Snippet Code Viewer */}
          <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0e0e12] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {selectedFile}{" "}
                  {selectedFile === activeStep.file
                    ? "(Active Step Source)"
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Python SDK v2
                </span>
                <button
                  onClick={() =>
                    setExpandedWidget(expandedWidget === "code" ? null : "code")
                  }
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200 transition-colors"
                  title="Maximize Code Editor to Fullscreen Focus"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto text-xs font-mono text-slate-300 leading-relaxed bg-[#070709]">
              {/* If selected file is not the step file, show its general reference code, else highlight active lines */}
              {selectedFile === activeStep.file ? (
                <div className="space-y-1">
                  {activeStep.codeSnippet.split("\n").map((line, idx) => {
                    const isHighlighted = activeStep.highlightLines.includes(
                      idx + 1,
                    );
                    return (
                      <div
                        key={idx}
                        className={`py-0.5 px-2 rounded -mx-2 flex ${
                          isHighlighted
                            ? "bg-teal-500/10 text-teal-200 border-l-2 border-teal-500"
                            : "opacity-70"
                        }`}
                      >
                        <span className="w-6 text-slate-600 select-none text-right pr-2">
                          {idx + 1}
                        </span>
                        <pre className="whitespace-pre-wrap">{line}</pre>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {/* General file contents or placeholders */}
                  {selectedFile === ".env" && (
                    <pre className="text-amber-200/80">
                      {`# Environment Variables Configurations
AZURE_AI_CONN_STR="eastus2.api.azure.com;00000000-0000-0000-0000-000000000000;rg-ai901;proj-foundry"
MODEL_DEPLOYMENT_NAME="gpt-4o-mini"
AZURE_OPENAI_API_VERSION="2024-12-01-preview"
`}
                    </pre>
                  )}
                  {selectedFile === "requirements.txt" && (
                    <pre className="text-slate-400">
                      {`azure-ai-projects>=2.0.0
azure-identity>=1.15.0
python-dotenv>=1.0.0
fastapi>=0.100.0
uvicorn>=0.23.0
`}
                    </pre>
                  )}
                  {selectedFile === "agent_client.py" && (
                    <pre className="text-blue-300/80">
                      {`import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

connection_string = os.environ["AZURE_AI_CONN_STR"]
credential = DefaultAzureCredential()

project_client = AIProjectClient.from_connection_string(
    credential=credential,
    conn_str=connection_string
)
print("Auth Established.")
`}
                    </pre>
                  )}
                  {selectedFile === "app.py" && (
                    <pre className="text-slate-300">
                      {`from fastapi import FastAPI
from agent_client import project_client
from pydantic import BaseModel

app = FastAPI()

class MessageRequest(BaseModel):
    content: str

@app.post("/chat")
def chat_with_agent(req: MessageRequest):
    thread = project_client.agents.create_thread()
    message = project_client.agents.create_message(
        thread_id=thread.id,
        role="user",
        content=req.content
    )
    run = project_client.agents.create_run(thread_id=thread.id, assistant_id="agt_901")
    return {"thread_id": thread.id, "run_id": run.id}
`}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right partition: Conceptual Metaphors & Analogy Card */}
          <div className="w-full md:w-64 bg-[#0a0a0d] p-4 flex flex-col justify-between overflow-y-auto shrink-0 border-t md:border-t-0 md:border-r border-white/5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[10px] font-bold uppercase">
                <Info className="w-3.5 h-3.5" />
                <span>Analogy &amp; Metaphor</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                {activeStep.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#111116] p-3 rounded-lg border border-white/5">
                {activeStep.analogy}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Technical Intent
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeStep.description}
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 3: TELEMETRY & CHAOS PANEL */}
        <div
          className={`w-full md:w-80 bg-[#0c0c10] md:border-l border-white/10 flex-col justify-between overflow-hidden shrink-0 ${
            activeSubTab === "telemetry" ? "flex flex-grow" : "hidden"
          } md:flex`}
        >
          {/* Top telemetry widget: Payload Terminal */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-white/10">
            <div className="px-3.5 py-2.5 bg-[#121217] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                  Payload Terminal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-semibold">
                  {activeStep.payload.method}
                </span>
                <button
                  onClick={() =>
                    setExpandedWidget(
                      expandedWidget === "terminal" ? null : "terminal",
                    )
                  }
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200 transition-colors"
                  title="Maximize Telemetry to Fullscreen Focus"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] bg-[#070709] space-y-2">
              <div className="space-y-0.5">
                <div className="text-slate-500 text-[10px] uppercase">
                  Request URL:
                </div>
                <div className="text-teal-400 break-all select-all font-semibold">
                  {activeStep.payload.url}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-slate-500 text-[10px] uppercase">
                  Headers:
                </div>
                <pre className="text-slate-300 bg-white/5 p-1.5 rounded text-[10px]">
                  {JSON.stringify(activeStep.payload.headers, null, 2)}
                </pre>
              </div>

              <div className="space-y-0.5">
                <div className="text-slate-500 text-[10px] uppercase">
                  JSON Body:
                </div>
                <pre className="text-amber-100/90 bg-white/5 p-1.5 rounded text-[10px] overflow-x-auto">
                  {activeStep.payload.body}
                </pre>
              </div>
            </div>
          </div>

          {/* Middle telemetry widget: Process Monitor (Vertically Resizable) */}
          <div
            ref={monitorRef}
            style={{ height: isMobile ? "200px" : `${monitorHeight}px` }}
            className="flex flex-col overflow-hidden border-b border-white/10 relative shrink-0"
          >
            {/* Vertical resize handler for Process Monitor */}
            <div
              onMouseDown={(e) => { e.preventDefault(); setIsDraggingMonitor(true); }}
              className="hidden md:block absolute top-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-teal-500/20 transition-colors z-20 -translate-y-1"
            />

            <div className="px-3.5 py-2 bg-[#121217] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                  Process Monitor
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                Live stdout
              </span>
            </div>

            <div className="flex-1 p-3 bg-black/95 font-mono text-[10px] overflow-y-auto space-y-1.5 select-text">
              {liveLogs.map((log, index) => {
                let color = "text-slate-300";
                if (
                  log.includes("[ERROR]") ||
                  log.includes("[FATAL]") ||
                  log.includes("[CRITICAL]")
                )
                  color = "text-rose-400 font-semibold";
                else if (log.includes("[WARN]")) color = "text-amber-400";
                else if (log.includes("[SUCCESS]"))
                  color = "text-emerald-400 font-semibold";
                else if (log.includes("[SECURE]")) color = "text-blue-400";

                return (
                  <div key={index} className={`leading-relaxed ${color}`}>
                    {log}
                  </div>
                );
              })}

              {/* Interactive failure simulation logs if active */}
              {chaos.invalidApiKey && (
                <div className="text-rose-400 font-bold leading-relaxed border-t border-rose-500/20 pt-1 mt-1">
                  [FATAL ERROR] 401 Unauthorized: The provided API credentials
                  or Entra ID token is rejected. Connection string targetEastUS2
                  is locked.
                </div>
              )}
              {chaos.corruptUri && (
                <div className="text-rose-400 font-bold leading-relaxed border-t border-rose-500/20 pt-1 mt-1">
                  [CRITICAL ERROR] 404 Endpoint Not Found: The requested Azure
                  Projects route is invalid. Endpoint target rejected.
                </div>
              )}
              <div ref={terminalBottomRef} />
            </div>
          </div>

          {/* Bottom telemetry widget: Chaos Simulator */}
          <div className="p-3.5 bg-[#0e0e13] space-y-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                Chaos &amp; Failover Simulator
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => toggleChaos("invalidApiKey")}
                className={`py-2 px-3 text-[10px] font-mono rounded border text-left transition-all flex items-center justify-between ${
                  chaos.invalidApiKey
                    ? "bg-rose-500/20 border-rose-500 text-rose-200"
                    : "bg-[#181820] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span>1. Corrupt API Key (401)</span>
                <span
                  className={`w-2 h-2 rounded-full ${chaos.invalidApiKey ? "bg-rose-500 animate-ping" : "bg-slate-700"}`}
                />
              </button>

              <button
                onClick={() => toggleChaos("corruptUri")}
                className={`py-2 px-3 text-[10px] font-mono rounded border text-left transition-all flex items-center justify-between ${
                  chaos.corruptUri
                    ? "bg-rose-500/20 border-rose-500 text-rose-200"
                    : "bg-[#181820] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span>2. Invalid Route URI (404)</span>
                <span
                  className={`w-2 h-2 rounded-full ${chaos.corruptUri ? "bg-rose-500 animate-ping" : "bg-slate-700"}`}
                />
              </button>

              <button
                onClick={() => toggleChaos("latency")}
                className={`py-2 px-3 text-[10px] font-mono rounded border text-left transition-all flex items-center justify-between ${
                  chaos.latency
                    ? "bg-amber-500/20 border-amber-500 text-amber-200"
                    : "bg-[#181820] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span>3. Latency Injection (4000ms)</span>
                <span
                  className={`w-2 h-2 rounded-full ${chaos.latency ? "bg-amber-500 animate-ping" : "bg-slate-700"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DEEP INTERACTIVE ARCHITECTURE OVERLAY */}
      {selectedNode && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[200] animate-fadeIn"
          onClick={() => { setSelectedNode(null); setDeepDiveTab("overview"); }}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full md:w-[600px] h-full bg-[#0a0a0c] border-l border-teal-500/30 flex flex-col shadow-2xl relative select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col border-b border-white/10 bg-[#0e0e12]">
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-1">
                    Deep Dive Inspector
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 font-sans flex items-center gap-3">
                    {selectedNode.label}
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400 font-normal">
                      ID: {selectedNode.id}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => { setSelectedNode(null); setDeepDiveTab("overview"); }}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-white/5 px-6">
                {[
                  { id: "overview", label: "L1: Overview" },
                  { id: "component", label: "L2: Component" },
                  { id: "state", label: "L3: State" },
                  { id: "implementation", label: "L4: Implementation" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDeepDiveTab(tab.id as any)}
                    className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-colors ${
                      deepDiveTab === tab.id
                        ? "border-teal-400 text-teal-300"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {deepDiveTab === "overview" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">What is this?</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{selectedNode.spec}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Why does it exist?</h4>
                    <p className="text-sm text-amber-200/90 leading-relaxed bg-amber-500/5 p-3 rounded border border-amber-500/10">
                      <strong>Metaphor:</strong> {selectedNode.analogy}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-rose-300 border-b border-white/10 pb-2">Common Misconception</h4>
                    <p className="text-sm text-rose-200/90 leading-relaxed bg-rose-500/5 p-3 rounded border border-rose-500/10">
                      {selectedNode.misconception}
                    </p>
                  </div>
                </div>
              )}

              {deepDiveTab === "component" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#121216] border border-white/5 p-4 rounded-lg">
                      <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Inputs</div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                        <li>HTTP Requests / Payloads</li>
                        <li>Environment Configuration</li>
                        <li>Authentication Tokens</li>
                      </ul>
                    </div>
                    <div className="bg-[#121216] border border-white/5 p-4 rounded-lg">
                      <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Outputs</div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                        <li>JSON Responses</li>
                        <li>Service Logs</li>
                        <li>State Mutations</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Enterprise Considerations</h4>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400">Governance & Security</span>
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400">Role-Based Access Control</span>
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400">Scalability Limits</span>
                    </div>
                  </div>
                </div>
              )}

              {deepDiveTab === "state" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Runtime State Inspection</h4>
                    <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg font-mono text-xs text-emerald-400 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-30"><Cpu className="w-12 h-12" /></div>
                      <div className="mb-2 text-slate-500">// Current Step: {activeStep.title}</div>
                      <div>is_active = {(activeConnection?.source === selectedNode.id || activeConnection?.target === selectedNode.id) ? "true" : "false"}</div>
                      <div>current_stage = "{(activeConnection?.source === selectedNode.id || activeConnection?.target === selectedNode.id) ? "processing" : "idle"}"</div>
                      <div>network_latency = {chaos.latency ? "4000ms" : "12ms"}</div>
                      {chaos.invalidApiKey && <div className="text-red-400 mt-2">FATAL: auth_token_rejected (401)</div>}
                      {chaos.corruptUri && <div className="text-red-400 mt-2">FATAL: uri_resolution_failed (404)</div>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Data Flowing Through Component</h4>
                    <pre className="text-[10px] text-slate-400 bg-[#0d0d11] border border-white/5 p-3 rounded-lg overflow-x-auto">
{`{
  "timestamp": "${new Date().toISOString()}",
  "node_id": "${selectedNode.id}",
  "payload": {
    "status": "synchronized",
    "context": "Agent initialization parameters"
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

              {deepDiveTab === "implementation" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Relevant Configuration</h4>
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden">
                      <div className="bg-black/40 px-3 py-1 border-b border-white/10 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                        <FileCode2 className="w-3 h-3" /> config.yaml
                      </div>
                      <pre className="text-[10px] text-blue-300 p-3 overflow-x-auto">
{`# Auto-generated configuration for ${selectedNode.id}
apiVersion: v1
kind: Service
metadata:
  name: ${selectedNode.id}-service
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 8080`}
                      </pre>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Execution Logs</h4>
                    <div className="bg-black border border-white/10 rounded-lg p-3 font-mono text-[10px] text-slate-400 space-y-1">
                      <div><span className="text-slate-600">[INFO]</span> Initializing node '{selectedNode.id}'...</div>
                      <div><span className="text-slate-600">[INFO]</span> Loading environment variables.</div>
                      <div><span className="text-emerald-500">[OK]</span> Component ready to receive events.</div>
                      {(activeConnection?.source === selectedNode.id || activeConnection?.target === selectedNode.id) && (
                        <div className="text-cyan-400"><span className="text-cyan-600">[TRACE]</span> Processing active event payload...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 5. FULLSCREEN FOCUS WIDGET OVERLAY */}
      {expandedWidget && (
        <div
          className="fixed inset-0 bg-[#070709] z-50 flex flex-col text-slate-100 overflow-hidden animate-fadeIn"
          onClick={() => setExpandedWidget(null)}
        >
          {/* Global Header for Fullscreen Mode */}
          <div
            className="px-6 py-4 bg-[#0d0d12] border-b border-white/10 flex items-center justify-between shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold uppercase tracking-wider">
                Fullscreen Focus Mode
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {expandedWidget === "diagram" &&
                  `Architectural Topology Visualizer — Step ${currentStepIndex + 1}: ${activeStep.title}`}
                {expandedWidget === "code" &&
                  `Modern Python SDK v2 Editor Workspace — ${selectedFile}`}
                {expandedWidget === "terminal" &&
                  `Telemetry Payload Logger — ${activeStep.payload.method}`}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {expandedWidget === "diagram" && (
                <div className="flex bg-[#181820] rounded-md p-0.5 border border-white/5 mr-4">
                  <button
                    onClick={() => setActiveView("infrastructure")}
                    className={`px-3 py-1 text-[11px] font-mono rounded font-medium transition-all ${
                      activeView === "infrastructure"
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Service Infrastructure
                  </button>
                  <button
                    onClick={() => setActiveView("pipeline")}
                    className={`px-3 py-1 text-[11px] font-mono rounded font-medium transition-all ${
                      activeView === "pipeline"
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Pipeline Logic
                  </button>
                </div>
              )}

              <button
                onClick={() => setExpandedWidget(null)}
                className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white text-xs font-mono rounded-lg border border-rose-500/20 transition-all flex items-center gap-1.5 animate-pulse"
                title="Minimize / Exit Fullscreen"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Body Content based on expanded state */}
          <div
            className="flex-1 flex overflow-hidden bg-[#070709]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CASE 1: DIAGRAM WIDGET EXPANDED */}
            {expandedWidget === "diagram" && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Large 2D Diagram Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden border-r border-white/5 relative p-6 justify-center">
                  <div className="absolute top-4 left-6 text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    <span>Live Architecture Telemetry Map</span>
                  </div>

                  <div className="w-full mt-4">{renderDiagramMap(true)}</div>
                </div>

                {/* Sidebar details layout inside expanded view */}
                <div className="w-full lg:w-[380px] bg-[#0c0c10] border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shrink-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-widest">
                      <Info className="w-4 h-4 text-teal-400" />
                      <span>Active Node Specifications</span>
                    </div>

                    <div className="p-4 bg-teal-950/10 border border-teal-500/20 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">
                          Node {displayNodeIdx + 1} Profile
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {displayNode?.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {displayNode?.label}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {displayNode?.spec}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                        Interactive Metaphor
                      </span>
                      <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 font-sans">
                        {displayNode?.analogy}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold">
                        Exam Target Concept
                      </span>
                      <p className="text-xs text-rose-200/90 leading-relaxed bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 font-sans">
                        {displayNode?.misconception}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#101015] border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[10px] font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>AI-901 INTEGRATION STUDY TIP</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {activeStep.examTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: CODE SNIPPETS EXPANDED */}
            {expandedWidget === "code" && (
              <div className="flex-1 flex overflow-hidden">
                {/* File explorer sidebar inside expanded code view */}
                <div className="w-64 bg-[#0a0a0d] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 border-b border-white/5 pb-2">
                    <FolderOpen className="w-4 h-4 text-teal-500" />
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider">
                      PROJECT SCRIPTS
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      {
                        name: "app.py",
                        type: "py",
                        color: "text-blue-400",
                        desc: "Main agent script invoking core threads.",
                      },
                      {
                        name: "agent_client.py",
                        type: "py",
                        color: "text-blue-400",
                        desc: "Sovereign project client construction.",
                      },
                      {
                        name: ".env",
                        type: "env",
                        color: "text-amber-400",
                        desc: "Stateful environment connections.",
                      },
                      {
                        name: "requirements.txt",
                        type: "txt",
                        color: "text-slate-400",
                        desc: "Sovereign Python packaging dependencies.",
                      },
                    ].map((file) => {
                      const isActiveFile = file.name === selectedFile;
                      const isStepFile = file.name === activeStep.file;

                      return (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFile(file.name as any)}
                          className={`w-full flex flex-col p-2.5 rounded-lg text-left transition-all text-xs font-mono border ${
                            isActiveFile
                              ? "bg-teal-500/10 text-teal-300 border-teal-500 font-semibold"
                              : "text-slate-400 hover:bg-white/5 border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <FileCode2
                                className={`w-3.5 h-3.5 ${file.color}`}
                              />
                              <span className="font-semibold">{file.name}</span>
                            </div>
                            {isStepFile && (
                              <span
                                className="w-2 h-2 rounded-full bg-teal-400 animate-ping"
                                title="Target for current execution step"
                              />
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 font-sans mt-1 line-clamp-1">
                            {file.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* High fidelity expanded code pane */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#070709] border-r border-white/10">
                  <div className="px-5 py-3 bg-[#0d0d12] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-teal-400" />
                      {selectedFile}{" "}
                      {selectedFile === activeStep.file
                        ? "— Live Trace"
                        : "— Static Script"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      SYNTAX: PYTHON / TOML
                    </span>
                  </div>

                  <div className="flex-1 p-6 overflow-auto text-sm font-mono text-slate-200 leading-relaxed">
                    {selectedFile === activeStep.file ? (
                      <div className="space-y-1">
                        {activeStep.codeSnippet.split("\n").map((line, idx) => {
                          const isHighlighted =
                            activeStep.highlightLines.includes(idx + 1);
                          return (
                            <div
                              key={idx}
                              className={`py-1 px-3 rounded flex ${
                                isHighlighted
                                  ? "bg-teal-500/15 text-teal-100 border-l-4 border-teal-500"
                                  : "opacity-60"
                              }`}
                            >
                              <span className="w-8 text-slate-600 select-none text-right pr-3">
                                {idx + 1}
                              </span>
                              <pre className="whitespace-pre-wrap font-semibold">
                                {line}
                              </pre>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-[#0a0a0d] border border-white/5 rounded-xl">
                        {selectedFile === ".env" && (
                          <pre className="text-amber-200/80 text-xs">
                            {`# Environment Variables Configurations
AZURE_AI_CONN_STR="eastus2.api.azure.com;00000000-0000-0000-0000-000000000000;rg-ai901;proj-foundry"
MODEL_DEPLOYMENT_NAME="gpt-4o-mini"
AZURE_OPENAI_API_VERSION="2024-12-01-preview"
`}
                          </pre>
                        )}
                        {selectedFile === "requirements.txt" && (
                          <pre className="text-slate-400 text-xs">
                            {`azure-ai-projects>=2.0.0
azure-identity>=1.15.0
python-dotenv>=1.0.0
fastapi>=0.100.0
uvicorn>=0.23.0
`}
                          </pre>
                        )}
                        {selectedFile === "agent_client.py" && (
                          <pre className="text-blue-300/80 text-xs">
                            {`import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

connection_string = os.environ["AZURE_AI_CONN_STR"]
credential = DefaultAzureCredential()

project_client = AIProjectClient.from_connection_string(
    credential=credential,
    conn_str=connection_string
)
print("Auth Established.")
`}
                          </pre>
                        )}
                        {selectedFile === "app.py" && (
                          <pre className="text-slate-300 text-xs">
                            {`from fastapi import FastAPI
from agent_client import project_client
from pydantic import BaseModel

app = FastAPI()

class MessageRequest(BaseModel):
    content: str

@app.post("/chat")
def chat_with_agent(req: MessageRequest):
    thread = project_client.agents.create_thread()
    message = project_client.agents.create_message(
        thread_id=thread.id,
        role="user",
        content=req.content
    )
    run = project_client.agents.create_run(thread_id=thread.id, assistant_id="agt_901")
    return {"thread_id": thread.id, "run_id": run.id}
`}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side explanation pane */}
                <div className="w-80 bg-[#0c0c10] p-5 shrink-0 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
                      Contextual Interpretation
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {activeStep.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#111116] p-4 rounded-xl border border-white/5">
                      {activeStep.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/10 mt-4">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
                      Interactive Metaphor
                    </span>
                    <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                      {activeStep.analogy}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 3: PAYLOAD TERMINAL EXPANDED */}
            {expandedWidget === "terminal" && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Full-width HTTP Request details */}
                <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 border-r border-white/10">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>REST API Request Headers &amp; Payloads</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
                        Endpoint Target URL
                      </span>
                      <div className="bg-[#111116] border border-white/5 rounded-xl p-4 font-mono text-xs text-teal-300 break-all select-all font-semibold">
                        {activeStep.payload.url}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
                        HTTP Method / Verb
                      </span>
                      <div className="bg-[#111116] border border-white/5 rounded-xl p-4 font-mono text-xs text-emerald-400 font-bold">
                        {activeStep.payload.method}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
                      HTTP Authorization &amp; Content Headers
                    </span>
                    <pre className="bg-[#0b0b0e] border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {JSON.stringify(activeStep.payload.headers, null, 2)}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
                      JSON POST Body Payload
                    </span>
                    <pre className="bg-[#0b0b0e] border border-white/5 rounded-xl p-4 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed">
                      {activeStep.payload.body}
                    </pre>
                  </div>
                </div>

                {/* Right partition: Live Telemetry output console */}
                <div className="w-full lg:w-96 bg-[#0c0c10] flex flex-col overflow-hidden">
                  <div className="px-5 py-3 bg-[#111116] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Live Terminal Buffer
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse uppercase">
                      ● CAPTURING
                    </span>
                  </div>

                  <div className="flex-1 p-5 overflow-auto bg-[#07070a] font-mono text-xs text-slate-300 space-y-2">
                    {liveLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-slate-700/50 pl-3 leading-relaxed hover:border-teal-400 transition-all"
                      >
                        {log}
                      </div>
                    ))}
                    <div ref={terminalBottomRef} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Scrubber */}
          <div
            className="shrink-0 bg-[#070709]"
            onClick={(e) => e.stopPropagation()}
          >
            {renderScrubber()}
          </div>
        </div>
      )}

      {/* Explainer Pop-up overlay (Draggable) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.1}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="absolute bottom-8 left-0 right-0 mx-auto z-[100] w-[90%] max-w-lg bg-[#0e0e12]/95 backdrop-blur-md border border-teal-500/30 shadow-2xl shadow-teal-500/10 rounded-xl p-4 flex flex-col gap-2 cursor-grab active:cursor-grabbing max-h-[300px] overflow-y-auto overflow-x-hidden pointer-events-auto"
      >
        <div className="text-xs font-bold text-teal-400 font-mono tracking-wider uppercase mb-1 sticky top-0 bg-[#0e0e12]/95 backdrop-blur-md z-10 py-1">Execution Steps</div>
        <div className="space-y-3">
          {STEPS_DATA.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <div 
                key={step.id} 
                className={`flex gap-3 items-start transition-all ${isCurrent ? 'opacity-100 scale-100' : 'opacity-40 scale-95 hover:opacity-80 cursor-pointer'}`}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${isCurrent ? 'bg-teal-500/20 border-teal-500/50 text-teal-300' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                  {isCurrent ? <Play className="w-3 h-3 animate-pulse" /> : <span className="text-[10px]">{idx + 1}</span>}
                </div>
                <div>
                  <h3 className={`text-sm font-bold mb-0.5 ${isCurrent ? 'text-teal-300' : 'text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes movePacket {
          0% { filter: drop-shadow(0 0 2px #2dd4bf); opacity: 1; }
          50% { filter: drop-shadow(0 0 6px #2dd4bf); opacity: 0.8; }
          100% { filter: drop-shadow(0 0 2px #2dd4bf); opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
