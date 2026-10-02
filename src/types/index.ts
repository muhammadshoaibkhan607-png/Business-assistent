export interface BusinessProfile {
  name: string;
  tagline: string;
  industry: string;
  operatingHours: string;
  timezone: string;
  contactEmail: string;
  phone: string;
  address: string;
  slaResponseTime: string;
  website: string;
  description: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  billingCycle: 'Monthly' | 'Annual' | 'One-Time';
  description: string;
  features: string[];
  inStock: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Pricing' | 'Technical' | 'Billing' | 'Support';
  tags: string[];
}

export interface PolicyItem {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}

export interface KnowledgeBaseData {
  businessProfile: BusinessProfile;
  products: ProductItem[];
  faqs: FAQItem[];
  policies: PolicyItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
  intent?: string;
  confidence?: number;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'inquisitive';
}

export interface ConversationThread {
  id: string;
  customerName: string;
  customerEmail: string;
  avatar: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | 'Critical';
  intent: string;
  lastUpdated: string;
  channel: 'Web Chat' | 'Email' | 'WhatsApp' | 'Portal';
  messages: ChatMessage[];
  aiSummary?: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'urgent' | 'inquisitive';
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  budget: string;
  timeline: string;
  teamSize?: string;
  requirements: string;
  score: number;
  grade: 'Hot' | 'Warm' | 'Cold';
  status: 'Qualified' | 'Prospect' | 'Unqualified';
  breakdown: {
    budgetFit: string;
    timelineFit: string;
    needUrgency: string;
    authority: string;
  };
  recommendedNextStep: string;
  createdDate: string;
}

export interface AssistantSettings {
  persona: string;
  tone: 'Professional & Polished' | 'Warm & Friendly' | 'Crisp & Technical' | 'Direct & Executive';
  strictGrounding: boolean;
  maxResponseLength: 'concise' | 'balanced' | 'detailed';
  autoSummarizeOnResolve: boolean;
  leadQualificationRules: {
    minimumBudget: number;
    acceptableTimelines: string[];
  };
}

export type ActiveTab =
  | 'overview'
  | 'assistant'
  | 'conversations'
  | 'automations'
  | 'knowledge'
  | 'leads'
  | 'analytics'
  | 'settings';
