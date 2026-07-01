import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import MachineLearningTab from '../visualizers/MachineLearningTab';
import { Layers } from 'lucide-react';
import { domain2Summary, domain2Topics, domain2KeyTerms, domain2Misconceptions } from '../../data/domain2Data';

export default function Domain2() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain2Summary}
        topics={domain2Topics}
        keyTerms={domain2KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain2Misconceptions} />
    </>
  );

  return (
    <DomainLayout 
      title="Domain 2: Machine Learning"
      badge="Scikit-Learn Workflows"
      icon={<Layers className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={<MachineLearningTab />}
    />
  );
}
