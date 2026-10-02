import React, { useState } from 'react';
import {
  Settings,
  Bot,
  Shield,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Server,
  Activity,
  Layers,
  Save,
  Check,
} from 'lucide-react';
import { AssistantSettings, KnowledgeBaseData } from '../../types';
import { checkServerHealth } from '../../services/api';
import { useToast } from '../common/Toast';

interface SettingsViewProps {
  settings: AssistantSettings;
  setSettings: React.Dispatch<React.SetStateAction<AssistantSettings>>;
  knowledgeBase: KnowledgeBaseData;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  knowledgeBase,
  onResetAllData,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<AssistantSettings>(settings);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    geminiConfigured: boolean;
    model: string;
  } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    showToast('Settings Saved', 'AI Assistant configuration updated', 'success');
  };

  const handleTestHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await checkServerHealth();
      setHealthStatus(res);
      showToast('Healthcheck Complete', `Server status: ${res.status}`, 'info');
    } catch (err: any) {
      showToast('Healthcheck Failed', err.message, 'error');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          AI Assistant & Workspace Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize persona tone, grounding guardrails, response verbosity, and system integrations
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Persona & Tone Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Bot className="w-4 h-4 text-indigo-400" />
            Persona Tone & Brand Alignment
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              System Persona Prompt:
            </label>
            <textarea
              rows={3}
              value={formData.persona}
              onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Defines the assistant's persona behavior across live chat and email generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Tone Style:
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Professional & Polished">Professional & Polished</option>
                <option value="Warm & Friendly">Warm & Friendly</option>
                <option value="Crisp & Technical">Crisp & Technical</option>
                <option value="Direct & Executive">Direct & Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Response Verbosity:
              </label>
              <select
                value={formData.maxResponseLength}
                onChange={(e) =>
                  setFormData({ ...formData, maxResponseLength: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="concise">Concise (&lt; 150 words)</option>
                <option value="balanced">Balanced (150 - 250 words)</option>
                <option value="detailed">Detailed & Step-by-Step</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guardrails & Automation Behaviors */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400" />
            Safety Guardrails & Triage Rules
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.strictGrounding}
                onChange={(e) => setFormData({ ...formData, strictGrounding: e.target.checked })}
                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Strict Knowledge Base Grounding
                </span>
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  Prevents the model from hallucinating or inventing unlisted products, unstated prices, or unofficial guarantees. If unlisted, the assistant politely declines and routes to email support.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.autoSummarizeOnResolve}
                onChange={(e) =>
                  setFormData({ ...formData, autoSummarizeOnResolve: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Auto-Summarize Tickets on Resolution
                </span>
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  Automatically extracts bulleted action items and resolution notes whenever a support agent marks an inquiry as Resolved.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Server & Model Health Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Backend Server & AI Engine Health
            </h3>
            <button
              type="button"
              onClick={handleTestHealth}
              disabled={isCheckingHealth}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition-all"
            >
              {isCheckingHealth ? 'Pinging API...' : 'Run Diagnostics'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="font-mono text-slate-200">/api/health</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Model:</span>
              <span className="font-mono text-indigo-300">gemini-3.8-flash</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Server Status:</span>
              <span className="font-semibold text-emerald-400">
                {healthStatus?.status ? `Active (${healthStatus.status})` : 'Online • Ready to ping'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onResetAllData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Demo Data & Presets</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
