import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import MLOpsSimulator from '../visualizers/MLOpsSimulator';
import LifecycleIntegrationTab from '../visualizers/LifecycleIntegrationTab';
import ServingArchitecture from '../visualizers/ServingArchitecture';
import { ShieldAlert } from 'lucide-react';
import { domain7Summary, domain7Topics, domain7KeyTerms, domain7Misconceptions } from '../../data/domain7Data';

export default function Domain7() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain7Summary}
        topics={domain7Topics}
        keyTerms={domain7KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain7Misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'serving', label: 'Model Serving Architecture', component: <ServingArchitecture /> },
        { id: 'mlops', label: 'MLflow CI/CD Scrubber', component: <MLOpsSimulator /> },
        { id: 'integration', label: 'Integration Flow', component: <LifecycleIntegrationTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 7: MLOps & Model Serving"
      badge="Enterprise AI"
      icon={<ShieldAlert className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
