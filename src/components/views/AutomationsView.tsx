import React, { useState } from 'react';
import {
  Wand2,
  FileText,
  Tag,
  Mail,
  Users,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { KnowledgeBaseData, AssistantSettings } from '../../types';
import {
  generateSmartReplies,
  summarizeConversation,
  classifyIntent,
  generateCustomerEmail,
  qualifyLeadData,
  SmartReplyItem,
  ConversationSummaryResponse,
  IntentClassificationResponse,
  EmailResponseData,
  LeadQualificationResponse,
} from '../../services/api';
import { useToast } from '../common/Toast';

interface AutomationsViewProps {
  knowledgeBase: KnowledgeBaseData;
  settings: AssistantSettings;
}

type AutomationTool = 'smart-reply' | 'summarize' | 'intent' | 'email' | 'lead-qualify';

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  knowledgeBase,
  settings,
}) => {
  const { showToast } = useToast();
  const [activeTool, setActiveTool] = useState<AutomationTool>('smart-reply');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Smart Reply State
  const [smartInput, setSmartInput] = useState(
    'Hi, we run an online store doing about $250k/mo. Our current hosting crashed twice during Black Friday. What is your Kubernetes SLA and can you migrate us without downtime?'
  );
  const [smartContext, setSmartContext] = useState('High-value e-commerce prospect');
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartResults, setSmartResults] = useState<SmartReplyItem[] | null>(null);

  // 2. Summarizer State
  const [summaryInput, setSummaryInput] = useState(
`Customer (Alex): Hi team, we experienced a deployment failure at 03:00 AM on our staging Kubernetes cluster.
Support: Hi Alex, I see the incident ticket. Our on-call DevOps engineer analyzed the replica set and found an out-of-memory error on pod worker-2.
Customer (Alex): Understood. Is there an automated auto-scaling rule we can enable to prevent memory crashes?
Support: Yes, under your Managed Kubernetes Accelerator plan, we can activate the Horizontal Pod Autoscaler (HPA) and configure memory request limits to 2Gi per replica. We will roll out the updated Helm values today.
Customer (Alex): That would be fantastic. Please also update our Grafana alert thresholds so our engineering team gets paged if memory exceeds 80%.
Support: Will do. We have created Jira ticket OPS-884 to apply the HPA and alert rules by 2:00 PM EST.`
  );
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<ConversationSummaryResponse | null>(null);

  // 3. Intent & Urgency Classifier State
  const [intentInput, setIntentInput] = useState(
    'URGENT: Our production payment gateway is throwing 502 Bad Gateway errors right now! Our customers cannot check out!'
  );
  const [intentLoading, setIntentLoading] = useState(false);
  const [intentResult, setIntentResult] = useState<IntentClassificationResponse | null>(null);

  // 4. Email Response Generator State
  const [emailScenario, setEmailScenario] = useState('support_resolution');
  const [emailCustomerName, setEmailCustomerName] = useState('Sarah Vance');
  const [emailCustomerEmail, setEmailCustomerEmail] = useState('sarah.vance@finscale.io');
  const [emailContext, setEmailContext] = useState(
    'Customer inquired about SOC2 compliance validation and asked for our SLA agreement.'
  );
  const [emailKeyPoints, setEmailKeyPoints] = useState(
    'Attached our SOC2 Type II compliance summary; confirmed 99.99% uptime guarantee; offered 15-min discovery call with Lead Architect'
  );
  const [emailTone, setEmailTone] = useState('Professional and reassuring');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<EmailResponseData | null>(null);

  // 5. Lead Qualification State
  const [leadName, setLeadName] = useState('Jonathan Reynolds');
  const [leadCompany, setLeadCompany] = useState('Apex FinTech Global');
  const [leadBudget, setLeadBudget] = useState('$5,000 - $10,000 / month');
  const [leadTimeline, setLeadTimeline] = useState('Immediate (Next 2 weeks)');
  const [leadTeamSize, setLeadTeamSize] = useState('45 engineers');
  const [leadRequirements, setLeadRequirements] = useState(
    'Need automated multi-region Kubernetes failover on AWS with 24/7 incident response SLA for FinTech banking compliance.'
  );
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadResult, setLeadResult] = useState<LeadQualificationResponse | null>(null);

  // Copy helper
  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to Clipboard', text.slice(0, 50) + '...', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Run Smart Reply
  const handleRunSmartReply = async () => {
    if (!smartInput.trim() || smartLoading) return;
    setSmartLoading(true);
    setSmartResults(null);
    try {
      const res = await generateSmartReplies(smartInput, smartContext, knowledgeBase);
      setSmartResults(res);
      showToast('Smart Replies Generated', '3 distinct options ready', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setSmartLoading(false);
    }
  };

  // 2. Run Summarizer
  const handleRunSummarizer = async () => {
    if (!summaryInput.trim() || summaryLoading) return;
    setSummaryLoading(true);
    setSummaryResult(null);
    try {
      const res = await summarizeConversation(summaryInput, 'Alex (Customer)', 'DevOps Incident');
      setSummaryResult(res);
      showToast('Conversation Summarized', 'Key items and sentiment extracted', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setSummaryLoading(false);
    }
  };

  // 3. Run Intent Classification
  const handleRunIntent = async () => {
    if (!intentInput.trim() || intentLoading) return;
    setIntentLoading(true);
    setIntentResult(null);
    try {
      const res = await classifyIntent(intentInput);
      setIntentResult(res);
      showToast('Intent Classified', `${res.intent} • ${res.urgency} urgency`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIntentLoading(false);
    }
  };

  // 4. Run Email Generator
  const handleRunEmail = async () => {
    if (!emailContext.trim() || emailLoading) return;
    setEmailLoading(true);
    setEmailResult(null);
    try {
      const points = emailKeyPoints.split(';').map((p) => p.trim()).filter(Boolean);
      const res = await generateCustomerEmail({
        type: emailScenario,
        customerName: emailCustomerName,
        customerEmail: emailCustomerEmail,
        context: emailContext,
        keyPoints: points,
        tone: emailTone,
        knowledgeBase,
      });
      setEmailResult(res);
      showToast('Email Drafted', 'Formatted email ready to send', 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  // 5. Run Lead Qualification
  const handleRunLeadQualify = async () => {
    if (!leadName.trim() || leadLoading) return;
    setLeadLoading(true);
    setLeadResult(null);
    try {
      const res = await qualifyLeadData({
        name: leadName,
        company: leadCompany,
        budget: leadBudget,
        timeline: leadTimeline,
        requirements: leadRequirements,
        teamSize: leadTeamSize,
      });
      setLeadResult(res);
      showToast('Lead Qualified', `Score: ${res.score}/100 • Grade: ${res.grade}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setLeadLoading(false);
    }
  };

  const toolsList = [
    {
      id: 'smart-reply' as AutomationTool,
      label: 'Smart Reply Studio',
      icon: Wand2,
      desc: 'Instant 3-tone contextual quick responses',
    },
    {
      id: 'summarize' as AutomationTool,
      label: 'Conversation Summarizer',
      icon: FileText,
      desc: 'Action items, sentiment & resolution status',
    },
    {
      id: 'intent' as AutomationTool,
      label: 'Intent & Urgency Classifier',
      icon: Tag,
      desc: 'Routing triage, sentiment & urgency score',
    },
    {
      id: 'email' as AutomationTool,
      label: 'Email Response Generator',
      icon: Mail,
      desc: 'Flawless B2B customer correspondence',
    },
    {
      id: 'lead-qualify' as AutomationTool,
      label: 'Lead Qualification Engine',
      icon: Users,
      desc: 'BANT evaluation, scoring & deal recommendations',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/30 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">AI Automation Studio</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5 Enterprise Modules
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explore standalone business automation engines built for customer support operations, sales qualification, and repetitive workflow reduction.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Server-side Gemini 3.8 Flash execution</span>
          </div>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-none snap-x">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 border min-h-[42px] ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOOL 1: Smart Reply Studio */}
      {activeTool === 'smart-reply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 animate-fadeIn">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  Customer Inquiry Input
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input incoming customer message to generate multi-tone smart replies
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Customer Message:
                </label>
                <textarea
                  rows={4}
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Context / Customer Tier:
                </label>
                <input
                  type="text"
                  value={smartContext}
                  onChange={(e) => setSmartContext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 focus:outline-none focus:border-indigo-500 min-h-[42px]"
                />
              </div>

              <button
                onClick={handleRunSmartReply}
                disabled={smartLoading || !smartInput.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 min-h-[46px]"
              >
                {smartLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Generating 3 Tones...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Smart Replies</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-h-[360px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">Generated Reply Options</h3>
                  <span className="text-[11px] text-slate-400">Contextual Reasoning Included</span>
                </div>

                {smartResults ? (
                  <div className="space-y-3.5">
                    {smartResults.map((reply, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30">
                            {reply.tone}
                          </span>
                          <button
                            onClick={() => copyText(`reply-${idx}`, reply.text)}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedKey === `reply-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-100 leading-relaxed font-sans whitespace-pre-line mb-2">
                          "{reply.text}"
                        </p>
                        <p className="text-[11px] text-slate-400 italic">
                          <strong>Strategic intent:</strong> {reply.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    Click "Generate Smart Replies" to view tailored responses.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: Conversation Summarizer */}
      {activeTool === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Conversation Dialogue Input
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste multi-turn conversation logs to distill action items and sentiment
                </p>
              </div>

              <textarea
                rows={9}
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />

              <button
                onClick={handleRunSummarizer}
                disabled={summaryLoading || !summaryInput.trim()}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
              >
                {summaryLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Key Decisions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Summarize Conversation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">Structured Summary Report</h3>
                  {summaryResult && (
                    <button
                      onClick={() =>
                        copyText('summary-full', JSON.stringify(summaryResult, null, 2))
                      }
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'summary-full' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Report</span>
                    </button>
                  )}
                </div>

                {summaryResult ? (
                  <div className="space-y-4 text-xs">
                    {/* Executive Summary */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                        Executive Summary
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {summaryResult.executiveSummary}
                      </p>
                    </div>

                    {/* Key Action Items */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                        Action Items & Deliverables
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {summaryResult.keyActionItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Meta Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Customer Sentiment</span>
                        <span className="text-xs font-semibold text-white">
                          {summaryResult.customerSentiment}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Resolution Status</span>
                        <span className="text-xs font-semibold text-cyan-400">
                          {summaryResult.resolutionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                      <span className="text-slate-400 block">Suggested Agent Follow-up:</span>
                      <span className="text-slate-200 font-medium">
                        {summaryResult.suggestedFollowUp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 text-xs">
                    Run the summarizer to extract structured notes and next steps.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: Intent & Urgency Classifier */}
      {activeTool === 'intent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  Inquiry Triage & Intent Detector
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Classifies category, SLA urgency, sentiment, and routed queue
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Raw Customer Query:
                </label>
                <textarea
                  rows={4}
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Sample Pre-fills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Try sample queries:</span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() =>
                      setIntentInput(
                        'We would like a volume discount quote for 5 enterprise clusters starting next quarter.'
                      )
                    }
                    className="text-left text-[11px] p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    "We would like a volume discount quote for 5 enterprise clusters..."
                  </button>
                  <button
                    onClick={() =>
                      setIntentInput(
                        'I was charged twice on my invoice #8892 and no one is replying to my emails!'
                      )
                    }
                    className="text-left text-[11px] p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    "I was charged twice on my invoice #8892 and no one is replying..."
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunIntent}
                disabled={intentLoading || !intentInput.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
              >
                {intentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Intent & Triage...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Classify & Route Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">Triage Classification Result</h3>
                  {intentResult && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Confidence: {Math.round(intentResult.confidence * 100)}%
                    </span>
                  )}
                </div>

                {intentResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block mb-1">Primary Intent</span>
                        <span className="text-xs font-bold text-white">{intentResult.intent}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block mb-1">Urgency Tier</span>
                        <span
                          className={`text-xs font-bold ${
                            intentResult.urgency === 'Critical'
                              ? 'text-rose-400'
                              : intentResult.urgency === 'High'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {intentResult.urgency}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block mb-1">Sentiment</span>
                        <span className="text-xs font-bold text-indigo-300">
                          {intentResult.sentiment}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block mb-1">Assigned Department</span>
                        <span className="text-xs font-bold text-cyan-400">
                          {intentResult.recommendedDepartment}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-300">Classification Reasoning:</span>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">{intentResult.reasoning}</p>
                      </div>
                      {intentResult.keyEntities && intentResult.keyEntities.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-[11px] font-bold text-slate-300">Extracted Entities:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {intentResult.keyEntities.map((ent, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]"
                              >
                                {ent}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 text-xs">
                    Run the classifier to test automated request routing.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: Email Response Generator */}
      {activeTool === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3.5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Email Response Parameters
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Draft executive customer correspondence with appropriate sign-offs
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    value={emailCustomerName}
                    onChange={(e) => setEmailCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Email:
                  </label>
                  <input
                    type="email"
                    value={emailCustomerEmail}
                    onChange={(e) => setEmailCustomerEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Context / Discussion:
                </label>
                <textarea
                  rows={2}
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Points to Include (semicolon separated):
                </label>
                <input
                  type="text"
                  value={emailKeyPoints}
                  onChange={(e) => setEmailKeyPoints(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tone Style:
                </label>
                <select
                  value={emailTone}
                  onChange={(e) => setEmailTone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                >
                  <option value="Professional and reassuring">Professional and reassuring</option>
                  <option value="Direct and action-oriented">Direct and action-oriented</option>
                  <option value="Consultative and enterprise sales">Consultative and enterprise sales</option>
                  <option value="Empathetic apologies & resolution">Empathetic apologies & resolution</option>
                </select>
              </div>

              <button
                onClick={handleRunEmail}
                disabled={emailLoading || !emailContext.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Writing Professional Email...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Email Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">Generated Email Draft</h3>
                  {emailResult && (
                    <button
                      onClick={() =>
                        copyText('email-draft-all', `Subject: ${emailResult.subject}\n\n${emailResult.body}`)
                      }
                      className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'email-draft-all' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Full Email</span>
                    </button>
                  )}
                </div>

                {emailResult ? (
                  <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 font-sans text-xs">
                    <div className="pb-3 border-b border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Subject:</span>
                      <p className="font-bold text-sm text-white">{emailResult.subject}</p>
                    </div>
                    <div className="whitespace-pre-line text-slate-200 leading-relaxed pt-2">
                      {emailResult.body}
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 text-xs">
                    Click "Generate Email Draft" to create customer correspondence.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: Lead Qualification Engine */}
      {activeTool === 'lead-qualify' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3.5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Prospect Profile & BANT Details
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated sales qualification and revenue operations analyzer
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Name:
                  </label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company:
                  </label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Budget Range:
                  </label>
                  <select
                    value={leadBudget}
                    onChange={(e) => setLeadBudget(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="$5,000 - $10,000 / month">$5,000 - $10,000 / mo</option>
                    <option value="$2,000 - $5,000 / month">$2,000 - $5,000 / mo</option>
                    <option value="$1,000 - $2,000 / month">$1,000 - $2,000 / mo</option>
                    <option value="Under $500 / month">Under $500 / mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Timeline:
                  </label>
                  <select
                    value={leadTimeline}
                    onChange={(e) => setLeadTimeline(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="Immediate (Next 2 weeks)">Immediate (&lt; 2 weeks)</option>
                    <option value="1 - 2 months">1 - 2 months</option>
                    <option value="Next quarter">Next quarter</option>
                    <option value="Exploring for next year">Exploring next year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Team Size & Organization:
                </label>
                <input
                  type="text"
                  value={leadTeamSize}
                  onChange={(e) => setLeadTeamSize(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Core Requirements & Use Case:
                </label>
                <textarea
                  rows={3}
                  value={leadRequirements}
                  onChange={(e) => setLeadRequirements(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <button
                onClick={handleRunLeadQualify}
                disabled={leadLoading || !leadName.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {leadLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scoring BANT Criteria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Lead Qualification Score</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-h-[440px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">Lead Qualification Analysis</h3>
                  {leadResult && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        leadResult.grade === 'Hot'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : leadResult.grade === 'Warm'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {leadResult.grade} Lead ({leadResult.score}/100)
                    </span>
                  )}
                </div>

                {leadResult ? (
                  <div className="space-y-4 text-xs">
                    {/* Top Score Banner */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Status:</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {leadResult.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Overall Fit:</span>
                        <span className="text-2xl font-black text-white">
                          {leadResult.score} <span className="text-xs font-normal text-slate-400">/100</span>
                        </span>
                      </div>
                    </div>

                    {/* BANT Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Budget Fit:</span>
                        <span className="font-semibold text-slate-200">
                          {leadResult.breakdown.budgetFit}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Timeline Fit:</span>
                        <span className="font-semibold text-slate-200">
                          {leadResult.breakdown.timelineFit}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Need Urgency:</span>
                        <span className="font-semibold text-slate-200">
                          {leadResult.breakdown.needUrgency}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Authority Tier:</span>
                        <span className="font-semibold text-slate-200">
                          {leadResult.breakdown.authority}
                        </span>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-300 block">
                        Recommended Next Action:
                      </span>
                      <p className="text-white font-medium">{leadResult.recommendedNextStep}</p>
                      <p className="text-[11px] text-slate-400 pt-1">
                        <strong>Suggested Pitch Angle:</strong> {leadResult.suggestedPitch}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 text-xs">
                    Calculate lead score to review BANT breakdown and recommended pipeline actions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
