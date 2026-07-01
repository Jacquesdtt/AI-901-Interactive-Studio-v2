import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';

interface JupyterMarkdownProps {
  content: string;
  variant?: 'docs' | 'chat';
}

export default function JupyterMarkdown({ content, variant = 'docs' }: JupyterMarkdownProps) {
  const isChat = variant === 'chat';

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className={isChat ? "mb-2 text-slate-300 leading-normal text-xs" : "mb-4 text-slate-300 leading-relaxed text-sm"}>
            {children}
          </p>
        ),
        h1: ({ children }) => (
          <h1 className={isChat ? "text-sm font-bold text-white mb-2 mt-3" : "text-xl font-bold text-white mb-3 mt-4"}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className={isChat ? "text-xs font-bold text-slate-200 mb-1.5 mt-3" : "text-lg font-bold text-white mb-2 mt-4"}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={isChat ? "text-xs font-bold text-slate-300 mb-1 mt-2" : "text-base font-bold text-slate-200 mb-2 mt-3"}>
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className={isChat ? "list-disc pl-4 mb-2 space-y-0.5 text-slate-300 text-xs" : "list-disc pl-5 mb-4 space-y-1 text-slate-300 text-sm"}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={isChat ? "list-decimal pl-4 mb-2 space-y-0.5 text-slate-300 text-xs" : "list-decimal pl-5 mb-4 space-y-1 text-slate-300 text-sm"}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-slate-300">
            {children}
          </li>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#0078d4] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            {children}
            {!isChat && <ExternalLink size={12} className="inline" />}
          </a>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <div className={isChat ? "my-2 rounded-lg overflow-hidden border border-slate-850 bg-slate-950/60 shadow-inner" : "my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 shadow-inner"}>
              <div className={isChat ? "flex items-center justify-between px-3 py-1 bg-slate-950 border-b border-slate-900 text-[9px] font-mono text-slate-500" : "flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[10px] font-mono text-slate-400"}>
                <span>{match ? match[1].toUpperCase() : 'CODE'}</span>
                <span className={isChat ? "text-slate-500 text-[9px]" : "text-slate-500 text-[9px]"}>Jupyter Cell</span>
              </div>
              <pre className={isChat ? "p-3 overflow-x-auto font-mono text-[11px] text-slate-200 border-l-4 border-[#0078d4] bg-slate-900/20" : "p-4 overflow-x-auto font-mono text-xs md:text-sm text-slate-200 border-l-4 border-[#0078d4] bg-slate-900/40"}>
                <code {...props}>{String(children).replace(/\n$/, '')}</code>
              </pre>
            </div>
          ) : (
            <code className={isChat ? "bg-slate-800 px-1 py-0.5 rounded text-[11px] font-mono text-[#8c88fb]" : "bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-[#8c88fb]"} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
