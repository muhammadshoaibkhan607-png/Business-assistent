import React, { useState } from 'react';
import {
  Database,
  Building2,
  Package,
  HelpCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  KnowledgeBaseData,
  ProductItem,
  FAQItem,
  PolicyItem,
} from '../../types';
import { useToast } from '../common/Toast';
import { BUSINESS_PRESETS } from '../../data/defaultKnowledge';

interface KnowledgeBaseViewProps {
  knowledgeBase: KnowledgeBaseData;
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseData>>;
  currentPreset: string;
  onSelectPreset: (key: string) => void;
}

type KBTab = 'profile' | 'products' | 'faqs' | 'policies';

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  knowledgeBase,
  setKnowledgeBase,
  currentPreset,
  onSelectPreset,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<KBTab>('profile');

  // Business Profile Form State
  const [profileForm, setProfileForm] = useState(knowledgeBase.businessProfile);

  // New Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Infrastructure');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductFeatures, setNewProductFeatures] = useState('');

  // New FAQ Modal State
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState<'General' | 'Pricing' | 'Technical' | 'Billing' | 'Support'>('General');
  const [newFaqTags, setNewFaqTags] = useState('');

  // New Policy Modal State
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicyTitle, setNewPolicyTitle] = useState('');
  const [newPolicyCategory, setNewPolicyCategory] = useState('Service Agreement');
  const [newPolicyContent, setNewPolicyContent] = useState('');

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setKnowledgeBase((prev) => ({
      ...prev,
      businessProfile: profileForm,
    }));
    showToast('Profile Saved', 'AI Assistant ground truth updated immediately', 'success');
  };

  // Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      price: newProductPrice.trim() || '$1,000 / mo',
      billingCycle: 'Monthly',
      description: newProductDesc.trim(),
      features: newProductFeatures
        .split(';')
        .map((f) => f.trim())
        .filter(Boolean),
      inStock: true,
    };

    setKnowledgeBase((prev) => ({
      ...prev,
      products: [newProd, ...prev.products],
    }));

    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
    setNewProductFeatures('');
    setShowAddProduct(false);
    showToast('Product Added', 'Synchronized with AI Knowledge Base', 'success');
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    setKnowledgeBase((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
    showToast('Product Removed', 'Removed from AI ground truth', 'info');
  };

  // Add FAQ
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const newFaqItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: newFaqCategory,
      tags: newFaqTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setKnowledgeBase((prev) => ({
      ...prev,
      faqs: [newFaqItem, ...prev.faqs],
    }));

    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setNewFaqTags('');
    setShowAddFaq(false);
    showToast('FAQ Added', 'AI can now answer this verified question', 'success');
  };

  // Delete FAQ
  const handleDeleteFaq = (id: string) => {
    setKnowledgeBase((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
    showToast('FAQ Deleted', 'Removed from knowledge base', 'info');
  };

  // Add Policy
  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyTitle.trim() || !newPolicyContent.trim()) return;

    const newPol: PolicyItem = {
      id: `pol-${Date.now()}`,
      title: newPolicyTitle.trim(),
      category: newPolicyCategory,
      content: newPolicyContent.trim(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setKnowledgeBase((prev) => ({
      ...prev,
      policies: [newPol, ...prev.policies],
    }));

    setNewPolicyTitle('');
    setNewPolicyContent('');
    setShowAddPolicy(false);
    showToast('Policy Added', 'Policy synchronized with AI responses', 'success');
  };

  // Delete Policy
  const handleDeletePolicy = (id: string) => {
    setKnowledgeBase((prev) => ({
      ...prev,
      policies: prev.policies.filter((p) => p.id !== id),
    }));
    showToast('Policy Removed', 'Removed from knowledge base', 'info');
  };

  // Reset to Presets
  const handleResetToPreset = () => {
    const defaultData = BUSINESS_PRESETS[currentPreset] || BUSINESS_PRESETS.apex;
    setKnowledgeBase(defaultData);
    setProfileForm(defaultData.businessProfile);
    showToast('Reset to Preset', `Restored default ${defaultData.businessProfile.name} data`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner with Presets & Live Grounding Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Business Knowledge Base</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live AI Grounding Source
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            The information below is sent as verified context to the Gemini AI on every chat and automation request. The AI strictly answers based on this knowledge base to prevent hallucinations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleResetToPreset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            title="Reset knowledge base to preset defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto scrollbar-none snap-x">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 min-h-[42px] ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Profile & Hours</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 min-h-[42px] ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Products ({knowledgeBase.products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 min-h-[42px] ${
            activeTab === 'faqs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">FAQs ({knowledgeBase.faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 min-h-[42px] ${
            activeTab === 'policies'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Policies ({knowledgeBase.policies.length})</span>
        </button>
      </div>

      {/* TAB 1: Business Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Company Identity & Contact Guidelines
              </h3>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 min-h-[44px]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Name:
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry:</label>
                <input
                  type="text"
                  value={profileForm.industry}
                  onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating Hours:
                </label>
                <input
                  type="text"
                  value={profileForm.operatingHours}
                  onChange={(e) => setProfileForm({ ...profileForm, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guaranteed SLA Response Time:
                </label>
                <input
                  type="text"
                  value={profileForm.slaResponseTime}
                  onChange={(e) => setProfileForm({ ...profileForm, slaResponseTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Support Contact Email:
                </label>
                <input
                  type="email"
                  value={profileForm.contactEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number:
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Office / Headquarters Address:
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Mission & Core Service Description:
                </label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Products & Pricing */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Active product catalog. The assistant quotes exact pricing and features from these records.
            </p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service / Product</span>
            </button>
          </div>

          {/* Add Product Modal Form */}
          {showAddProduct && (
            <form
              onSubmit={handleAddProduct}
              className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3"
            >
              <h4 className="text-xs font-bold text-white">Create New Product / Service</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Name:</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Serverless Database Migration"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Category:</label>
                  <input
                    type="text"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    placeholder="e.g. Infrastructure, Security"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Price / Plan:</label>
                  <input
                    type="text"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="e.g. $1,800 / month"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Description:</label>
                <input
                  type="text"
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Summary of what is delivered..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Features (semicolon separated):
                </label>
                <input
                  type="text"
                  value={newProductFeatures}
                  onChange={(e) => setNewProductFeatures(e.target.value)}
                  placeholder="Feature 1; Feature 2; Feature 3"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          )}

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeBase.products.map((prod) => (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {prod.category}
                      </span>
                      <h4 className="text-sm font-bold text-white">{prod.name}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-emerald-400 mb-2">{prod.price}</p>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{prod.description}</p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Features:</span>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                      {prod.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Verified FAQ records used for direct retrieval and semantic customer response generation.
            </p>
            <button
              onClick={() => setShowAddFaq(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          {/* Add FAQ Form */}
          {showAddFaq && (
            <form
              onSubmit={handleAddFaq}
              className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3"
            >
              <h4 className="text-xs font-bold text-white">Add Verified Question & Answer</h4>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Customer Question:</label>
                <input
                  type="text"
                  required
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="e.g. Can we cancel our contract with 30 days notice?"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Verified Answer (Ground Truth):
                </label>
                <textarea
                  rows={3}
                  required
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="State the exact factual answer..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Category:</label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="General">General</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Tags (comma separated):</label>
                  <input
                    type="text"
                    value={newFaqTags}
                    onChange={(e) => setNewFaqTags(e.target.value)}
                    placeholder="SLA, contract, terms"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          )}

          {/* FAQs List */}
          <div className="space-y-3">
            {knowledgeBase.faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                        {faq.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{faq.question}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-1">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Policies & SLAs */}
      {activeTab === 'policies' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Official legal policies, money-back guarantees, and uptime SLAs.
            </p>
            <button
              onClick={() => setShowAddPolicy(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Policy</span>
            </button>
          </div>

          {/* Add Policy Form */}
          {showAddPolicy && (
            <form
              onSubmit={handleAddPolicy}
              className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3"
            >
              <h4 className="text-xs font-bold text-white">Create Verified Policy Document</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Title:</label>
                  <input
                    type="text"
                    required
                    value={newPolicyTitle}
                    onChange={(e) => setNewPolicyTitle(e.target.value)}
                    placeholder="e.g. 100% Data Privacy Commitment"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Category:</label>
                  <input
                    type="text"
                    value={newPolicyCategory}
                    onChange={(e) => setNewPolicyCategory(e.target.value)}
                    placeholder="Security, Legal, SLA"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Policy Content:</label>
                <textarea
                  rows={3}
                  required
                  value={newPolicyContent}
                  onChange={(e) => setNewPolicyContent(e.target.value)}
                  placeholder="Terms, conditions, and SLA numbers..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPolicy(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save Policy
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {knowledgeBase.policies.map((policy) => (
              <div
                key={policy.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {policy.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{policy.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
                    title="Delete Policy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{policy.content}</p>
                <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                  Last verified: {policy.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
