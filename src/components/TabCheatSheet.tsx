import React, { useEffect, useRef } from 'react';
import { FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

const markdownContent = `# AI-901 Azure AI Fundamentals Cheat Sheet

## 1. Microsoft Foundry SDK

### Authentication & Project Client
Initialize the client using connection strings and DefaultAzureCredential:
\`\`\`python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

# Authenticate and construct project client
project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str="YOUR_PROJECT_CONNECTION_STRING"
)
\`\`\`

### Agent Management
Orchestrate agent state and workflows using standard sub-client properties:
\`\`\`python
# Create an agent
agent = project_client.agents.create_agent(
    model="gpt-4o-mini",
    name="ExamHelperAgent",
    instructions="You are an AI-901 expert."
)

# List all agents
agents = project_client.agents.list_agents()

# Retrieve an agent by ID
retrieved_agent = project_client.agents.get_agent(agent_id=agent.id)

# Create a conversation thread
thread = project_client.agents.threads.create()

# Post message to the thread
message = project_client.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Explain RAG architecture."
)

# Run agent and poll response
run = project_client.agents.runs.create_and_process(
    thread_id=thread.id,
    assistant_id=agent.id
)

# Fetch messages (returned in reverse chronological order)
messages = project_client.agents.messages.list(thread_id=thread.id)
for msg in messages:
    print(f"{msg.role}: {msg.text_messages[-1].text.value}")

# Delete the agent
project_client.agents.delete_agent(agent.id)
\`\`\`

### Knowledge Indexes
Reference AI Search indexes through connections:
\`\`\`python
# Fetch an Azure AI Search connection by name
conn = project_client.connections.get("my-search-connection")

# Use in an agent's search tool
from azure.ai.agents.models import AzureAISearchToolDefinition, AzureAISearchToolResource, AISearchIndexResource
search_tool = AzureAISearchToolDefinition(
    azure_ai_search=AzureAISearchToolResource(
        indexes=[AISearchIndexResource(index_connection_id=conn.id, index_name="my-index")]
    )
)
\`\`\`

### Evaluation
Programmatically evaluate generation outputs using the \`azure-ai-evaluation\` library:
\`\`\`python
from azure.ai.evaluation import evaluate, RelevanceEvaluator

# Run a batch evaluation
result = evaluate(
    evaluation_name="ai901-batch-run",
    data="eval_dataset.jsonl",
    evaluators={
        "relevance": RelevanceEvaluator(model_config={"model": "gpt-4o-mini"})
    },
    azure_ai_project={
        "subscription_id": "00000000-0000-0000-0000-000000000000",
        "resource_group_name": "rg-ai901",
        "project_name": "proj-foundry"
    }
)
print(f"Results dashboard: {result['studio_url']}")
\`\`\`

## 2. Machine Learning Lifecycle
\`\`\`mermaid
graph TD
    A[Data Prep & Ingestion] --> B[Model Training & Tuning]
    B --> C[Evaluation & Validation]
    C --> D[Deployment & Packaging]
    D --> E[Monitoring & Logging]
    E -->|Retrain Trigger| A
\`\`\`

## 3. RAG Architecture (Retrieval-Augmented Generation)
\`\`\`mermaid
sequenceDiagram
    participant User
    participant App
    participant VectorDB as Vector Database
    participant LLM as Foundational Model

    User->>App: Asks question
    App->>VectorDB: Semantic Search for Context (Embeddings)
    VectorDB-->>App: Returns top K chunks
    App->>LLM: System Prompt + Context Chunks + User Query
    LLM-->>App: Grounded Answer
    App-->>User: Final Output
\`\`\`

## 4. Key Classification Metrics
- **Accuracy**: \`(TP + TN) / Total\`
  *Use when classes are perfectly balanced.*
- **Precision**: \`TP / (TP + FP)\`
  *Use when False Positives are costly (e.g., spam filtering).*
- **Recall (Sensitivity)**: \`TP / (TP + FN)\`
  *Use when False Negatives are costly (e.g., medical diagnosis).*
- **F1 Score**: Harmonic mean of Precision and Recall.
  *Use when you have imbalanced data.*

## 5. MLflow Tracking Commands
Start tracking server:
\`\`\`bash
mlflow server --host 0.0.0.0 --port 5000
\`\`\`
Set experiment:
\`\`\`python
import mlflow
mlflow.set_experiment("my-experiment")
with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_metric("accuracy", 0.95)
\`\`\`

## 6. Responsible AI Principles
- **Fairness**: AI systems should treat all people fairly.
- **Reliability & Safety**: AI systems should perform reliably and safely.
- **Privacy & Security**: AI systems should be secure and respect privacy.
- **Inclusiveness**: AI systems should empower everyone and engage people.
- **Transparency**: AI systems should be understandable.
- **Accountability**: People should be accountable for AI systems.
`;

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    if (ref.current) {
      // Generate a unique ID to avoid collisions
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      }).catch(e => {
        console.error("Mermaid parsing failed", e);
      });
    }
  }, [chart]);
  
  return <div ref={ref} className="mermaid flex justify-center py-6" />;
};

export default function TabCheatSheet() {
  
  const handleExport = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_901_CheatSheet.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto bg-[#000000] text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#0078d4]" /> Exam Cheat Sheet
          </h2>
          <p className="text-slate-400">Quick reference guide for AI-901 and Microsoft Foundry.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-[#0078d4] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4" /> Export to Markdown
        </button>
      </div>

      <div className="bg-[#050505] border border-[#0078d4]/20 rounded-2xl p-8 shadow-xl">
        <div className="prose prose-invert prose-blue max-w-none text-slate-300">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const {children, className, node, ...rest} = props;
                const match = /language-(\w+)/.exec(className || '');
                if (match && match[1] === 'mermaid') {
                  return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                }
                return (
                  <code {...rest} className={`${className || ''} bg-black/40 rounded px-1.5 py-0.5 text-blue-300`}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
