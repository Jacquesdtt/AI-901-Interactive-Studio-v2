import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import ContentUnderstandingTab from '../ContentUnderstandingTab';
import GuardrailsTab from '../GuardrailsTab';
import { Server } from 'lucide-react';

const topics = [
  {
    name: "Modern SDK vs. REST APIs",
    desc: "Why enterprise systems enforce the official azure-ai-projects package over manual HTTP connection templates.",
    detail: "REST wrappers require custom token refresh loops and manual endpoint routing. SDKs offer type safety, passwordless identity mappings, and centralized connection strings."
  },
  {
    name: "Content Understanding vs Form Recognizer",
    desc: "Extracts structured data from documents, forms, images, and audio/video.",
    detail: "Azure Content Understanding replaces legacy Document Intelligence and Form Recognizer, processing multi-modal documents natively within Foundry."
  },
  {
    name: "Azure Speech vs. Language",
    desc: "Differentiating core AI cognitive services.",
    detail: "Speech handles text-to-speech and transcription. Language handles keyword extraction, entity detection, and sentiment analysis."
  }
];

const keyTerms = ['DefaultAzureCredential', 'Connection Strings', 'Token Management', 'Content Safety', 'Guardrails'];

const misconceptions = [
  {
    concept: "Authentication via hardcoded tokens is fine for fast testing.",
    reality: "Zero-Trust: You must use DefaultAzureCredential & Entra ID.",
    description: "Passwords expire and leak. Modern Azure SDKs enforce passwordless tokens directly mapped to Managed Identities.",
    badge: "Security"
  }
];

export default function Domain5() {
  const theory = (
    <>
      <TheoryBlock 
        summary="Compare the programmatic interfaces of Azure AI services and explore the system flows behind evaluation models and state-authoritative tools."
        topics={topics}
        keyTerms={keyTerms}
      />
      <MisconceptionBlock misconceptions={misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'guardrails', label: 'Content Safety Config', component: <GuardrailsTab /> },
        { id: 'content', label: 'Multimodal Parsing', component: <ContentUnderstandingTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 5: Azure AI Services & Guardrails"
      badge="Foundry SDK"
      icon={<Server className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
