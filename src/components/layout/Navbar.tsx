import React from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  ChevronDown,
  Briefcase,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { KnowledgeBaseData } from '../../types';

interface NavbarProps {
  currentPreset: string;
  onSelectPreset: (key: string) => void;
  knowledgeBase: KnowledgeBaseData;
  onOpenPortfolio: () => void;
  onOpenLiveChat: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  onSelectPreset,
  knowledgeBase,
  onOpenPortfolio,
  onOpenLiveChat,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  OmniPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[190px]">
                {knowledgeBase.businessProfile.name}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Business Context Selector & Grounding pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Context:</span>
            <select
              value={currentPreset}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent font-medium text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="apex" className="bg-slate-900 text-slate-100">
                ApexCloud Solutions (B2B SaaS / DevOps)
              </option>
              <option value="lumina" className="bg-slate-900 text-slate-100">
                Lumina Nutrition (D2C HealthTech)
              </option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Gemini 3.8 Flash • Grounded</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenPortfolio}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all shadow-sm shadow-indigo-500/10 min-h-[38px]"
            title="View freelance portfolio brief and architecture"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">Portfolio Brief</span>
            <span className="sm:hidden text-[11px]">Brief</span>
          </button>

          <button
            onClick={onOpenLiveChat}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 min-h-[38px]"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Test Customer Chat</span>
            <span className="sm:hidden text-[11px]">Live Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
