/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ConversationsView } from './components/views/ConversationsView';
import { AutomationsView } from './components/views/AutomationsView';
import { KnowledgeBaseView } from './components/views/KnowledgeBaseView';
import { CustomersLeadsView } from './components/views/CustomersLeadsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { PortfolioShowcaseModal } from './components/portfolio/PortfolioShowcaseModal';

import {
  ActiveTab,
  KnowledgeBaseData,
  ConversationThread,
  Lead,
  AssistantSettings,
} from './types';
import {
  BUSINESS_PRESETS,
  INITIAL_CONVERSATIONS,
  INITIAL_LEADS,
  DEFAULT_SETTINGS,
} from './data/defaultKnowledge';

function MainAppContent() {
  const { showToast } = useToast();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Business Preset selection ('apex' | 'lumina')
  const [currentPreset, setCurrentPreset] = useState<string>(() => {
    return localStorage.getItem('omnipulse_preset') || 'apex';
  });

  // Knowledge Base State
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseData>(() => {
    const saved = localStorage.getItem('omnipulse_kb');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached knowledge base:', e);
      }
    }
    return BUSINESS_PRESETS[currentPreset] || BUSINESS_PRESETS.apex;
  });

  // Conversations State
  const [conversations, setConversations] = useState<ConversationThread[]>(() => {
    const saved = localStorage.getItem('omnipulse_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached conversations:', e);
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('omnipulse_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached leads:', e);
      }
    }
    return INITIAL_LEADS;
  });

  // Settings State
  const [settings, setSettings] = useState<AssistantSettings>(() => {
    const saved = localStorage.getItem('omnipulse_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // UI Modals & Mobile drawer
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('omnipulse_preset', currentPreset);
  }, [currentPreset]);

  useEffect(() => {
    localStorage.setItem('omnipulse_kb', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('omnipulse_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('omnipulse_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('omnipulse_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Preset Switching
  const handleSelectPreset = (key: string) => {
    setCurrentPreset(key);
    const newKB = BUSINESS_PRESETS[key] || BUSINESS_PRESETS.apex;
    setKnowledgeBase(newKB);
    showToast('Business Context Switched', `Loaded ${newKB.businessProfile.name}`, 'info');
  };

  // Reset All to default sample data
  const handleResetAllData = () => {
    localStorage.removeItem('omnipulse_kb');
    localStorage.removeItem('omnipulse_conversations');
    localStorage.removeItem('omnipulse_leads');
    localStorage.removeItem('omnipulse_settings');
    localStorage.removeItem('omnipulse_preset');

    const defaultKB = BUSINESS_PRESETS.apex;
    setCurrentPreset('apex');
    setKnowledgeBase(defaultKB);
    setConversations(INITIAL_CONVERSATIONS);
    setLeads(INITIAL_LEADS);
    setSettings(DEFAULT_SETTINGS);
    setSelectedConversationId(null);

    showToast('All Data Restored', 'Reset to initial freelance portfolio preset', 'info');
  };

  const openTicketsCount = conversations.filter((c) => c.status !== 'Resolved').length;
  const hotLeadsCount = leads.filter((l) => l.grade === 'Hot').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        knowledgeBase={knowledgeBase}
        onOpenPortfolio={() => setPortfolioModalOpen(true)}
        onOpenLiveChat={() => setActiveTab('assistant')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openConversationsCount={openTicketsCount}
          hotLeadsCount={hotLeadsCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
        />

        {/* Dynamic View Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              knowledgeBase={knowledgeBase}
              conversations={conversations}
              leads={leads}
              settings={settings}
              setActiveTab={setActiveTab}
              onOpenLiveChat={() => setActiveTab('assistant')}
              onSelectConversation={(id) => setSelectedConversationId(id)}
            />
          )}

          {activeTab === 'assistant' && (
            <AIAssistantView
              knowledgeBase={knowledgeBase}
              settings={settings}
            />
          )}

          {activeTab === 'conversations' && (
            <ConversationsView
              conversations={conversations}
              setConversations={setConversations}
              selectedConversationId={selectedConversationId}
              setSelectedConversationId={setSelectedConversationId}
              knowledgeBase={knowledgeBase}
              settings={settings}
            />
          )}

          {activeTab === 'automations' && (
            <AutomationsView
              knowledgeBase={knowledgeBase}
              settings={settings}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBaseView
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
              currentPreset={currentPreset}
              onSelectPreset={handleSelectPreset}
            />
          )}

          {activeTab === 'leads' && (
            <CustomersLeadsView
              leads={leads}
              setLeads={setLeads}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView knowledgeBase={knowledgeBase} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              knowledgeBase={knowledgeBase}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>

      {/* Freelance Portfolio Presentation Modal */}
      <PortfolioShowcaseModal
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
