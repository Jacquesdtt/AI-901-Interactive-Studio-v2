import React from 'react';
import { FileText, Download } from 'lucide-react';

const markdownContent = `# AI-901 Azure AI Fundamentals Cheat Sheet

## 1. Microsoft Foundry SDK Auth
Before invoking models or agents, you must authenticate the session:
\`\`\`python
from foundry import foundry_check_auth, foundry_models_list

# Must be called first!
foundry_check_auth()

models = foundry_models_list()
\`\`\`

## 2. Machine Learning Lifecycle (Mermaid)
\`\`\`mermaid
graph TD
    A[Data Prep] --> B[Model Training]
    B --> C[Evaluation]
    C --> D[Deployment]
    D --> E[Monitoring]
    E -->|Retrain| A
\`\`\`

## 3. RAG Architecture
\`\`\`mermaid
sequenceDiagram
    participant User
    participant App
    participant VectorDB
    participant LLM

    User->>App: Asks question
    App->>VectorDB: Semantic Search for Context
    VectorDB-->>App: Returns top K chunks
    App->>LLM: Prompt + Context Chunks
    LLM-->>App: Grounded Answer
    App-->>User: Final Output
\`\`\`

## 4. Key Metrics
- **Accuracy**: (TP + TN) / Total
- **Precision**: TP / (TP + FP) -> Use when False Positives are costly.
- **Recall**: TP / (TP + FN) -> Use when False Negatives are costly.
- **F1 Score**: Harmonic mean of Precision and Recall.

## 5. MLflow Tracking Commands
Start tracking server:
\`\`\`bash
mlflow server --host 0.0.0.0 --port 5000
\`\`\`
Set experiment:
\`\`\`python
import mlflow
mlflow.set_experiment("my-experiment")
\`\`\`
`;

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
        <div className="prose prose-invert prose-blue max-w-none font-mono text-sm">
          {/* We render the raw markdown so the user can preview what they are downloading */}
          <pre className="bg-[#000000] p-6 rounded-xl border border-white/5 whitespace-pre-wrap text-slate-300">
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
