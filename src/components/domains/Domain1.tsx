import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import FoundationsTab from '../visualizers/FoundationsTab';
import ResponsibleAiTab from '../ResponsibleAiTab';
import CLTSimulator from '../visualizers/CLTSimulator';
import { Brain } from 'lucide-react';
import { domain1Summary, domain1Topics, domain1KeyTerms, domain1Misconceptions } from '../../data/domain1Data';

export default function Domain1() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain1Summary}
        topics={domain1Topics}
        keyTerms={domain1KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain1Misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'clt', label: 'CLT Simulator', component: <CLTSimulator /> },
        { id: 'foundations', label: 'Data Distributions', component: <FoundationsTab /> },
        { id: 'responsible', label: 'Responsible AI Scenarios', component: <ResponsibleAiTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 1: Foundations & Visualisation"
      badge="Probability & Stats"
      icon={<Brain className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
