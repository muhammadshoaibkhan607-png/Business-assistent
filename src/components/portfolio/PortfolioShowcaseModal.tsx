import React from 'react';
import {
  X,
  Briefcase,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Server,
  Zap,
  Bot,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface PortfolioShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioShowcaseModal: React.FC<PortfolioShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyTechSummary = () => {
    const summary = `OmniPulse AI - Autonomous Business Assistant Platform
Architecture: Full-Stack React SPA + Express Server + Google GenAI SDK (gemini-3.8-flash)
Key Capabilities:
1. Grounded Customer Support Chat with source citations & zero-hallucination guardrails
2. Smart Reply Generator with 3 contextual tones & strategic intent reasoning
3. Conversation Summarizer extracting action items, customer sentiment, and resolution status
4. Intent & Urgency Classifier for automated SLA triage and queue routing
5. Professional Customer Email Generator
6. Automated BANT Lead Qualification Engine
Security: 100% server-side API key protection; zero client credential exposure.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Copied Architectural Summary', 'Ready to paste into proposals or client pitches', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 sm:space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Freelance Portfolio Brief</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Client Spec
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Technical overview of how this AI Business Automation platform solves real client operational bottlenecks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Business Problem vs AI Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-rose-500/20 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              The Client Problem
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>
                  <strong>High Support Overhead:</strong> Growing SaaS and e-commerce businesses spend 60-70% of support hours answering repetitive questions about pricing, SLAs, and policies.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>
                  <strong>Slow Response Times:</strong> Leads and distressed customers wait hours for simple confirmations, leading to dropped conversion and churn.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>
                  <strong>Generic Chatbot Slop:</strong> Standard chatbots hallucinate incorrect discounts, unlisted features, or non-existent warranties, creating severe liability.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              The OmniPulse AI Solution
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>
                  <strong>Strict Ground Truth Architecture:</strong> Every answer is grounded directly in the verified Knowledge Base database. The AI strictly refuses to invent unverified terms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>
                  <strong>Automated Triage & Routing:</strong> Instant intent categorization (Product, Support, Complaint, Pricing) and SLA urgency detection.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>
                  <strong>Human-in-the-Loop Velocity:</strong> 1-click Smart Reply, auto-summarization of resolved cases, and B2B lead qualification scoring.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              System Architecture & Security Safeguards
            </h3>
            <button
              onClick={handleCopyTechSummary}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Pitch Spec'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block">Frontend SPA</span>
              <p className="text-slate-200">
                React 19 + TypeScript + Tailwind CSS v4. Mobile-first responsive layout with glassmorphic cards, zero horizontal scroll, and keyboard accessibility.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block">Secure Backend Proxy</span>
              <p className="text-slate-200">
                Node.js Express running on port 3000. All AI credentials remain 100% server-side via <code className="text-indigo-300">process.env</code>. Browser never sees private keys.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block">Gemini 3.8 Flash SDK</span>
              <p className="text-slate-200">
                Direct integration with <code className="text-cyan-300">@google/genai</code> using structured system prompts, source citation injection, and JSON schemas.
              </p>
            </div>
          </div>
        </div>

        {/* Client Deliverables */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Ready for Freelance Client Deployment</h4>
            <p className="text-xs text-slate-400">
              Easily customizable for any business sector (E-Commerce, Legal Tech, B2B SaaS, Health & Wellness) with full knowledge base CRUD and multi-channel API hooks.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            Explore Live Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
