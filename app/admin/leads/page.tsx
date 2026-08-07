"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Plus, Upload, Users, Search, Filter } from "lucide-react";

export default function LeadManagementPage() {
  const router = useRouter();
  const { leads, assignLead, deleteLead, importLeads } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Pending Verification' | 'Unassigned' | 'Assigned'>('All');
  
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [addLeadModal, setAddLeadModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  
  // Add Lead State
  const [leadWizardStep, setLeadWizardStep] = useState(1);
  const [newLead, setNewLead] = useState<any>({
    type: '',
    // Individual
    name: '', phone: '', email: '', city: '', budget: '', seats: '', preference: '', source: 'Website', region: '', manager: '',
    // Company
    companyName: '', industry: '', size: '', contactName: '', designation: '', expansionType: 'New Office', area: '', broker: 'No', agencyName: ''
  });

  // Simplified logic: New Requirement usually means pending or unassigned depending on whether assignedExecutive is set.
  // We'll treat New Requirement as Pending Verification if assignedExecutive is empty or 'System'.
  const filteredLeads = leads.filter(l => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending Verification') return l.status === 'New Requirement';
    if (activeTab === 'Unassigned') return !l.assignedExecutive || l.assignedExecutive === 'System' || l.assignedExecutive === '';
    if (activeTab === 'Assigned') return l.assignedExecutive && l.assignedExecutive !== 'System' && l.assignedExecutive !== '';
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkAssign = () => {
    if (!selectedManager) return;
    selectedLeads.forEach(id => assignLead(id, selectedManager));
    setSelectedLeads([]);
    setBulkAssignModal(false);
  };

  const handleBulkDelete = () => {
    selectedLeads.forEach(id => deleteLead(id));
    setSelectedLeads([]);
  };

  const handleImport = () => {
    const mockLead = {
      ...leads[0],
      id: `ld_${Date.now()}`,
      companyName: "Imported Corp",
      status: 'New Requirement' as const,
      source: 'Website' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    importLeads([mockLead]);
    setImportModal(false);
  };

  const handleExport = () => {
    alert(`Exporting ${selectedLeads.length} leads to CSV...`);
    setSelectedLeads([]);
  };

  const handleAddLead = () => {
    const isCompany = newLead.type === 'Company';
    const leadName = isCompany ? newLead.companyName : newLead.name;
    if (!leadName) return;

    const lead = {
      id: `ld_${Date.now()}`,
      type: newLead.type,
      companyName: isCompany ? newLead.companyName : '',
      clientName: isCompany ? newLead.contactName : newLead.name,
      industry: newLead.industry,
      contactPerson: isCompany ? newLead.contactName : newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      city: newLead.city,
      lookingFor: isCompany ? newLead.preference || 'Commercial Office' : newLead.preference,
      requiredArea: newLead.seats * 100, // mock calculation
      coworkingSeats: newLead.seats,
      budgetRange: newLead.budget,
      source: isCompany ? 'Manual Entry' : newLead.source,
      status: 'New Requirement',
      assignedExecutive: newLead.manager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    importLeads([lead as any]);
    setAddLeadModal(false);
    setLeadWizardStep(1);
    setNewLead({
      type: '', name: '', phone: '', email: '', city: '', budget: '', seats: '', preference: '', source: 'Website', region: '', manager: '',
      companyName: '', industry: '', size: '', contactName: '', designation: '', expansionType: 'New Office', area: '', broker: 'No', agencyName: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lead Management</h1>
          <p className="text-slate-500 mt-2">Verify and distribute business opportunities.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setImportModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Upload className="h-4 w-4" /> Import Leads
          </button>
          <button 
            onClick={() => setAddLeadModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-1 border-b border-slate-200">
        {['All', 'Pending Verification', 'Unassigned', 'Assigned'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab as any); setSelectedLeads([]); }}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
            {tab === 'Pending Verification' && (
              <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px]">
                {leads.filter(l => l.status === 'New Requirement').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* BULK ACTIONS OR CONTROLS */}
      {selectedLeads.length > 0 ? (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in slide-in-from-top-2">
          <span className="text-sm font-bold text-indigo-800">{selectedLeads.length} Leads Selected</span>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Export
            </button>
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
            <button 
              onClick={() => setBulkAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Users className="h-4 w-4" /> Bulk Assign
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      )}

      {/* TABLE */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedLeads(e.target.checked ? filteredLeads.map(l => l.id) : [])}
                    checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
                <th className="px-4 py-4 font-semibold">Company / Lead</th>
                <th className="px-4 py-4 font-semibold">Requirement</th>
                <th className="px-4 py-4 font-semibold">Source</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Assigned To</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <Target className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-900">No leads found</p>
                    <p className="text-xs">There are no leads matching the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-slate-50/50 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{lead.type === 'Company' ? lead.companyName : lead.clientName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{lead.type === 'Company' ? lead.industry : 'Individual Client'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-slate-700">{lead.lookingFor}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lead.lookingFor === 'Coworking Space' ? `${lead.coworkingSeats} Seats` : `${lead.requiredArea} sq ft`} • {lead.micromarket}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-xs font-medium">
                      {lead.source}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        lead.status === 'New Requirement' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                        lead.status === 'Closed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                        'bg-blue-50 text-blue-700 border border-blue-200/50'
                      }`}>
                        {lead.status === 'New Requirement' ? 'Pending Verif.' : lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {lead.assignedExecutive && lead.assignedExecutive !== 'System' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                            {lead.assignedExecutive.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{lead.assignedExecutive}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/leads/${lead.id}`)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* BULK ASSIGN MODAL */}
      {bulkAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" /> Bulk Assign Leads
              </h3>
              <p className="text-sm text-slate-500 mt-1">Select a Sales Manager to assign the {selectedLeads.length} selected leads to.</p>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sales Manager</label>
              <select 
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white"
              >
                <option value="">Select a manager...</option>
                <option value="Rohit Verma">Rohit Verma - North Region</option>
                <option value="Priya Sharma">Priya Sharma - South Region</option>
                <option value="Arjun Patel">Arjun Patel - West Region</option>
              </select>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setBulkAssignModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkAssign}
                disabled={!selectedManager}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign {selectedLeads.length} Leads
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-600" /> Import Leads
              </h3>
              <p className="text-sm text-slate-500 mt-1">Upload a CSV file to bulk create leads.</p>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50">
                <Upload className="h-8 w-8 text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500">CSV, XLSX (max 5MB)</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setImportModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleImport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Simulate Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {addLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-indigo-600" /> Add New Lead
                </h3>
                <p className="text-sm text-slate-500 mt-1">Manually enter a new business opportunity.</p>
              </div>
              <button onClick={() => setAddLeadModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
              
              {leadWizardStep === 1 && (
                <div className="animate-in slide-in-from-right-4">
                  <h4 className="font-bold text-slate-900 mb-4">Choose Lead Type</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => { setNewLead({...newLead, type: 'Individual'}); setLeadWizardStep(2); }}
                      className="border-2 border-slate-200 rounded-xl p-6 cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-center"
                    >
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6" />
                      </div>
                      <h5 className="font-bold text-slate-900 text-lg">Individual Lead</h5>
                      <p className="text-xs text-slate-500 mt-1">For independent clients / founders</p>
                    </div>
                    <div 
                      onClick={() => { setNewLead({...newLead, type: 'Company'}); setLeadWizardStep(2); }}
                      className="border-2 border-slate-200 rounded-xl p-6 cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-center"
                    >
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="h-6 w-6" />
                      </div>
                      <h5 className="font-bold text-slate-900 text-lg">Company Lead</h5>
                      <p className="text-xs text-slate-500 mt-1">For corporate requirements</p>
                    </div>
                  </div>
                </div>
              )}

              {leadWizardStep === 2 && newLead.type === 'Individual' && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Client Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Full Name</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Phone</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Email</label>
                        <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Requirement</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">City</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.city} onChange={e => setNewLead({...newLead, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Property Preference</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.preference} onChange={e => setNewLead({...newLead, preference: e.target.value})}>
                          <option value="Coworking Space">Coworking Space</option>
                          <option value="Commercial Office">Commercial Office</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Seats Required</label>
                        <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.seats} onChange={e => setNewLead({...newLead, seats: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Budget</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Source & Assignment</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Lead Source</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})}>
                          <option value="Website">Website</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Referral">Referral</option>
                          <option value="Manual Entry">Manual Entry</option>
                          <option value="Event">Event</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Region</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.region} onChange={e => setNewLead({...newLead, region: e.target.value})}>
                          <option value="">Select Region...</option>
                          <option value="North">North Region</option>
                          <option value="South">South Region</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Assign Sales Manager</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.manager} onChange={e => setNewLead({...newLead, manager: e.target.value})}>
                          <option value="">Select Manager...</option>
                          <option value="Rohit Verma">Rohit Verma</option>
                          <option value="Priya Sharma">Priya Sharma</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {leadWizardStep === 2 && newLead.type === 'Company' && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Company Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Company Name</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.companyName} onChange={e => setNewLead({...newLead, companyName: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Industry</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.industry} onChange={e => setNewLead({...newLead, industry: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Company Size</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.size} onChange={e => setNewLead({...newLead, size: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Contact Person</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Name</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.contactName} onChange={e => setNewLead({...newLead, contactName: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Designation</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.designation} onChange={e => setNewLead({...newLead, designation: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Email</label>
                        <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Phone</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b border-slate-100 pb-2">Requirement</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Expansion Type</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.expansionType} onChange={e => setNewLead({...newLead, expansionType: e.target.value})}>
                          <option value="New Office">New Office</option>
                          <option value="Relocation">Relocation</option>
                          <option value="Additional Space">Additional Space</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">City</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.city} onChange={e => setNewLead({...newLead, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Preferred Area</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.area} onChange={e => setNewLead({...newLead, area: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Seats</label>
                        <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.seats} onChange={e => setNewLead({...newLead, seats: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Budget</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} />
                      </div>
                      
                      <div className="col-span-2 pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Existing Broker?</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white mb-3" value={newLead.broker} onChange={e => setNewLead({...newLead, broker: e.target.value})}>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                        {newLead.broker === 'Yes' && (
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Agency Name</label>
                            <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" value={newLead.agencyName} onChange={e => setNewLead({...newLead, agencyName: e.target.value})} />
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Assign Sales Manager</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" value={newLead.manager} onChange={e => setNewLead({...newLead, manager: e.target.value})}>
                          <option value="">Select Manager...</option>
                          <option value="Rohit Verma">Rohit Verma</option>
                          <option value="Priya Sharma">Priya Sharma</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between gap-3">
              <button 
                onClick={() => leadWizardStep > 1 ? setLeadWizardStep(1) : setAddLeadModal(false)} 
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {leadWizardStep > 1 ? 'Back' : 'Cancel'}
              </button>
              {leadWizardStep === 2 && (
                <button onClick={handleAddLead} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Create Lead
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
