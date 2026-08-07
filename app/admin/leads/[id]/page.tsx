"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, ArrowLeft, Building2, User, Phone, Mail, 
  MapPin, CheckCircle2, XCircle, Users, Activity
} from "lucide-react";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { leads, assignLead, updateLeadStatus } = useAppStore();
  
  const lead = leads.find(l => l.id === params.id);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Lead Not Found</h2>
        <button onClick={() => router.push('/admin/leads')} className="text-indigo-600 hover:underline">
          Return to Leads
        </button>
      </div>
    );
  }

  const handleAssignSubmit = () => {
    if (!selectedManager) return;
    assignLead(lead.id, selectedManager);
    setAssignModalOpen(false);
  };

  const handleReject = () => {
    // In a real app we might prompt for a reason, here we just set to Closed/Rejected
    updateLeadStatus(lead.id, 'Closed');
    router.push('/admin/leads');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-40 py-4 border-b border-slate-200/50 -mx-8 px-8">
        <div>
          <button 
            onClick={() => router.push('/admin/leads')}
            className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to Leads
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {lead.type === 'Company' ? lead.companyName : lead.clientName}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
              lead.status === 'New Requirement' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
              lead.status === 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
              'bg-blue-50 text-blue-700 border-blue-200/50'
            }`}>
              {lead.status === 'New Requirement' ? 'Pending Verif.' : lead.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleReject}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <XCircle className="h-4 w-4" /> Reject
          </button>
          <button 
            onClick={() => setAssignModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" /> {lead.assignedExecutive && lead.assignedExecutive !== 'System' ? 'Reassign Lead' : 'Verify & Assign'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* COMPANY INTELLIGENCE */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" /> Company Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {lead.type === 'Company' && (
                  <>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Industry</p>
                      <p className="font-semibold text-slate-900">{lead.industry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Company Size</p>
                      <p className="font-semibold text-slate-900">{lead.employeeCount} Employees</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Requirement Type</p>
                  <p className="font-semibold text-slate-900">{lead.lookingFor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Target Location</p>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="font-semibold text-slate-900 leading-tight">
                      {lead.micromarket}
                      <span className="block text-xs font-normal text-slate-500 mt-0.5">{lead.city}, {lead.region}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Scale</p>
                  <p className="font-semibold text-slate-900">
                    {lead.lookingFor === 'Coworking Space' ? `${lead.coworkingSeats} Seats` : `${lead.requiredArea?.toLocaleString()} sq ft`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Budget</p>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-sm">
                    {lead.budgetRange}
                  </span>
                </div>
              </div>

              {lead.additionalReqs && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Additional Requirements</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{lead.additionalReqs}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SIGNAL EVIDENCE */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" /> Signal Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Captured via {lead.source}</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    System detected a high-intent signal. The company's recent hiring patterns in {lead.city} correlate strongly with an impending real estate expansion.
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="text-xs font-semibold text-slate-700">Confidence: <span className="text-emerald-600 font-black">92%</span></div>
                    <div className="text-xs font-semibold text-slate-700">Priority: <span className="text-amber-600 font-black uppercase">{lead.priority}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDE COLUMN */}
        <div className="space-y-6">
          
          {/* CONTACT INFO */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" /> Key Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-900 text-lg">{lead.type === 'Company' ? lead.contactPerson : lead.clientName}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">{lead.type === 'Company' ? lead.designation : 'Direct Client'}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{lead.phone || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{lead.email || 'Not Provided'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ASSIGNMENT STATUS */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" /> Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              {lead.assignedExecutive && lead.assignedExecutive !== 'System' ? (
                <div>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    {lead.assignedExecutive.substring(0,2).toUpperCase()}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Assigned To</p>
                  <p className="font-bold text-slate-900">{lead.assignedExecutive}</p>
                  <p className="text-xs text-slate-500">Sales Manager</p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Unassigned Lead</p>
                  <p className="text-xs text-slate-500 mb-4">This lead requires verification and assignment.</p>
                  <button 
                    onClick={() => setAssignModalOpen(true)}
                    className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Assign Now
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* ASSIGN MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" /> Assign Sales Manager
              </h3>
              <p className="text-sm text-slate-500 mt-1">Select a Sales Manager to assign this lead to.</p>
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
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignSubmit}
                disabled={!selectedManager}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign & Verify
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
