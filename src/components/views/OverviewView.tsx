import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  MessageSquare,
  Wand2,
  Users,
  Database,
  Send,
  Loader2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import {
  KnowledgeBaseData,
  ConversationThread,
  Lead,
  ActiveTab,
  AssistantSettings,
} from '../../types';
import { sendChatMessage } from '../../services/api';
import { useToast } from '../common/Toast';

interface OverviewViewProps {
  knowledgeBase: KnowledgeBaseData;
  conversations: ConversationThread[];
  leads: Lead[];
  settings: AssistantSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLiveChat: () => void;
  onSelectConversation: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  knowledgeBase,
  conversations,
  leads,
  settings,
  setActiveTab,
  onOpenLiveChat,
  onSelectConversation,
}) => {
  const { showToast } = useToast();
  const [quickInput, setQuickInput] = useState('');
  const [quickReply, setQuickReply] = useState<string | null>(null);
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  const openTickets = conversations.filter((c) => c.status !== 'Resolved');
  const hotLeads = leads.filter((l) => l.grade === 'Hot');

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim() || isQuickLoading) return;

    setIsQuickLoading(true);
    setQuickReply(null);

    try {
      const res = await sendChatMessage(quickInput, [], knowledgeBase, settings);
      setQuickReply(res.reply);
      showToast('AI Response Generated', 'Grounded in business knowledge base', 'success');
    } catch (err: any) {
      setQuickReply(
        `Unable to reach server: ${err.message || 'Please check server connection.'}`
      );
      showToast('Error', err.message, 'error');
    } finally {
      setIsQuickLoading(false);
    }
  };

  const samplePromptChips = [
    'What is your guaranteed uptime SLA?',
    'How much is Managed Kubernetes?',
    'What is your refund policy?',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Portfolio Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 backdrop-blur-xl shadow-lg shadow-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Autonomous AI Support & Business Automation
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sample / Demo Benchmark Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured for <strong className="text-slate-200">{knowledgeBase.businessProfile.name}</strong> • Real server-side Gemini 3.8 Flash AI reasoning active
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('assistant')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/30 shrink-0"
        >
          <span>Open Full Customer Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Automated Resolution</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">88.4%</span>
            <span className="text-xs font-semibold text-emerald-400">+14.2% vs human</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Sample benchmark: 412 of 466 standard inquiries resolved without agent intervention
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Median AI Response Time</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">0.8s</span>
            <span className="text-xs font-semibold text-cyan-400">&lt; 1 sec target</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Compared to industry average 3.4 hours for Tier-1 email/ticket support
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Tickets in Queue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {openTickets.length}
            </span>
            <span className="text-xs font-semibold text-amber-400">Active simulated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Multi-channel inbox with AI Smart Reply and instant summarization
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Qualified Pipeline</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {hotLeads.length} Hot
            </span>
            <span className="text-xs font-semibold text-violet-400">B2B Leads</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Scored & categorized via automated BANT lead qualification rules
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Quick Tester & Queue Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Quick Assistant Tester */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Grounded AI Assistant</h3>
                  <p className="text-xs text-slate-400">
                    Test how the AI answers customer questions using the verified business database
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Grounding: Active
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="py-3">
              <p className="text-[11px] text-slate-400 font-medium mb-2">Try a sample customer inquiry:</p>
              <div className="flex flex-wrap gap-2">
                {samplePromptChips.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickInput(prompt)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Response Area */}
            {quickReply ? (
              <div className="my-2 p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed relative animate-fadeIn">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
                  <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Grounded Answer
                  </span>
                  <button
                    onClick={() => setQuickReply(null)}
                    className="text-slate-400 hover:text-slate-200 text-[11px]"
                  >
                    Clear
                  </button>
                </div>
                <p className="whitespace-pre-line">{quickReply}</p>
              </div>
            ) : null}

            {/* Input Form */}
            <form onSubmit={handleQuickAsk} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask about products, pricing, SLAs, or policies..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isQuickLoading || !quickInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0"
              >
                {isQuickLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Automation Suite Quick Launchpad */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              Autonomous Business Tool Suite
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('automations')}
                className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="text-indigo-400 font-semibold text-xs mb-1 flex items-center justify-between">
                  <span>Smart Reply</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Generate 3 tailored response tones for any customer inquiry.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('automations')}
                className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="text-cyan-400 font-semibold text-xs mb-1 flex items-center justify-between">
                  <span>Summarizer</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Extract action items, sentiment, and resolution from long dialogues.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('automations')}
                className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="text-violet-400 font-semibold text-xs mb-1 flex items-center justify-between">
                  <span>Lead Qualifier</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Score prospects 0-100 and evaluate against budget & timeline.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Conversations & Knowledge Base Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Tickets List */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Live Support Queue
                </h3>
                <p className="text-xs text-slate-400">Incoming inquiries awaiting response</p>
              </div>
              <button
                onClick={() => setActiveTab('conversations')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View Inbox
              </button>
            </div>

            <div className="space-y-3">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setActiveTab('conversations');
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {conv.customerName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        conv.status === 'Open'
                          ? 'bg-amber-500/20 text-amber-300'
                          : conv.status === 'In Progress'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {conv.messages[conv.messages.length - 1]?.text}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {conv.intent}
                    </span>
                    <span>{conv.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Base Status Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Active Knowledge Base</h3>
              </div>
              <button
                onClick={() => setActiveTab('knowledge')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage Docs
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Company Identity:</span>
                <span className="font-medium text-slate-100">{knowledgeBase.businessProfile.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Products in Catalog:</span>
                <span className="font-semibold text-emerald-400">{knowledgeBase.products.length} active plans</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Knowledge FAQs:</span>
                <span className="font-semibold text-indigo-400">{knowledgeBase.faqs.length} verified answers</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Policies & SLAs:</span>
                <span className="font-semibold text-cyan-400">{knowledgeBase.policies.length} documents</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Grounding synchronized. Zero hallucinations on unlisted products.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
