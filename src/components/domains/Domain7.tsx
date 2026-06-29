import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import MLOpsSimulator from '../visualizers/MLOpsSimulator';
import LifecycleIntegrationTab from '../visualizers/LifecycleIntegrationTab';
import { ShieldAlert } from 'lucide-react';

const topics = [
  {
    name: "Test Dataset (Inputs & Ground Truth)",
    desc: "Provides the baseline for measuring model performance.",
    detail: "Contains gold-standard test prompts paired with human-validated expected responses (Ground Truth). Automated evaluation is only as good as the grounding dataset."
  },
  {
    name: "Target AI Model (Generator)",
    desc: "The system or LLM configuration under test.",
    detail: "Receives inputs and dynamically generates outputs to be evaluated. It can be custom prompted to optimize task accuracy."
  },
  {
    name: "Evaluator LLM",
    desc: "Benchmarks generated outputs against Ground Truth.",
    detail: "A highly capable model (often GPT-4 class) programmed with strict evaluation rubrics to grade outputs returning numeric scores and reasoning sentences."
  },
  {
    name: "Metrics Parser & Compiler",
    desc: "Converts conversational judge output into numeric performance grades.",
    detail: "Extracts scores (F1, Coherence scale, Groundedness ratio) from the Evaluator LLM's raw responses. Allows CI/CD pipelines to fail if quality drops."
  },
  {
    name: "Azure AI Evaluation Dashboard",
    desc: "Unified visualization pane for reviewing AI deployment readiness.",
    detail: "Provides audit trails required under the Transparency principle of Responsible AI."
  }
];

const keyTerms = ['MLOps', 'CI/CD', 'Evaluation Metrics', 'Ground Truth', 'Evaluator LLM', 'Quality Gates'];

const misconceptions = [
  {
    concept: "AI-901 Exam Theory",
    reality: "Enterprise AI Engineering Reality",
    description: "How theoretical Azure service limits compare to real-world cloud deployment architectures.",
    badge: "Architecture & SDK"
  }
];

export default function Domain7() {
  const theory = (
    <>
      <TheoryBlock 
        summary="Master the end-to-end Machine Learning Operations (MLOps) lifecycle. Includes automated CI/CD pipelines, LLM-Assisted Evaluation nodes, and enterprise-grade quality gates."
        topics={topics}
        keyTerms={keyTerms}
      />
      <MisconceptionBlock misconceptions={misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'mlops', label: 'MLflow CI/CD Scrubber', component: <MLOpsSimulator /> },
        { id: 'integration', label: 'Integration Flow', component: <LifecycleIntegrationTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 7: MLOps & Integration"
      badge="Enterprise AI"
      icon={<ShieldAlert className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
