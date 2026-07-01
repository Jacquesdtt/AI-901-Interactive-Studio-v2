import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock, MisconceptionBlock } from '../layouts/TheoryBlock';
import GenAiTab from '../visualizers/GenAiTab';
import { Bot } from 'lucide-react';
import { domain4Summary, domain4Topics, domain4KeyTerms, domain4Misconceptions } from '../../data/domain4Data';

export default function Domain4() {
  const theory = (
    <>
      <TheoryBlock 
        summary={domain4Summary}
        topics={domain4Topics}
        keyTerms={domain4KeyTerms}
      />
      <MisconceptionBlock misconceptions={domain4Misconceptions} />
    </>
  );

  return (
    <DomainLayout 
      title="Domain 4: Generative AI Foundations"
      badge="LLMs & Agents"
      icon={<Bot className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={<GenAiTab />}
    />
  );
}
