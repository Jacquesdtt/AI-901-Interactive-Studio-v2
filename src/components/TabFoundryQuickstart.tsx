import React, { useState } from 'react';
import {
  CheckCircle2, Copy, Check, BookOpen, Terminal,
  FileText, ChevronRight, ExternalLink, Zap, Bot, FolderOpen
} from 'lucide-react';

// ─── Real repo code files ────────────────────────────────────────────────────

const CODE_FILES = {
  env: `# Agent Endpoint
# Replace with your Microsoft Foundry agent endpoint URL
AGENT_ENDPOINT=https://jacqueslouisdutoit7-2493-resourc.services.ai.azure.com/api/projects/jacqueslouisdutoit7-2493/agents/007/endpoint/protocols/openai/responses`,

  requirements: `flask==3.0.0
openai>=2.38.0
azure-identity>=1.15.0
python-dotenv==1.0.0
markdown==3.7
bleach==6.1.0`,

  agent_client: `\"\"\"
Agent Client - Handles interaction with the Microsoft Foundry agent.

This module contains the core logic for connecting to and communicating with
the agent published in Microsoft Foundry. It uses the OpenAI Responses API
to submit prompts and handle responses.
\"\"\"

import os
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv

# Import Azure Identity and OpenAI client libraries
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

# Load environment variables
load_dotenv()
logger = logging.getLogger(__name__)

class AgentClient:
    \"\"\"Client for interacting with a Microsoft Foundry agent.\"\"\"

    def __init__(self):
        \"\"\"Initialize the agent client with authentication and endpoint.\"\"\"
        self.agent_endpoint = os.getenv("AGENT_ENDPOINT").replace("/responses", "")
        if not self.agent_endpoint:
            raise ValueError("AGENT_ENDPOINT not found in environment variables")

        # Create OpenAI client authenticated with Azure credentials
        self.client = OpenAI(
            api_key=get_bearer_token_provider(
                DefaultAzureCredential(),
                "https://ai.azure.com/.default"
            ),
            base_url=self.agent_endpoint,
            default_query={"api-version": "v1"}
        )

        # Maintain conversation history (last 3 exchanges)
        self.conversation_history: List[Dict[str, Any]] = []
        self.max_history = 3

    def send_message(self, user_message: str) -> str:
        \"\"\"Send a message to the agent and return the response.\"\"\"
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        try:
            # Send prompt with full conversation history and get response
            response = self.client.responses.create(
                input=self.conversation_history
            )
            assistant_message = response.output_text

            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })

            # Count user messages and enforce max_history limit
            user_message_count = sum(
                1 for msg in self.conversation_history
                if isinstance(msg, dict) and msg.get("role") == "user"
            )
            while user_message_count > self.max_history:
                for i, msg in enumerate(self.conversation_history):
                    if isinstance(msg, dict) and msg.get("role") == "user":
                        self.conversation_history.pop(i)
                        if i < len(self.conversation_history) and \\
                           self.conversation_history[i].get("role") == "assistant":
                            self.conversation_history.pop(i)
                        user_message_count -= 1
                        break

            return assistant_message

        except Exception:
            logger.exception("Error communicating with agent")
            return "An internal error occurred while communicating with the agent."

    def reset_conversation(self):
        \"\"\"Clear the conversation history.\"\"\"
        self.conversation_history = []`,

  app: `\"\"\"
Flask Application for Computing History Agent Client.

Provides a web interface for interacting with the Computing History agent.
\"\"\"

from flask import Flask, render_template, request, jsonify
import markdown
import bleach
from agent_client import AgentClient

app = Flask(__name__)


def _set_external_link_attributes(attrs, new=False):
    \"\"\"Force safe external link attributes for rendered markdown links.\"\"\"
    href_key = (None, 'href')
    href_value = attrs.get(href_key, '')
    if isinstance(href_value, str) and href_value.startswith(('http://', 'https://')):
        attrs[(None, 'target')] = '_blank'
        attrs[(None, 'rel')] = 'noopener noreferrer nofollow'
    return attrs


def render_markdown_to_safe_html(text: str) -> str:
    \"\"\"Convert markdown to safe HTML for display in chat bubbles.\"\"\"
    raw_html = markdown.markdown(
        text, extensions=['extra', 'sane_lists', 'nl2br']
    )
    safe_html = bleach.clean(
        raw_html,
        tags=['p','br','hr','blockquote','h1','h2','h3','h4','h5','h6',
              'ul','ol','li','strong','em','code','pre','a',
              'table','thead','tbody','tr','th','td'],
        attributes={'a': ['href','title','target','rel'], 'code': ['class']},
        protocols=['http','https','mailto'],
        strip=True
    )
    return bleach.linkify(safe_html, skip_tags=['pre','code'],
                          callbacks=[_set_external_link_attributes])


try:
    agent = AgentClient()
except Exception as e:
    print(f"Warning: Failed to initialize agent client: {e}")
    agent = None


@app.route('/')
def index():
    \"\"\"Render the main chat interface.\"\"\"
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    \"\"\"Handle chat messages from the user.\"\"\"
    if not agent:
        return jsonify({
            'error': 'Agent client not initialized. Check your .env configuration.'
        }), 500

    data = request.json
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    if len(user_message) > 10000:
        return jsonify({'error': 'Message too long'}), 400

    response = agent.send_message(user_message)
    response_html = render_markdown_to_safe_html(response)
    return jsonify({'response': response, 'response_html': response_html})


@app.route('/reset', methods=['POST'])
def reset():
    \"\"\"Reset the conversation history.\"\"\"
    if agent:
        agent.reset_conversation()
    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(debug=False, port=5000)`,
};

type CodeFileKey = keyof typeof CODE_FILES;

// ─── Step content ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Get Started in Foundry Portal', duration: '20 min' },
  { label: 'Continue in VS Code', duration: '20 min' },
  { label: 'Use Agent in Client App', duration: '20 min' },
];

// ─── Code block reusable ─────────────────────────────────────────────────────

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-[#1a1a1f] text-purple-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-500/20">
      {children}
    </code>
  );
}

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <h4 className="text-white font-bold text-xs flex items-center gap-2">
        <ChevronRight size={13} className="text-purple-400 shrink-0" />
        {title}
      </h4>
      <div className="pl-5 text-slate-300 text-xs leading-relaxed flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'tip' | 'warn'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-[#12162b] border-[#23305c] text-slate-300',
    tip: 'bg-[#0c1b12] border-emerald-700/40 text-emerald-200',
    warn: 'bg-[#241a0c] border-amber-600/40 text-amber-200',
  };
  const icons = { info: 'ℹ', tip: '💡', warn: '⚠' };
  return (
    <div className={`border rounded-lg p-3 text-[11px] leading-relaxed flex gap-2 ${styles[type]}`}>
      <span className="shrink-0 mt-0.5">{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}

function PreCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch { /* silent */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="relative bg-[#050505] border border-[#242426] rounded-lg overflow-hidden mt-1">
      <button
        onClick={copy}
        className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
          copied ? 'bg-emerald-600/20 text-emerald-300' : 'bg-[#1f1f23] text-slate-400 hover:text-white'
        }`}
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="p-3 pr-16 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
    </div>
  );
}

// ─── Step instruction panels ──────────────────────────────────────────────────

function Step1Content() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-500 text-[10px] mb-2">
        <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">Lab 01 of 03</span>
        <span>Get started with agent development in Microsoft Foundry</span>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed">
        In this exercise, you'll use Microsoft Foundry to start developing an AI agent that provides information and expertise on the <strong>history of computing</strong>.
      </p>

      <StepSection title="Create a Microsoft Foundry project">
        <p>Open <a href="https://ai.azure.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-1">ai.azure.com <ExternalLink size={10} /></a> and sign in with your Azure credentials. Enable the <InlineCode>New Foundry</InlineCode> option and create a project in an AI Foundry recommended region.</p>
      </StepSection>

      <StepSection title="Deploy a model">
        <p>On the Discover page → Models tab, search for and select the model:</p>
        <Callout type="info">
          <strong>Model to deploy:</strong> <InlineCode>gpt-4o-mini</InlineCode><br />
          Use the <strong>Deploy</strong> button with default settings. If quota is exhausted, try <InlineCode>gpt-4o</InlineCode> or create a project in a different region.
        </Callout>
      </StepSection>

      <StepSection title="Chat with the model">
        <p>In the Chat pane, try:</p>
        <PreCode code={'Who was Ada Lovelace?\nTell me more about her work with Charles Babbage.'} />
        <p className="text-slate-400 text-[10px]">Use <InlineCode>New chat</InlineCode> to restart and clear conversation history.</p>
      </StepSection>

      <StepSection title="Specify instructions in a system prompt">
        <p>Change the system prompt in the Instructions pane to:</p>
        <Callout type="tip">
          <InlineCode>You are an expert in the history of computing and AI. You only answer questions about significant people and events in the development of computing, and about notable vintage computers. Do not engage in conversations on any topic that is unrelated to computing history.</InlineCode>
        </Callout>
      </StepSection>

      <StepSection title="Add a web_search tool">
        <p>In the left pane, expand <strong>Tools</strong> → Add → <InlineCode>Web search</InlineCode>. This allows the model to retrieve up-to-date information from the web.</p>
        <Callout type="tip">Test with: <InlineCode>Find a vintage computer store near Seattle</InlineCode></Callout>
      </StepSection>

      <StepSection title="Save as agent">
        <p>In the model playground, select <strong>Save as agent</strong>. Name it <InlineCode>computing-historian</InlineCode>. View the generated YAML:</p>
        <PreCode code={`name: computing-historian
version: "1"
definition:
  kind: prompt
  model: gpt-4o-mini
  instructions: You are an expert in the history of
    computing and AI...
  tools:
    - type: web_search
status: active`} />
      </StepSection>
    </div>
  );
}

function Step2Content() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-500 text-[10px] mb-2">
        <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">Lab 02 of 03</span>
        <span>Continue developing your agent in Visual Studio Code</span>
      </div>

      <StepSection title="Install the Foundry Toolkit extension">
        <p>In VS Code Extensions, search for <InlineCode>Foundry Toolkit</InlineCode> and install <strong>Foundry Toolkit for VS Code</strong>. Connect to Azure and select your Foundry project.</p>
      </StepSection>

      <StepSection title="Connect to your agent">
        <p>In the Foundry Toolkit pane → <strong>Prompt agents</strong> → expand <InlineCode>computing-historian</InlineCode> → select version 1. This opens the <strong>Agent Builder</strong> interface inside VS Code.</p>
        <Callout type="tip">
          If you didn't complete Lab 01, create a new agent named <InlineCode>computing-history</InlineCode> based on <InlineCode>gpt-4o-mini</InlineCode> with the web_search tool.
        </Callout>
      </StepSection>

      <StepSection title="Write code to test your agent">
        <p>Right-click the agent version → <strong>View code</strong> → SDK: <InlineCode>Microsoft Foundry Projects client library</InlineCode>, Language: Python, Auth: Entra ID.</p>
        <p className="mt-1">Install the required packages:</p>
        <PreCode code="pip install azure-ai-projects>=2.0.0 openai" />
        <p className="mt-1">Sign in to Azure:</p>
        <PreCode code="az login" />
        <p className="mt-1">The generated code uses the <InlineCode>AIProjectClient</InlineCode> pattern:</p>
        <PreCode code={`from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

my_endpoint = "https://{your_foundry_resource}.services.ai.azure.com/api/projects/{your_project}"

project_client = AIProjectClient(
    endpoint=my_endpoint,
    credential=DefaultAzureCredential(),
)

my_agent = "computing-historian"
my_version = "1"

openai_client = project_client.get_openai_client()

response = openai_client.responses.create(
    input=[{"role": "user", "content": "Tell me what you can help with."}],
    extra_body={"agent_reference": {"name": my_agent, "version": my_version, "type": "agent_reference"}},
)

print(f"Response output: {response.output_text}")`} />
      </StepSection>

      <StepSection title="Use GitHub Copilot to expand your code">
        <p>Open GitHub Copilot Chat and send:</p>
        <PreCode code='Modify the code to iteratively ask the user to enter a prompt for the agent and display the results, running until the user enters "quit".' />
        <Callout type="tip">Test prompts: <InlineCode>Tell me about the Commodore 64</InlineCode> · <InlineCode>What was the ZX Spectrum?</InlineCode> · <InlineCode>What was Grace Hopper&apos;s contribution to computing?</InlineCode></Callout>
      </StepSection>
    </div>
  );
}

function Step3Content() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-500 text-[10px] mb-2">
        <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">Lab 03 of 03</span>
        <span>Use your agent in a client application</span>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed">
        Your agent is automatically published with a dedicated endpoint that applications can call using the <strong>OpenAI Responses API</strong>. In this lab, you'll configure and complete the Python Flask client.
      </p>

      <StepSection title="Get your agent's endpoint">
        <p>In the Foundry portal → Build → Agents → <InlineCode>computing-historian</InlineCode> → Publish dropdown → <strong>Details</strong>. Note the Responses protocol endpoint.</p>
        <Callout type="info">
          <strong>This project's endpoint:</strong><br />
          <span className="font-mono text-[10px] text-purple-300 break-all">
            https://jacqueslouisdutoit7-2493-resourc.services.ai.azure.com/api/projects/jacqueslouisdutoit7-2493/agents/007/endpoint/protocols/openai/responses
          </span>
        </Callout>
      </StepSection>

      <StepSection title="Configure the client application">
        <p>Clone the repo and open the <InlineCode>computer-history-client</InlineCode> folder. Update <InlineCode>.env</InlineCode> with your agent's Responses API endpoint (see the <strong>.env</strong> file tab in the code viewer below).</p>
        <p>Install dependencies:</p>
        <PreCode code="pip install -r requirements.txt" />
      </StepSection>

      <StepSection title="Add code to interact with your agent">
        <p>The key code in <InlineCode>agent_client.py</InlineCode> uses the OpenAI Responses API with <InlineCode>DefaultAzureCredential</InlineCode>:</p>
        <PreCode code={`# Create OpenAI client authenticated with Azure credentials
self.client = OpenAI(
    api_key=get_bearer_token_provider(
        DefaultAzureCredential(),
        "https://ai.azure.com/.default"
    ),
    base_url=self.agent_endpoint,
    default_query={"api-version": "v1"}
)

# Send prompt with full conversation history
response = self.client.responses.create(
    input=self.conversation_history
)
assistant_message = response.output_text`} />
      </StepSection>

      <StepSection title="Run the client application">
        <p>Sign in to Azure, then run:</p>
        <PreCode code="az login" />
        <PreCode code="python app.py" />
        <p>Navigate to <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-1">http://localhost:5000 <ExternalLink size={10} /></a></p>
        <Callout type="tip">
          Try: <InlineCode>What was ENIAC?</InlineCode> · <InlineCode>How does it compare with COLOSSUS?</InlineCode> · <InlineCode>Find the latest news for vintage computer enthusiasts.</InlineCode>
        </Callout>
        <Callout type="warn">
          Stop the server with <InlineCode>CTRL+C</InlineCode> when done. Delete Azure resources to avoid unnecessary charges.
        </Callout>
      </StepSection>
    </div>
  );
}

const FILE_TABS: { key: CodeFileKey; label: string }[] = [
  { key: 'env', label: '.env' },
  { key: 'agent_client', label: 'agent_client.py' },
  { key: 'app', label: 'app.py' },
  { key: 'requirements', label: 'requirements.txt' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TabFoundryQuickstart() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeCodeFile, setActiveCodeFile] = useState("agent_client");
  const [copySuccess, setCopySuccess] = useState(false);

  const markComplete = (step) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
    if (step < 2) setActiveStep(step + 1);
  };

  const copyCode = () => {
    const text = CODE_FILES[activeCodeFile];
    try { navigator.clipboard.writeText(text); } catch { /* silent */ }
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1800);
  };

  const fileIcon = {
    env: <FileText size={10} />,
    agent_client: <Terminal size={10} />,
    app: <Terminal size={10} />,
    requirements: <FileText size={10} />,
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0c0c0d] text-white">

      {/* ─── Left Sidebar ───────────────────────────── */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-[#242426] bg-[#0a0a0b] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#242426]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-[#0078d4]/20 border border-[#0078d4]/30 flex items-center justify-center">
              <Bot size={13} className="text-[#0078d4]" />
            </div>
            <h2 className="text-sm font-bold text-white">Foundry Quickstart</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">mslearn-agent-quickstart · Microsoft Learn</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[9px] bg-purple-600/15 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
              <Zap size={8} />
              Official Repo
            </span>
            <span className="text-[9px] text-slate-500">3 labs · ~60 min total</span>
          </div>
        </div>

        {/* Step list */}
        <div className="flex flex-col gap-2 p-3">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            const isDone = completedSteps.has(i);
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left rounded-xl border transition-all ${
                  isActive
                    ? 'border-purple-500/40 bg-purple-600/5 border-l-4 border-l-purple-500'
                    : 'border-[#242426] hover:border-slate-600 border-l-4 border-l-transparent'
                }`}
              >
                <div className="p-3 flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    isDone ? 'bg-emerald-600/20 text-emerald-400' : isActive ? 'bg-purple-600 text-white' : 'bg-[#1f1f23] text-slate-400'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[11px] font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {step.label}
                      </span>
                      {isDone && !isActive && <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">Step {i + 1} · {step.duration}</span>
                  </div>
                </div>
                {isActive && !isDone && (
                  <div className="px-3 pb-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); markComplete(i); }}
                      className="w-full text-[10px] font-bold py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                    >
                      Mark complete {i < 2 ? '→ Next step' : '✓ Finish'}
                    </button>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Repo Files */}
        <div className="mt-auto p-3 border-t border-[#242426]">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase mb-2">
            <FolderOpen size={11} />
            Repo Files
          </div>
          <div className="flex flex-col gap-1">
            {FILE_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCodeFile(key)}
                className={`text-left px-2.5 py-1.5 rounded text-[11px] font-mono transition-all ${
                  activeCodeFile === key
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {fileIcon[key]}
                <span className="ml-1.5">{label}</span>
              </button>
            ))}
          </div>

          {/* Repo path badge */}
          <div className="mt-3 bg-[#131315] border border-[#242426] rounded-lg p-2 text-[9px] font-mono text-slate-500 break-all leading-relaxed">
            📁 C:\Users\Personal\mslearn-agent-quickstart-main
          </div>
        </div>
      </aside>

      {/* ─── Right Content ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Info banner */}
        <div className="bg-[#0c142d] border-b border-[#23305c] px-5 py-2 flex items-center gap-3 text-[10px] text-slate-400 shrink-0 flex-wrap gap-y-1">
          <span className="text-slate-500">📁</span>
          <span className="font-mono text-slate-300">mslearn-agent-quickstart-main</span>
          <span className="text-slate-600">·</span>
          <span>Agent endpoint: <span className="font-mono text-purple-300">jacqueslouisdutoit7-2493</span></span>
          <span className="text-slate-600">·</span>
          <span>Model: <span className="font-mono text-purple-300">gpt-4o-mini</span></span>
          <span className="text-slate-600">·</span>
          <a href="https://github.com/MicrosoftLearning/mslearn-agent-quickstart" target="_blank" rel="noopener noreferrer"
             className="text-[#0078d4] hover:underline flex items-center gap-1">
            View on GitHub <ExternalLink size={9} />
          </a>
        </div>

        {/* Step breadcrumb */}
        <div className="px-5 py-2.5 border-b border-[#242426] flex items-center gap-2 text-[10px] text-slate-400 shrink-0 bg-[#0a0a0b]">
          <BookOpen size={11} className="text-purple-400" />
          <span>Lab {activeStep + 1} of 3</span>
          <ChevronRight size={10} className="text-slate-600" />
          <span className="text-slate-200 font-semibold">{STEPS[activeStep].label}</span>
          <span className="ml-auto text-[9px] text-slate-500">{STEPS[activeStep].duration}</span>
          {completedSteps.has(activeStep) && (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 size={11} /> Completed
            </span>
          )}
        </div>

        {/* Instructions panel (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {activeStep === 0 && <Step1Content />}
          {activeStep === 1 && <Step2Content />}
          {activeStep === 2 && <Step3Content />}

          {/* Next / Finish button */}
          <div className="mt-6 flex items-center justify-between border-t border-[#242426] pt-4">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(s => s - 1)}
              className="text-[11px] font-bold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Previous step
            </button>
            {!completedSteps.has(activeStep) ? (
              <button
                onClick={() => markComplete(activeStep)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-5 py-2 rounded-lg transition-colors"
              >
                {activeStep < 2 ? 'Mark complete & Next step →' : 'Finish lab ✓'}
              </button>
            ) : (
              activeStep < 2 && (
                <button
                  onClick={() => setActiveStep(s => s + 1)}
                  className="bg-[#1f1f23] border border-[#2b2b2d] hover:bg-slate-800 text-white text-[11px] font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  Next step <ChevronRight size={13} />
                </button>
              )
            )}
          </div>
        </div>

        {/* Code viewer (sticky bottom) */}
        <div className="shrink-0 border-t border-[#242426] bg-[#050505] flex flex-col" style={{ height: '38%' }}>
          {/* File tabs */}
          <div className="flex items-center border-b border-[#242426] px-3 shrink-0 bg-[#0c0c0d]">
            <div className="flex">
              {FILE_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCodeFile(key)}
                  className={`px-3 py-2 text-[10px] font-mono border-b-2 transition-all ${
                    activeCodeFile === key
                      ? 'border-purple-500 text-purple-300 bg-purple-600/5'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={copyCode}
              className={`ml-auto flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded transition-all mr-2 ${
                copySuccess ? 'bg-emerald-600/20 text-emerald-300' : 'bg-[#1f1f23] text-slate-400 hover:text-white'
              }`}
            >
              {copySuccess ? <Check size={11} /> : <Copy size={11} />}
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Code content */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10.5px] leading-relaxed text-slate-300">
            <pre className="whitespace-pre text-[10px] leading-relaxed">{CODE_FILES[activeCodeFile]}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
