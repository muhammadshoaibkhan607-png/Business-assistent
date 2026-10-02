import { KnowledgeBaseData, AssistantSettings, ChatMessage } from '../types';

export interface ChatResponse {
  reply: string;
  sources: string[];
  intent: string;
  confidence: number;
  timestamp: string;
}

export interface SmartReplyItem {
  tone: string;
  text: string;
  reasoning: string;
}

export interface ConversationSummaryResponse {
  executiveSummary: string;
  keyActionItems: string[];
  customerSentiment: string;
  resolutionStatus: string;
  suggestedFollowUp: string;
  rootCause?: string;
}

export interface IntentClassificationResponse {
  intent: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  sentiment: 'Positive' | 'Neutral' | 'Frustrated' | 'Angry';
  recommendedDepartment: string;
  confidence: number;
  keyEntities: string[];
  reasoning: string;
}

export interface EmailResponseData {
  subject: string;
  body: string;
  previewSnippet: string;
  recommendedSignOff: string;
}

export interface LeadQualificationResponse {
  score: number;
  grade: 'Hot' | 'Warm' | 'Cold';
  status: 'Qualified' | 'Prospect' | 'Unqualified';
  breakdown: {
    budgetFit: string;
    timelineFit: string;
    needUrgency: string;
    authority: string;
  };
  summary: string;
  recommendedNextStep: string;
  suggestedPitch: string;
}

// 1. Send Chat message grounded in current knowledge base
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  knowledgeBase: KnowledgeBaseData,
  settings: AssistantSettings
): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((h) => ({ role: h.role, text: h.text })),
      knowledgeBase,
      settings,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}

// 2. Generate Smart Reply options
export async function generateSmartReplies(
  message: string,
  context?: string,
  knowledgeBase?: KnowledgeBaseData
): Promise<SmartReplyItem[]> {
  const res = await fetch('/api/smart-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context, knowledgeBase }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate smart replies');
  }

  const data = await res.json();
  return data.suggestedReplies || [];
}

// 3. Summarize conversation
export async function summarizeConversation(
  conversationText: string,
  customerName?: string,
  issueCategory?: string
): Promise<ConversationSummaryResponse> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationText, customerName, issueCategory }),
  });

  if (!res.ok) {
    throw new Error('Failed to summarize conversation');
  }

  return res.json();
}

// 4. Intent & Urgency classification
export async function classifyIntent(message: string): Promise<IntentClassificationResponse> {
  const res = await fetch('/api/classify-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error('Failed to classify inquiry');
  }

  return res.json();
}

// 5. Generate Professional Email
export async function generateCustomerEmail(params: {
  type: string;
  customerName: string;
  customerEmail?: string;
  context: string;
  keyPoints: string[];
  tone: string;
  knowledgeBase?: KnowledgeBaseData;
}): Promise<EmailResponseData> {
  const res = await fetch('/api/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('Failed to generate email');
  }

  return res.json();
}

// 6. Lead Qualification
export async function qualifyLeadData(leadData: {
  name: string;
  company: string;
  budget: string;
  timeline: string;
  requirements: string;
  teamSize?: string;
}): Promise<LeadQualificationResponse> {
  const res = await fetch('/api/qualify-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadData }),
  });

  if (!res.ok) {
    throw new Error('Failed to qualify lead');
  }

  return res.json();
}

// 7. Check Health
export async function checkServerHealth(): Promise<{ status: string; geminiConfigured: boolean; model: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'down', geminiConfigured: false, model: 'unknown' };
    return res.json();
  } catch {
    return { status: 'offline', geminiConfigured: false, model: 'unknown' };
  }
}
