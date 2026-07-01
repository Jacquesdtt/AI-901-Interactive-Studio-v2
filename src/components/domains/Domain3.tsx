import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import PyTorchInspector from '../visualizers/PyTorchInspector';
import { Network } from 'lucide-react';
import { domain3Summary, domain3Topics, domain3KeyTerms, domain3Misconceptions } from '../../data/domain3Data';

export default function Domain3() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain3Summary}
        topics={domain3Topics}
        keyTerms={domain3KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain3Misconceptions} />
    </>
  );

  return (
    <DomainLayout 
      title="Domain 3: Deep Learning"
      badge="PyTorch Architectures"
      icon={<Network className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={<PyTorchInspector />}
    />
  );
}
