"use client";

import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Ban, Mail, Phone, MapPin, Activity, Target, Building2, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { employees, leads, properties } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'leads'|'properties'|'activity'>('leads');

  const employee = employees.find(e => e.id === params.id);

  if (!employee) {
    return (
      <div className="p-12 text-center text-slate-500 animate-in fade-in">
        <p className="text-lg font-bold text-slate-900">Employee not found</p>
        <button onClick={() => router.push('/admin/team-management')} className="mt-4 text-indigo-600 font-semibold hover:underline">
          Return to Team Management
        </button>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    'Admin': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sales Manager': 'bg-blue-50 text-blue-700 border-blue-200',
    'Sales Executive': 'bg-sky-50 text-sky-700 border-sky-200',
    'Supply Executive': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  // Mocks based on actual role
  const isSales = employee.role.includes('Sales');
  const assignedLeads = leads.filter(l => l.assignedExecutive === employee.name);
  const activeLeads = assignedLeads.filter(l => l.status !== 'Closed' && l.status !== 'Converted');
  const closedDeals = assignedLeads.filter(l => l.status === 'Closed' || l.status === 'Converted');
  const conversionRate = assignedLeads.length ? Math.round((closedDeals.length / assignedLeads.length) * 100) : 0;

  const addedProperties = properties.filter(p => p.createdBy === employee.name || p.createdBy === 'usr_1'); // 'usr_1' is mock id
  const approvedProperties = addedProperties.filter(p => p.lifecycleStatus === 'Approved');
  const pendingProperties = addedProperties.filter(p => p.lifecycleStatus === 'Under Review');

  const mockActivity = [
    { text: "Logged in to platform", time: "Today, 9:00 AM", icon: Clock },
    { text: isSales ? "Updated lead status for TechFlow" : "Submitted new property for review", time: "Yesterday, 2:30 PM", icon: isSales ? Target : Building2 },
    { text: "Completed assigned task", time: "Monday, 4:15 PM", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => router.push('/admin/team-management')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              {employee.name}
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border ${roleColors[employee.role]}`}>
                {employee.role}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{employee.region} • <span className={`font-semibold ${employee.status === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>{employee.status}</span></p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors shadow-sm">
              <Ban className="h-4 w-4" /> Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-1 space-y-6">
          {/* PROFILE OVERVIEW */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Profile Overview</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Employee ID</p>
                <p className="font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg inline-block">{employee.employeeId}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">Joined {new Date(employee.joinedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">Assigned: {employee.region}</span>
              </div>
            </CardContent>
          </Card>

          {/* PERFORMANCE SNAPSHOT */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-600" /> Performance Snapshot</h3>
              {employee.performanceScore && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{employee.performanceScore}/100 Score</span>}
            </div>
            <CardContent className="p-6">
              {isSales ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Assigned Leads</p>
                    <p className="text-2xl font-black text-slate-900">{assignedLeads.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Active Leads</p>
                    <p className="text-2xl font-black text-blue-600">{activeLeads.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Closed Deals</p>
                    <p className="text-2xl font-black text-emerald-600">{closedDeals.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Conversion</p>
                    <p className="text-2xl font-black text-indigo-600">{conversionRate}%</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Properties Added</p>
                    <p className="text-2xl font-black text-slate-900">{addedProperties.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Approved</p>
                    <p className="text-2xl font-black text-emerald-600">{approvedProperties.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pending Reviews</p>
                    <p className="text-2xl font-black text-amber-600">{pendingProperties.length}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          
          {/* ASSIGNED WORK & ACTIVITY */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <div className="flex border-b border-slate-200">
              <button onClick={() => setActiveTab('leads')} className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'leads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>Assigned Leads</button>
              <button onClick={() => setActiveTab('properties')} className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'properties' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>Assigned Properties</button>
              <button onClick={() => setActiveTab('activity')} className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'activity' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>Activity Timeline</button>
            </div>
            <CardContent className="p-0 min-h-[400px]">
              
              {activeTab === 'leads' && (
                <div className="divide-y divide-slate-100">
                  {assignedLeads.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No leads assigned.</div>
                  ) : (
                    assignedLeads.map(lead => (
                      <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">{lead.type === 'Company' ? lead.companyName : lead.clientName}</p>
                          <p className="text-xs text-slate-500">{lead.lookingFor} • {lead.city}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 rounded text-slate-600">{lead.status}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="divide-y divide-slate-100">
                  {addedProperties.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No properties added.</div>
                  ) : (
                    addedProperties.map(prop => (
                      <div key={prop.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">{prop.name}</p>
                          <p className="text-xs text-slate-500">{prop.micromarket}, {prop.city}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${prop.lifecycleStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{prop.lifecycleStatus}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="p-6 relative">
                  <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-100" />
                  <div className="space-y-6 relative">
                    {mockActivity.map((act, i) => {
                      const Icon = act.icon;
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ring-4 ring-white z-10">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="pt-1.5">
                            <p className="text-sm font-semibold text-slate-900">{act.text}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{act.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
