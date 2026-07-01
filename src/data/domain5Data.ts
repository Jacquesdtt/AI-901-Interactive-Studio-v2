import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain5Summary = "Azure AI & Interactive Web Apps (Streamlit). Connecting LLMs and data logic to user interfaces using Azure OpenAI and rapid Python UI frameworks.";

export const domain5Topics: TopicDef[] = [
  {
    name: "Azure OpenAI Workflows",
    desc: "Deploying and consuming models securely on Azure.",
    detail: "Using Entra ID, connection strings, and managed identities to authenticate against Azure OpenAI endpoints, rather than hardcoding API keys."
  },
  {
    name: "Streamlit Fundamentals",
    desc: "Building interactive Data & Chat Apps in Python.",
    detail: "Understanding Streamlit's rerun model, managing page layouts (columns, sidebars), and utilizing Session State to preserve data across interactions."
  },
  {
    name: "GenAI Chat Applications",
    desc: "Building conversational interfaces.",
    detail: "Combining Azure OpenAI API calls with Streamlit's chat elements (st.chat_message, st.chat_input) to build responsive, context-aware chatbot frontends."
  }
];

export const domain5KeyTerms = [
  'Azure OpenAI', 'Streamlit', 'Session State', 'Reruns', 'Entra ID', 'Chat App'
];

export const domain5Misconceptions: MisconceptionDef[] = [
  {
    badge: 'Streamlit State',
    concept: 'Python variables in a Streamlit app persist across button clicks automatically.',
    reality: 'Streamlit reruns the entire python script from top to bottom on every user interaction. Without `st.session_state`, variable values are reset to their initial defaults.',
    description: 'If you build a counter without session state, it will always stay at 1 instead of incrementing.'
  }
];
