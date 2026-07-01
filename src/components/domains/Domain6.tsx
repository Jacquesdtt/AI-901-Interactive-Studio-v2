import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import NetworkArchitecture from '../visualizers/NetworkArchitecture';
import ContainerisationTab from '../visualizers/ContainerisationTab';
import PipelineVisualiser from '../visualizers/PipelineVisualiser';
import { Box } from 'lucide-react';
import { domain6Summary, domain6Topics, domain6KeyTerms, domain6Misconceptions } from '../../data/domain6Data';

export default function Domain6() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain6Summary}
        topics={domain6Topics}
        keyTerms={domain6KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain6Misconceptions} />
    </>
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'pipeline', label: 'Azure Pipelines CI/CD', component: <PipelineVisualiser /> },
        { id: 'docker', label: 'Docker Build Layers', component: <ContainerisationTab /> },
        { id: 'network', label: 'TCP Handshake', component: <NetworkArchitecture /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 6: DevOps, APIs & Containers"
      badge="Deployment Infrastructure"
      icon={<Box className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
