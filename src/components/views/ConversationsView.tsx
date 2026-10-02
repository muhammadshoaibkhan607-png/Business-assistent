import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Wand2,
  FileText,
  Tag,
  Mail,
  User,
  Bot,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import {
  ConversationThread,
  KnowledgeBaseData,
  AssistantSettings,
  ChatMessage,
} from '../../types';
import {
  generateSmartReplies,
  summarizeConversation,
  classifyIntent,
  generateCustomerEmail,
  SmartReplyItem,
  ConversationSummaryResponse,
  IntentClassificationResponse,
  EmailResponseData,
} from '../../services/api';
import { useToast } from '../common/Toast';

interface ConversationsViewProps {
  conversations: ConversationThread[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationThread[]>>;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  knowledgeBase: KnowledgeBaseData;
  settings: AssistantSettings;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations,
  setConversations,
  selectedConversationId,
  setSelectedConversationId,
  knowledgeBase,
  settings,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [replyInput, setReplyInput] = useState('');

  // AI Modal States
  const [isSmartReplying, setIsSmartReplying] = useState(false);
  const [smartReplies, setSmartReplies] = useState<SmartReplyItem[] | null>(null);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [conversationSummary, setConversationSummary] = useState<ConversationSummaryResponse | null>(null);

  const [isClassifying, setIsClassifying] = useState(false);
  const [intentResult, setIntentResult] = useState<IntentClassificationResponse | null>(null);

  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [draftedEmail, setDraftedEmail] = useState<EmailResponseData | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active selected thread
  const activeConversation = conversations.find(
    (c) => c.id === (selectedConversationId || conversations[0]?.id)
  );

  // Filter threads
  const filteredConversations = conversations.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendAgentReply = () => {
    if (!replyInput.trim() || !activeConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'model',
      text: replyInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['Agent Manual / Smart Assist'],
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastUpdated: 'Just now',
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );

    setReplyInput('');
    showToast('Reply Sent', 'Agent response added to thread', 'success');
  };

  const handleTriggerSmartReply = async () => {
    if (!activeConversation) return;
    const lastUserMessage = [...activeConversation.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) {
      showToast('No User Message', 'No incoming customer query found to reply to', 'info');
      return;
    }

    setIsSmartReplying(true);
    setSmartReplies(null);

    try {
      const res = await generateSmartReplies(
        lastUserMessage.text,
        `Customer: ${activeConversation.customerName}, Intent: ${activeConversation.intent}`,
        knowledgeBase
      );
      setSmartReplies(res);
      showToast('Smart Replies Ready', 'Generated 3 contextual response options', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSmartReplying(false);
    }
  };

  const handleTriggerSummarize = async () => {
    if (!activeConversation) return;
    const dialogue = activeConversation.messages
      .map((m) => `${m.role === 'user' ? activeConversation.customerName : 'Assistant'}: ${m.text}`)
      .join('\n');

    setIsSummarizing(true);
    setConversationSummary(null);

    try {
      const res = await summarizeConversation(dialogue, activeConversation.customerName, activeConversation.intent);
      setConversationSummary(res);

      // Save summary onto the thread object
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id ? { ...c, aiSummary: res.executiveSummary } : c
        )
      );

      showToast('Summary Generated', 'Saved to conversation record', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTriggerClassify = async () => {
    if (!activeConversation) return;
    const lastUserMessage = [...activeConversation.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    setIsClassifying(true);
    setIntentResult(null);

    try {
      const res = await classifyIntent(lastUserMessage.text);
      setIntentResult(res);

      // Update thread intent tag and priority
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                intent: res.intent,
                priority: res.urgency,
              }
            : c
        )
      );

      showToast('Intent Classified', `${res.intent} • Urgency: ${res.urgency}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleTriggerDraftEmail = async () => {
    if (!activeConversation) return;
    const lastUserMessage = [...activeConversation.messages].reverse().find((m) => m.role === 'user');

    setIsDraftingEmail(true);
    setDraftedEmail(null);

    try {
      const res = await generateCustomerEmail({
        type: 'support_resolution',
        customerName: activeConversation.customerName,
        customerEmail: activeConversation.customerEmail,
        context: lastUserMessage ? lastUserMessage.text : 'Customer inquiry discussion',
        keyPoints: [
          'Confirmed knowledge base documentation and SLA policy',
          'Immediate action plan verified by support',
        ],
        tone: 'professional and courteous',
        knowledgeBase,
      });

      setDraftedEmail(res);
      showToast('Email Drafted', 'Ready to review and send', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsDraftingEmail(false);
    }
  };

  const handleUpdateStatus = (newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, status: newStatus } : c))
    );
    showToast('Status Updated', `Ticket marked as ${newStatus}`, 'info');
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied', 'Text copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 pb-4 sm:pb-8 h-[calc(100dvh-7.5rem)] min-h-[520px] flex flex-col">
      {/* Container with Responsive Split Layout */}
      <div className="flex-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {/* Left: Threads List (hidden on mobile if a thread is opened) */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-800/80 flex flex-col shrink-0 bg-slate-950/40 ${
            selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* List Search & Filter Header */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Customer Inquiries
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {conversations.length} total
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, intent, email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No conversations found matching filters.
              </div>
            ) : (
              filteredConversations.map((thread) => {
                const isSelected = activeConversation?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedConversationId(thread.id)}
                    className={`p-3.5 transition-all cursor-pointer hover:bg-slate-900/60 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={thread.avatar}
                          alt={thread.customerName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {thread.customerName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {thread.customerEmail}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          thread.status === 'Open'
                            ? 'bg-amber-500/20 text-amber-300'
                            : thread.status === 'In Progress'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {thread.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                      {lastMsg?.text || 'No messages yet'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 truncate max-w-[120px]">
                        {thread.intent}
                      </span>
                      <span>{thread.lastUpdated}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Thread Details & Message Area */}
        {activeConversation ? (
          <div className={`flex-1 flex-col bg-slate-950/20 overflow-hidden ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
            {/* Header: Customer Profile & Automation Buttons */}
            <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  aria-label="Back to threads"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.customerName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {activeConversation.customerName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {activeConversation.channel}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeConversation.priority === 'Urgent' || activeConversation.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {activeConversation.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {activeConversation.customerEmail} • Intent: <strong className="text-indigo-300">{activeConversation.intent}</strong>
                  </p>
                </div>
              </div>

              {/* Status Switcher & Instant AI Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={activeConversation.status}
                  onChange={(e) =>
                    handleUpdateStatus(e.target.value as 'Open' | 'In Progress' | 'Resolved')
                  }
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="Open">Status: Open</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Resolved">Status: Resolved</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTriggerSmartReply}
                    disabled={isSmartReplying}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    title="Generate 3 contextual responses"
                  >
                    {isSmartReplying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span>Smart Reply</span>
                  </button>

                  <button
                    onClick={handleTriggerSummarize}
                    disabled={isSummarizing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                    title="Summarize conversation into action items"
                  >
                    {isSummarizing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>Summarize</span>
                  </button>

                  <button
                    onClick={handleTriggerClassify}
                    disabled={isClassifying}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                    title="Classify intent and urgency"
                  >
                    {isClassifying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Classify</span>
                  </button>

                  <button
                    onClick={handleTriggerDraftEmail}
                    disabled={isDraftingEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                    title="Draft email reply"
                  >
                    {isDraftingEmail ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Reply Drawer if open */}
            {smartReplies && (
              <div className="p-4 bg-indigo-950/40 border-b border-indigo-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Smart Reply Options:
                  </span>
                  <button
                    onClick={() => setSmartReplies(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {smartReplies.map((reply, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-indigo-400">
                            {reply.tone}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed mb-2">
                          "{reply.text}"
                        </p>
                        <p className="text-[10px] text-slate-400 italic mb-3">
                          {reply.reasoning}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setReplyInput(reply.text);
                          setSmartReplies(null);
                          showToast('Inserted to Composer', 'You can edit or send directly', 'info');
                        }}
                        className="w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-medium transition-colors text-center"
                      >
                        Use This Reply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Drawer if open */}
            {conversationSummary && (
              <div className="p-4 bg-cyan-950/30 border-b border-cyan-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    AI Conversation Summary & Action Items:
                  </span>
                  <button
                    onClick={() => setConversationSummary(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  <strong>Executive Summary:</strong> {conversationSummary.executiveSummary}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300">Action Items:</span>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5 mt-1">
                      {conversationSummary.keyActionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div>
                      <strong>Customer Sentiment:</strong>{' '}
                      <span className="text-slate-200 font-medium">
                        {conversationSummary.customerSentiment}
                      </span>
                    </div>
                    <div>
                      <strong>Suggested Follow-up:</strong>{' '}
                      <span className="text-slate-200 font-medium">
                        {conversationSummary.suggestedFollowUp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Intent Drawer if open */}
            {intentResult && (
              <div className="p-4 bg-amber-950/30 border-b border-amber-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Intent & Triage Evaluation:
                  </span>
                  <button
                    onClick={() => setIntentResult(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Detected Intent</span>
                    <span className="font-semibold text-white">{intentResult.intent}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Urgency Level</span>
                    <span className="font-semibold text-rose-400">{intentResult.urgency}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Customer Sentiment</span>
                    <span className="font-semibold text-indigo-300">{intentResult.sentiment}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Routing Queue</span>
                    <span className="font-semibold text-emerald-400">
                      {intentResult.recommendedDepartment}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Draft Drawer if open */}
            {draftedEmail && (
              <div className="p-4 bg-purple-950/30 border-b border-purple-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Generated Customer Email Draft:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard('draft-email', `${draftedEmail.subject}\n\n${draftedEmail.body}`)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'draft-email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Email</span>
                    </button>
                    <button
                      onClick={() => setDraftedEmail(null)}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                  <p>
                    <strong className="text-slate-400">Subject:</strong>{' '}
                    <span className="text-white font-medium">{draftedEmail.subject}</span>
                  </p>
                  <div className="pt-2 border-t border-slate-800 whitespace-pre-line text-slate-200 leading-relaxed font-sans">
                    {draftedEmail.body}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeConversation.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-2xl ${
                      isUser ? 'mr-auto' : 'ml-auto flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                        isUser
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1 max-w-[85%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-slate-900 border border-slate-800 text-slate-200'
                            : 'bg-indigo-600/90 text-white border border-indigo-500/40 rounded-tr-none'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      <div
                        className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                          isUser ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.sources && (
                          <span className="text-emerald-400">({msg.sources.join(', ')})</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAgentReply();
                  }}
                  placeholder={`Reply to ${activeConversation.customerName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendAgentReply}
                  disabled={!replyInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
            Select a conversation thread from the left to view messages and run automations.
          </div>
        )}
      </div>
    </div>
  );
};
