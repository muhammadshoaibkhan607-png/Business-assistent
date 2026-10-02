import React from 'react';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Wand2,
  Database,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openConversationsCount: number;
  hotLeadsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentPreset?: string;
  onSelectPreset?: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openConversationsCount,
  hotLeadsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  currentPreset,
  onSelectPreset,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assistant' as ActiveTab,
      label: 'AI Assistant',
      icon: Bot,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'conversations' as ActiveTab,
      label: 'Conversations',
      icon: MessageSquare,
      badge: openConversationsCount > 0 ? `${openConversationsCount} open` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'automations' as ActiveTab,
      label: 'Automations',
      icon: Wand2,
      badge: '5 Tools',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'knowledge' as ActiveTab,
      label: 'Knowledge Base',
      icon: Database,
      badge: null,
    },
    {
      id: 'leads' as ActiveTab,
      label: 'Customers & Leads',
      icon: Users,
      badge: hotLeadsCount > 0 ? `${hotLeadsCount} hot` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
      <div className="space-y-5">
        {/* Mobile Header with Close & Preset Selector */}
        <div className="md:hidden flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-sm text-white">OmniPulse Navigation</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Preset Switcher */}
        {onSelectPreset && currentPreset && (
          <div className="md:hidden p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-400" />
              Active Business Context:
            </span>
            <select
              value={currentPreset}
              onChange={(e) => {
                onSelectPreset(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
            >
              <option value="apex">ApexCloud Solutions (B2B SaaS)</option>
              <option value="lumina">Lumina Nutrition (D2C Health)</option>
            </select>
          </div>
        )}

        {/* Main Nav Group */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/25 to-violet-600/15 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Automation Highlight Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900/80 border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">AI Guardrail Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Strict ground truth verification prevents hallucinations by citing verified knowledge documents.
          </p>
        </div>
      </div>

      {/* Footer Profile / Tech details */}
      <div className="pt-4 border-t border-slate-800/80 mt-4">
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
            <span className="text-[11px]">SLA 99.99% Uptime</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v2.5 PRO</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-md shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-slate-950 border-r border-slate-800 h-full z-10 shadow-2xl flex flex-col">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
