import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import FoundationsTab from '../visualizers/FoundationsTab';
import ResponsibleAiTab from '../ResponsibleAiTab';
import { Brain } from 'lucide-react';

const topics = [
  {
    name: "Fairness",
    desc: "AI systems should treat all people fairly.",
    detail: "Ensure that system outputs do not exhibit bias based on gender, ethnicity, or group traits. (e.g., An automated recruiting agent must grade resumes equally regardless of applicant demographics)."
  },
  {
    name: "Reliability & Safety",
    desc: "AI systems must perform reliably and safely.",
    detail: "Systems must withstand malicious attacks, edge cases, and unexpected inputs. Includes rigorous testing before deployments. (e.g., Collision avoidance systems in self-driving cars)."
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
];

const keyTerms = ['Responsible AI', 'Fairness', 'Reliability', 'Transparency', 'Inclusiveness', 'Accountability', 'Privacy'];

const misconceptions = [
  {
    concept: "Responsible AI is a simple legal disclaimer checklist at the end of a project.",
    reality: "Responsible AI requires active code-level guardrails, filters, and feedback loops.",
    description: "Azure Content Safety and prompt templates actively block toxic payloads and prompt injection at runtime.",
    badge: "Governance"
  }
];

export default function Domain1() {
  const theory = (
    <>
      <TheoryBlock 
        summary="Covers core AI workloads (Prediction, Anomaly Detection, CV, NLP, Conversational AI) and the six foundational Microsoft Responsible AI Principles."
        topics={topics}
        keyTerms={keyTerms}
      />
      <MisconceptionBlock misconceptions={misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'foundations', label: 'Data Distributions', component: <FoundationsTab /> },
        { id: 'responsible', label: 'Responsible AI Scenarios', component: <ResponsibleAiTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 1: Foundations & Responsible AI"
      badge="15-20% of exam"
      icon={<Brain className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
