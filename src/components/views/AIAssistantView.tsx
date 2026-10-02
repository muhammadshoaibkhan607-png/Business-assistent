import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Info,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  ChatMessage,
  KnowledgeBaseData,
  AssistantSettings,
} from '../../types';
import { sendChatMessage } from '../../services/api';
import { useToast } from '../common/Toast';

interface AIAssistantViewProps {
  knowledgeBase: KnowledgeBaseData;
  settings: AssistantSettings;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  knowledgeBase,
  settings,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello! Welcome to ${knowledgeBase.businessProfile.name}. I am your dedicated AI Business Support Assistant.\n\nI can answer questions about our products, pricing tiers, SLAs, operating hours, and service policies using our verified business database. How can I assist you today?`,
      timestamp: 'Just now',
      sources: ['Knowledge Base v2.4', 'Company Profile'],
      intent: 'Welcome Greeting',
      confidence: 1.0,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        text,
        [...messages, userMessage],
        knowledgeBase,
        settings
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        intent: response.intent,
        confidence: response.confidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `I encountered an issue processing your request: ${err.message || 'Please try again.'}. For immediate support, feel free to email ${knowledgeBase.businessProfile.contactEmail}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Support Channel'],
      };
      setMessages((prev) => [...prev, errorMessage]);
      showToast('Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to Clipboard', 'Response copied successfully', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackMap((prev) => ({ ...prev, [id]: type }));
    showToast('Feedback Received', type === 'up' ? 'Marked as helpful' : 'Marked for review', 'info');
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'model',
        text: `Conversation reset. How can I assist you with ${knowledgeBase.businessProfile.name}'s services today?`,
        timestamp: 'Just now',
        sources: ['Knowledge Base'],
      },
    ]);
    showToast('Conversation Cleared', 'Starting a fresh session', 'info');
  };

  // Test chips demonstrating specific capabilities
  const quickTestPrompts = [
    {
      label: 'Pricing & Packages',
      prompt: 'What packages do you offer and what is the monthly cost?',
    },
    {
      label: 'Emergency SLA',
      prompt: 'What is your response time SLA if our production server goes down?',
    },
    {
      label: 'Money-Back Guarantee',
      prompt: 'Is there a refund policy or satisfaction guarantee if we are not happy?',
    },
    {
      label: 'Anti-Hallucination Test',
      prompt: 'Do you offer a $15/month shared web hosting plan with cPanel?',
      note: 'Tests knowledge boundary enforcement',
    },
    {
      label: 'Multi-Cloud Support',
      prompt: 'Do you support Google Cloud Platform and AWS together?',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 pb-4 sm:pb-8 h-[calc(100dvh-7.5rem)] min-h-[500px] flex flex-col">
      {/* Top Header Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Customer Support AI Simulator
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ground Truth
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive customer chat with verified knowledge base citations & anti-hallucination guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 hover:text-white transition-all border border-slate-700/60 min-h-[36px]"
            title="Clear and reset chat history"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Inquiry Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 shrink-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Test scenarios:</span>
        </span>
        {quickTestPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.prompt)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all shrink-0 whitespace-nowrap shadow-sm min-h-[36px]"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-4 max-w-3xl ${
                  isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAI
                      ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isAI ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1.5 max-w-[88%] sm:max-w-[78%]">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-sm break-words ${
                      isAI
                        ? 'bg-slate-900/90 text-slate-100 border border-slate-800'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* AI Metadata & Grounded Sources */}
                  {isAI && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {msg.intent && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-medium border border-slate-700/60">
                            {msg.intent}
                          </span>
                        )}
                        {msg.sources && msg.sources.length > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Grounded: {msg.sources.join(', ')}</span>
                          </span>
                        )}
                        {msg.confidence !== undefined && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(msg.confidence * 100)}% match
                          </span>
                        )}
                      </div>

                      {/* Action buttons (Copy, Thumbs) */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            feedbackMap[msg.id] === 'up'
                              ? 'text-emerald-400'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="Helpful response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            feedbackMap[msg.id] === 'down'
                              ? 'text-rose-400'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!isAI && (
                    <div className="text-[10px] text-slate-400 text-right pr-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 max-w-3xl mr-auto animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] text-slate-400">Consulting business knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask a question as a customer (e.g. "What is your refund policy?")`}
              disabled={isLoading}
              className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-base sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors min-h-[44px]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 min-h-[44px]"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.8 Flash • Grounded</span>
            <span className="hidden sm:inline">Natural language with multi-turn context</span>
          </div>
        </div>
      </div>
    </div>
  );
};
