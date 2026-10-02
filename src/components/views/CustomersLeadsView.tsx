import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Sparkles,
  TrendingUp,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { Lead } from '../../types';
import { qualifyLeadData, LeadQualificationResponse } from '../../services/api';
import { useToast } from '../common/Toast';

interface CustomersLeadsViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export const CustomersLeadsView: React.FC<CustomersLeadsViewProps> = ({
  leads,
  setLeads,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const detailRef = React.useRef<HTMLDivElement>(null);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // New Lead Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('$5,000 - $10,000 / mo');
  const [timeline, setTimeline] = useState('Immediate (within 2 weeks)');
  const [teamSize, setTeamSize] = useState('20-50 people');
  const [requirements, setRequirements] = useState('');
  const [isQualifying, setIsQualifying] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchesGrade = filterGrade === 'All' || l.grade === filterGrade;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleQualifyAndAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || isQualifying) return;

    setIsQualifying(true);

    try {
      const evaluation: LeadQualificationResponse = await qualifyLeadData({
        name,
        company,
        budget,
        timeline,
        requirements,
        teamSize,
      });

      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: name.trim(),
        company: company.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: phone.trim() || '+1 (555) 012-3344',
        budget,
        timeline,
        teamSize,
        requirements: requirements.trim(),
        score: evaluation.score,
        grade: evaluation.grade,
        status: evaluation.status,
        breakdown: evaluation.breakdown,
        recommendedNextStep: evaluation.recommendedNextStep,
        createdDate: 'Just now',
      };

      setLeads((prev) => [newLead, ...prev]);
      setSelectedLead(newLead);
      setIsModalOpen(false);

      // Reset
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setRequirements('');

      showToast('Lead Qualified & Added', `Score: ${evaluation.score}/100 • Grade: ${evaluation.grade}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsQualifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/50 to-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Lead Qualification CRM</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Automated BANT Scoring
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Inbound inquiries scored against enterprise revenue criteria (Budget, Authority, Need, Timeline). Identifies high-value prospects for discovery calls.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Qualify New Prospect</span>
        </button>
      </div>

      {/* Main Grid: Pipeline Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leads List & Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by contact, company, or domain..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5">
                {(['All', 'Hot', 'Warm', 'Cold'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setFilterGrade(grade)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      filterGrade === grade
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table / Cards */}
            <div className="space-y-2.5 pt-2">
              {filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No prospects found matching your search.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/40'
                          : 'bg-slate-950/60 hover:bg-slate-850/60 border-slate-800'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
                          <span className="text-[10px] text-slate-400 truncate">
                            • {lead.company}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-sm">
                          {lead.requirements}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                          <span>{lead.budget}</span>
                          <span>•</span>
                          <span>{lead.timeline}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-3">
                        <div>
                          <span
                            className={`text-xs font-extrabold px-2.5 py-1 rounded-full inline-block ${
                              lead.grade === 'Hot'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : lead.grade === 'Warm'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {lead.score} / 100
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1">
                            {lead.status}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Detail & BANT Report */}
        <div ref={detailRef} className="lg:col-span-5 scroll-mt-20">
          {selectedLead ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md space-y-4 sticky top-20">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.company}</p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedLead.grade === 'Hot'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedLead.grade === 'Warm'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {selectedLead.grade} Prospect ({selectedLead.score}/100)
                </span>
              </div>

              {/* Contact info pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 truncate">{selectedLead.email}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 truncate">{selectedLead.phone}</span>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Stated Requirements:
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedLead.requirements}</p>
              </div>

              {/* BANT Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-white block">
                  AI Qualification Breakdown (BANT)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Budget Fit:</span>
                    <span className="font-semibold text-white">
                      {selectedLead.breakdown.budgetFit}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Timeline Urgency:</span>
                    <span className="font-semibold text-white">
                      {selectedLead.breakdown.timelineFit}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Need Criticality:</span>
                    <span className="font-semibold text-white">
                      {selectedLead.breakdown.needUrgency}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Authority Tier:</span>
                    <span className="font-semibold text-white">
                      {selectedLead.breakdown.authority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Next Step */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Recommended Action:
                </span>
                <p className="text-white font-semibold">{selectedLead.recommendedNextStep}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a prospect from the left to view the qualification report.
            </div>
          )}
        </div>
      </div>

      {/* Qualify New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl animate-scaleUp max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Qualify Inbound Prospect</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQualifyAndAddLead} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Contact Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Hayes"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Company:
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex FinTech"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Work Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Phone:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Budget Tier:
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  >
                    <option value="$10,000+ / mo">$10,000+ / month (Enterprise)</option>
                    <option value="$5,000 - $10,000 / mo">$5,000 - $10,000 / month</option>
                    <option value="$2,000 - $5,000 / mo">$2,000 - $5,000 / month</option>
                    <option value="Under $1,000 / mo">Under $1,000 / month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Timeline:
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 min-h-[42px]"
                  >
                    <option value="Immediate (within 2 weeks)">Immediate (&lt; 2 weeks)</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="Q3/Q4 this year">Q3/Q4 this year</option>
                    <option value="Indefinite / Just looking">Indefinite / Just looking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Technical Requirements / Needs:
                </label>
                <textarea
                  rows={3}
                  required
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe their infrastructure or support automation problem..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-xs text-slate-100 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isQualifying}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 min-h-[44px]"
                >
                  {isQualifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating BANT Rules...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Score & Add Lead</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
