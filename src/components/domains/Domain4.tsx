import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import GenAiTab from '../visualizers/GenAiTab';
import VisualizerTab from '../VisualizerTab';
import { Bot } from 'lucide-react';

const topics = [
  {
    name: "Large Language Models (LLMs)",
    desc: "Deep learning models trained on trillions of words.",
    detail: "Predicts the next most probable word (token) in a sequence, generating cohesive human-like text."
  },
  {
    name: "Prompt Engineering",
    desc: "Crafting effective queries to guide LLM output.",
    detail: (
      <div className="space-y-2">
        <p>Leveraging strategies like Zero-Shot, Few-Shot (providing examples), and System instructions to direct model output.</p>
        <ul className="list-disc pl-4 space-y-1 mt-2 text-slate-300">
          <li><strong className="text-teal-400">Zero-Shot:</strong> "Translate 'Hello' to French."</li>
          <li><strong className="text-teal-400">Few-Shot:</strong> "English: Dog = French: Chien. English: Cat = French: Chat. English: Bird = French:"</li>
          <li><strong className="text-teal-400">System Instruction:</strong> "You are an expert translator. Always reply in French."</li>
        </ul>
      </div>
    )
  },
  {
    name: "Copilots & Agents",
    desc: "Orchestration layers wrapping LLM cores.",
    detail: "Extending models with state (threads), security boundaries, and API integrations to automate tasks on behalf of users."
  }
];

const keyTerms = ['Tokens', 'System Message', 'Few-Shot Learning', 'Azure OpenAI', 'Agent Orchestration'];

const misconceptions = [
  {
    concept: "The LLM retains your conversation state inside its brain.",
    reality: "The LLM is stateless. Conversation state is managed by Cloud Threads.",
    description: "LLMs do not store memories between API requests. You must send historical data or rely on Azure AI Foundry Thread instances.",
    badge: "Orchestration"
  },
  {
    concept: "Code Interpreter sandboxes are full virtual machines running continuously.",
    reality: "Sandboxes are lightweight, short-lived micro-containers.",
    description: "Azure launches isolated, ephemeral workspaces on-the-fly to execute the generated code and kills them immediately to save costs.",
    badge: "Compute"
  }
];

export default function Domain4() {
  const theory = (
    <>
      <TheoryBlock 
        summary="Modern large language models, Azure OpenAI studio capabilities, prompting concepts, and orchestration agents."
        topics={topics}
        keyTerms={keyTerms}
      />
      <MisconceptionBlock misconceptions={misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'rag', label: 'RAG Pipeline', component: <GenAiTab /> },
        { id: 'agent', label: 'Agent Visualizer', component: <VisualizerTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 4: Generative AI & Orchestration"
      badge="10-15% of exam"
      icon={<Bot className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
