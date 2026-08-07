"use client";

import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/shared/KpiCard";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowRight, Activity, Users, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export default function SalesDashboardPage() {
  const { leads, meetings } = useAppStore();
  const router = useRouter();

  // Metrics
  const activeLeads = leads.filter(l => l.status !== 'Closed').length;
  const openRequirements = leads.filter(l => l.status === 'New Requirement').length;
  const scheduledMeetings = meetings.filter(m => m.status === 'Upcoming').length;
  const dealsClosed = leads.filter(l => l.status === 'Closed').length;

  // Pipeline Data
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pipelineData = [
    { name: 'New Requirement', value: statusCounts['New Requirement'] || 0, color: '#3b82f6' },
    { name: 'Property Suggested', value: statusCounts['Property Suggested'] || 0, color: '#8b5cf6' },
    { name: 'Proposal Sent', value: statusCounts['Proposal Sent'] || 0, color: '#f59e0b' },
    { name: 'Negotiation', value: statusCounts['Negotiation'] || 0, color: '#ec4899' },
    { name: 'Closed', value: statusCounts['Closed'] || 0, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Conversion Mock Data
  const conversionData = [
    { name: 'Jan', value: 2 },
    { name: 'Feb', value: 4 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 7 },
    { name: 'May', value: 5 },
    { name: 'Jun', value: dealsClosed },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Track leads, client requirements and active opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/sales/leads/add')} className="bg-indigo-600 hover:bg-indigo-700">
            Create Lead <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <KpiCard
          title="AI Lead Signals"
          value="4"
          icon={<Activity className="h-5 w-5 text-indigo-700" />}
          iconBgColor="bg-indigo-100"
          onClick={() => router.push('/sales/lead-signals')}
        />

        <KpiCard
          title="Active Leads"
          value={activeLeads}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        
        <KpiCard
          title="Open Requirements"
          value={openRequirements}
          icon={<Briefcase className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />

        <KpiCard
          title="Scheduled Meetings"
          value={scheduledMeetings}
          icon={<Calendar className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />

        <KpiCard
          title="Deals Closed"
          value={dealsClosed}
          icon={<CheckCircle2 className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Lead Pipeline</h3>
          <div className="h-[300px]">
            {pipelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No pipeline data</div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {pipelineData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Monthly Conversion</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => router.push('/sales/leads/add')} className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-600 hover:shadow-md transition-all group">
            <Users className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Create Lead</p>
          </button>
          <button onClick={() => router.push('/sales/client-search')} className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-600 hover:shadow-md transition-all group">
            <SearchIcon className="h-5 w-5 text-slate-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Search Client</p>
          </button>
          <button onClick={() => router.push('/sales/deck-generation')} className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-600 hover:shadow-md transition-all group">
            <LayoutTemplate className="h-5 w-5 text-slate-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Generate Deck</p>
          </button>
          <button onClick={() => router.push('/sales/inventory')} className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-600 hover:shadow-md transition-all group">
            <Building2 className="h-5 w-5 text-slate-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Find Inventory</p>
          </button>
        </div>
      </div>
    </div>
  );
}

import { Search as SearchIcon, LayoutTemplate, Building2 } from "lucide-react";
