"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Building2, Target, Calendar, User, Search, Filter } from "lucide-react";

export default function ApprovalCenterPage() {
  const router = useRouter();
  const { properties, leads, simulateAdminApproval, updateLeadStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Inventory' | 'Leads'>('All');

  const pendingProperties = properties.filter(p => p.lifecycleStatus === 'Under Review').map(p => ({
    id: p.id,
    type: 'Property' as const,
    title: p.name,
    subtitle: `${p.micromarket}, ${p.city}`,
    submittedBy: p.createdBy === 'usr_1' ? 'Sanjay Verma' : 'Rahul Mehta',
    date: p.createdAt,
    priority: 'Medium'
  }));

  const pendingLeads = leads.filter(l => l.status === 'New Requirement').map(l => ({
    id: l.id,
    type: 'Lead' as const,
    title: l.type === 'Company' ? l.companyName : l.clientName,
    subtitle: l.lookingFor,
    submittedBy: l.source === 'Website' ? 'System (Auto-captured)' : 'Sales Manager',
    date: l.createdAt,
    priority: l.priority || 'Medium'
  }));

  const allRequests = [...pendingProperties, ...pendingLeads].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredRequests = allRequests.filter(req => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Inventory') return req.type === 'Property';
    if (activeTab === 'Leads') return req.type === 'Lead';
    return true;
  });

  const handleQuickApprove = (id: string, type: 'Property' | 'Lead') => {
    if (type === 'Property') {
      simulateAdminApproval(id);
    } else {
      updateLeadStatus(id, 'Property Suggested'); // Approving a lead moves it forward
    }
  };

  const handleQuickReject = (id: string, type: 'Property' | 'Lead') => {
    if (type === 'Property') {
      // In a real app we'd prompt for reason, but here we just route to the detail page to handle rejection
      router.push(`/admin/inventory/${id}`);
    } else {
      updateLeadStatus(id, 'Closed'); // Reject lead
    }
  };

  const priorityColors: Record<string, string> = {
    'High': 'text-red-700 bg-red-50 border-red-200',
    'Medium': 'text-amber-700 bg-amber-50 border-amber-200',
    'Low': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Approval Center</h1>
          <p className="text-slate-500 mt-2">Central queue for pending platform actions and verifications.</p>
        </div>
      </div>



      {/* TABS */}
      <div className="flex space-x-1 border-b border-slate-200 pt-4">
        {['All', 'Inventory', 'Leads'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
            {tab === 'All' && allRequests.length > 0 && <span className="ml-2 bg-slate-100 text-slate-700 py-0.5 px-2 rounded-full text-[10px]">{allRequests.length}</span>}
            {tab === 'Inventory' && pendingProperties.length > 0 && <span className="ml-2 bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px]">{pendingProperties.length}</span>}
            {tab === 'Leads' && pendingLeads.length > 0 && <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px]">{pendingLeads.length}</span>}
          </button>
        ))}
      </div>

      {/* LIST */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search queue..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-900">All caught up!</p>
              <p className="text-sm mt-1">There are no pending requests in this queue.</p>
            </div>
          ) : (
            filteredRequests.map(req => (
              <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${req.type === 'Property' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {req.type === 'Property' ? <Building2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{req.type}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-md ${priorityColors[req.priority] || priorityColors['Medium']}`}>{req.priority}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{req.title}</h3>
                    <p className="text-sm text-slate-600">{req.subtitle}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {req.submittedBy}</div>
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(req.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 self-start md:self-center">
                  <button 
                    onClick={() => handleQuickReject(req.id, req.type)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                    title="Reject"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleQuickApprove(req.id, req.type)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm"
                    title="Quick Approve"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => router.push(req.type === 'Property' ? `/admin/inventory/${req.id}` : `/admin/leads/${req.id}`)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    Review Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
}
