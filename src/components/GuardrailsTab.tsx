import React from 'react';
import { Shield, Filter, Sliders, Lock, Activity, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

const colorMap: Record<string, { text: string; iconBg: string; tipBg: string; tipBorder: string; dot: string; tipText: string }> = {
  teal: {
    text: 'text-teal-400',
    iconBg: 'bg-teal-500/10',
    tipBg: 'bg-teal-950/30',
    tipBorder: 'border-teal-500/20',
    dot: 'bg-teal-500/50',
    tipText: 'text-teal-200/90'
  },
  blue: {
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    tipBg: 'bg-blue-950/30',
    tipBorder: 'border-blue-500/20',
    dot: 'bg-blue-500/50',
    tipText: 'text-blue-200/90'
  },
  purple: {
    text: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    tipBg: 'bg-purple-950/30',
    tipBorder: 'border-purple-500/20',
    dot: 'bg-purple-500/50',
    tipText: 'text-purple-200/90'
  },
  rose: {
    text: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
    tipBg: 'bg-rose-950/30',
    tipBorder: 'border-rose-500/20',
    dot: 'bg-rose-500/50',
    tipText: 'text-rose-200/90'
  },
  emerald: {
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    tipBg: 'bg-emerald-950/30',
    tipBorder: 'border-emerald-500/20',
    dot: 'bg-emerald-500/50',
    tipText: 'text-emerald-200/90'
  },
  amber: {
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    tipBg: 'bg-amber-950/30',
    tipBorder: 'border-amber-500/20',
    dot: 'bg-amber-500/50',
    tipText: 'text-amber-200/90'
  }
};

const guardrailsData = [
  {
    id: 'input',
    title: '1. Input Guardrails (Pre-Inference Shields)',
    icon: <Shield className="w-6 h-6 text-teal-400" />,
    description: 'These prevent malicious or out-of-boundary inputs from reaching the foundation model by leveraging native Azure platform tools.',
    examples: [
      'Azure AI Content Safety (Prompt Shields): Automatically blocking jailbreak attempts and indirect prompt injections before they hit the model pipeline.',
      'Input Category Filtering: Scanning user prompts across the 4 core Microsoft risk vectors: Hate, Sexual, Violence, and Self-Harm.'
    ],
    examTip: 'The exam tests your ability to configure pre-built portal-level defenses within the Azure AI Foundry Playground, rather than writing custom Python string-cleaning algorithms.',
    color: 'teal'
  },
  {
    id: 'output',
    title: '2. Output Guardrails (Post-Inference Filters)',
    icon: <Filter className="w-6 h-6 text-blue-400" />,
    description: 'These validate and sanitize the model\'s response within the content moderation pipeline before delivering it to the end-user.',
    examples: [
      'Severity Threshold Configuration: Setting strict block thresholds (Low, Medium, High) in Azure AI Content Safety to redact or block harmful text generation.',
      'Protected Material Detection: Enabling native toggles to block the output of copyrighted text, lyrics, or proprietary code blocks.',
      'Groundedness Detection: Utilizing Azure\'s evaluation tools to verify if the output is grounded strictly in the provided context documents (RAG verification) to eliminate hallucinations.'
    ],
    examTip: 'Microsoft specifically evaluates your understanding of content moderation pipelines and how to tweak blocklists within the UI.',
    color: 'blue'
  },
  {
    id: 'model',
    title: '3. Model-Level Guardrails (Hyperparameters & System Prompts)',
    icon: <Sliders className="w-6 h-6 text-purple-400" />,
    description: 'Constraints applied directly to the model configuration at the deployment level to control creativity and adherence to instructions.',
    examples: [
      'Deterministic Parameter Tuning: Lowering temperature and top_p in the Azure AI Foundry deployment settings to enforce predictable, accurate outputs for enterprise data tasks.',
      'System Safety Messages: Constructing robust System Prompts within the model playground to ground the AI\'s persona, operational boundaries, and structural rules.'
    ],
    examTip: 'You are expected to know how to manipulate model parameters responsibly inside the portal to optimize safety and data consistency.',
    color: 'purple'
  },
  {
    id: 'security',
    title: '4. Access & Security Guardrails',
    icon: <Lock className="w-6 h-6 text-rose-400" />,
    description: 'Enterprise-grade infrastructure protection that secures the model endpoint, orchestration layers, and underlying data assets.',
    examples: [
      'Microsoft Entra ID & Azure RBAC: Granting explicit, role-based permissions (e.g., Cognitive Services OpenAI Contributor vs. Reader) for project and deployment access.',
      'Azure Key Vault Integration: Securing endpoint keys and connection strings automatically without hardcoding credentials in application environments.'
    ],
    examTip: 'Security is a core component of Microsoft’s Privacy & Security Responsible AI principle. You must know how Azure manages access identity natively.',
    color: 'rose'
  },
  {
    id: 'telemetry',
    title: '5. Telemetry & Monitoring Guardrails',
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    description: 'Observability mechanisms designed to track deployment health, resource consumption, and safety compliance throughout the application lifecycle.',
    examples: [
      'Azure AI Foundry Evaluation Metrics: Running automated baseline evaluations to track model latency, quality metrics, and token utilization.',
      'Prompt Versioning & Run Tracking: Managing prompt variants and auditing execution histories inside the unified Foundry interface.',
      'Safety Trigger Monitoring: Tracking the frequency and types of content safety policy violations via automated logging.'
    ],
    examTip: 'Continuous governance and tracking are emphasized as critical operational phases of the AI lifecycle.',
    color: 'emerald'
  },
  {
    id: 'hitl',
    title: '6. Human-in-the-Loop (HITL) Guardrails',
    icon: <UserCheck className="w-6 h-6 text-amber-400" />,
    description: 'Operational design patterns that ensure human intervention handles edge cases, low-confidence responses, and high-impact actions.',
    examples: [
      'Confidence Threshold Escalation: Routing model outputs with high uncertainty or borderline safety scores to human moderators before final publication.',
      'Agentic Approval Gates: Pausing autonomous system workflows for manual sign-off when an application triggers sensitive external operations.'
    ],
    examTip: 'Directly supports Microsoft’s Accountability and Reliability & Safety principles. The framework demands human oversight for all high-stakes automated decisions.',
    color: 'amber'
  }
];

export default function GuardrailsTab() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="guardrails-tab">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-sm mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>AZURE AI SAFETY ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
          Guardrails & Content Moderation
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl">
          A comprehensive framework for securing AI workloads. Master these six guardrail layers for the AI-901 exam to ensure safe, reliable, and compliant enterprise deployments.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {guardrailsData.map((item) => {
          const style = colorMap[item.color];
          return (
            <div key={item.id} className="bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg transition-all hover:border-white/20">
              {/* Card Header */}
              <div className="p-5 border-b border-white/5 bg-[#121218] flex items-start gap-4">
                <div className={`p-3 ${style.iconBg} rounded-lg shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Examples */}
              <div className="p-5 flex-1 bg-[#0a0a0e]">
                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Implementation Examples</h4>
                <ul className="space-y-4">
                  {item.examples.map((example, i) => {
                    // Simple split by colon to highlight the title of the example
                    const colonIndex = example.indexOf(':');
                    let title = example;
                    let desc = '';
                    if (colonIndex !== -1) {
                      title = example.substring(0, colonIndex);
                      desc = example.substring(colonIndex + 1).trim();
                    }
                    
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} mt-1.5 shrink-0`} />
                        <div className="text-sm">
                          {desc ? (
                            <>
                              <strong className="text-slate-200 font-semibold">{title}:</strong>
                              <span className="text-slate-400 ml-1.5 leading-relaxed inline-block">{desc}</span>
                            </>
                          ) : (
                            <span className="text-slate-400 leading-relaxed">{title}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Exam Tip */}
              <div className={`p-4 ${style.tipBg} border-t ${style.tipBorder}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-4 h-4 ${style.text} shrink-0 mt-0.5`} />
                  <div>
                    <h4 className={`text-[10px] font-mono ${style.text} uppercase tracking-widest font-bold mb-1`}>Why it matters for AI-901</h4>
                    <p className={`text-xs ${style.tipText} leading-relaxed`}>{item.examTip}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
