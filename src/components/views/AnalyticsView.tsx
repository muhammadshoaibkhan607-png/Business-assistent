import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { KnowledgeBaseData } from '../../types';

interface AnalyticsViewProps {
  knowledgeBase: KnowledgeBaseData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ knowledgeBase }) => {
  // Clear identification: Sample Benchmark Dataset for freelance client evaluation
  const intentData = [
    { label: 'Technical & Bug Support', count: 184, percent: 38, color: 'bg-indigo-500' },
    { label: 'Pricing & Plan Inquiries', count: 122, percent: 25, color: 'bg-cyan-500' },
    { label: 'Policies & SLA Confirmation', count: 96, percent: 20, color: 'bg-emerald-500' },
    { label: 'Complaints / Cancellations', count: 48, percent: 10, color: 'bg-amber-500' },
    { label: 'General & Office Inquiries', count: 34, percent: 7, color: 'bg-purple-500' },
  ];

  const channelBreakdown = [
    { channel: 'Embedded Web Chat', share: '58%', icon: '💬' },
    { channel: 'Support Email Sync', share: '24%', icon: '✉️' },
    { channel: 'Client Portal Helpdesk', share: '12%', icon: '🌐' },
    { channel: 'WhatsApp / Mobile SMS', share: '6%', icon: '📱' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Portfolio Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Portfolio Demo Benchmark Notice:</strong> The analytics below represent sample operational efficiency benchmarks from a 30-day simulated deployment for {knowledgeBase.businessProfile.name}. They demonstrate how AI-grounded support models reduce resolution delays and automate Tier-1 escalations.
        </div>
      </div>

      {/* 4 Core Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400">Total Inquiries Processed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">484</span>
            <span className="text-xs font-semibold text-emerald-400">30-day sample</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Multi-channel inbound tickets across chat, email, and portal
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400">Automated Resolution Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">88.4%</span>
            <span className="text-xs text-slate-400">428 / 484</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Resolved directly by AI Assistant without human escalation
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400">Average First Response Time</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400">0.8s</span>
            <span className="text-xs font-semibold text-emerald-400">99.8% faster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Compared to 3.2 hour baseline for human Tier-1 agents
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400">Estimated Support Hours Saved</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-400">142 hrs</span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Equivalent to ~0.9 full-time Tier-1 support engineer capacity
          </p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intent Breakdown Horizontal Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Customer Inquiries by Primary Intent
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically classified using zero-shot semantic intent clustering
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">484 Total</span>
          </div>

          <div className="space-y-4 pt-2">
            {intentData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{item.label}</span>
                  <span className="text-slate-400 font-mono">
                    {item.count} tickets ({item.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2 text-indigo-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Highest automation success: Policies & SLAs (98.2%)
            </span>
            <span className="text-slate-400 text-[11px]">Human escalation: 11.6%</span>
          </div>
        </div>

        {/* Right: Operational Efficiency & Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resolution Speed Comparison */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              First Response Time Comparison
            </h3>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">OmniPulse AI Assistant</span>
                  <span className="text-[11px] text-slate-400">Instant grounded response</span>
                </div>
                <span className="text-lg font-black text-emerald-400 font-mono">0.8s</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Manual Tier-1 Human Queue</span>
                  <span className="text-[11px] text-slate-400">Industry standard SLA</span>
                </div>
                <span className="text-lg font-bold text-slate-400 font-mono">3.2 hrs</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Immediate answers to pre-sales and technical questions directly increase prospect conversion rates.
            </p>
          </div>

          {/* Inbound Channels Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              Inbound Traffic by Channel
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {channelBreakdown.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="text-base mr-1">{ch.icon}</span>
                  <span className="text-slate-300 block font-medium mt-1">{ch.channel}</span>
                  <span className="text-lg font-bold text-white font-mono">{ch.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
