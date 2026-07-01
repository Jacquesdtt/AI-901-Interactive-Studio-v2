import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import ContentUnderstandingTab from '../ContentUnderstandingTab';
import GuardrailsTab from '../GuardrailsTab';
import StreamlitVisualiser from '../visualizers/StreamlitVisualiser';
import { Server } from 'lucide-react';
import { domain5Summary, domain5Topics, domain5KeyTerms, domain5Misconceptions } from '../../data/domain5Data';

export default function Domain5() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain5Summary}
        topics={domain5Topics}
        keyTerms={domain5KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain5Misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'streamlit', label: 'Streamlit Reruns', component: <StreamlitVisualiser /> },
        { id: 'guardrails', label: 'Content Safety Config', component: <GuardrailsTab /> },
        { id: 'content', label: 'Multimodal Parsing', component: <ContentUnderstandingTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 5: Azure AI & Web Apps"
      badge="Streamlit & SDK"
      icon={<Server className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
