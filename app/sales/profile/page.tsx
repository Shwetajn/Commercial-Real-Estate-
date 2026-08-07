"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { User as UserIcon, Mail, Building2, CheckCircle2 } from "lucide-react";

export default function SalesProfilePage() {
  const { currentUser, leads, meetings } = useAppStore();

  const dealsClosed = leads.filter(l => l.status === 'Closed').length;
  const activeLeads = leads.filter(l => l.status !== 'Closed').length;
  const totalMeetings = meetings.filter(m => m.status === 'Completed').length;
  
  const conversionRate = leads.length > 0 ? Math.round((dealsClosed / leads.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto pb-20">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold overflow-hidden ring-4 ring-white shadow-lg">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            currentUser.name.charAt(0)
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{currentUser.name}</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">{currentUser.role}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-600 font-medium">
            <span className="flex items-center"><Mail className="h-4 w-4 mr-2 text-slate-400" /> {currentUser.email}</span>
            <span className="flex items-center"><Building2 className="h-4 w-4 mr-2 text-slate-400" /> Estate OS</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mt-8 mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Total Leads</p>
          <h3 className="text-3xl font-black text-slate-900">{leads.length}</h3>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Deals Closed</p>
          <h3 className="text-3xl font-black text-emerald-600">{dealsClosed}</h3>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Meetings Done</p>
          <h3 className="text-3xl font-black text-blue-600">{totalMeetings}</h3>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Conversion Rate</p>
          <h3 className="text-3xl font-black text-purple-600">{conversionRate}%</h3>
        </Card>
      </div>
    </div>
  );
}
