import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain4Summary = "Generative AI Foundations. Covers the architecture of Large Language Models (LLMs), Prompting, Retrieval-Augmented Generation (RAG), and AI Agent tool usage.";

export const domain4Topics: TopicDef[] = [
  {
    name: "Generative AI Concepts",
    desc: "How LLMs work at a conceptual level.",
    detail: "Understanding the shift from predictive ML models to generative models based on transformer architectures, capable of zero-shot and few-shot reasoning."
  },
  {
    name: "Retrieval-Augmented Generation (RAG)",
    desc: "Grounding LLMs in enterprise data.",
    detail: "Combining an external retrieval system (e.g., vector search) with an LLM. RAG reduces hallucinations by inserting retrieved facts directly into the prompt context."
  },
  {
    name: "AI Agents and Tool Use",
    desc: "Extending LLM capabilities beyond static text.",
    detail: "Allowing an LLM to trigger external tools (like calculators, web search, or database queries) to execute actions. The LLM decides when and how to call tools based on user prompts."
  }
];

export const domain4KeyTerms = [
  'Generative AI', 'LLM', 'RAG', 'Vector Search', 'AI Agents', 'Function Calling', 'Hallucinations'
];

export const domain4Misconceptions: MisconceptionDef[] = [
  {
    badge: 'LLM Behavior',
    concept: 'LLMs access a real-time database to retrieve facts during generation.',
    reality: 'Standard LLMs generate text based solely on the statistical weights learned during training. They cannot "search" unless explicitly integrated into a RAG or Agentic tool-use framework.',
    description: 'Without RAG or search tools, LLMs frequently hallucinate facts when queried for specific, unseen data.'
  }
];
