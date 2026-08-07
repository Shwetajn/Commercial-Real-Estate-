"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings2, BarChart3, Target, Share2, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const performanceData = [
  { month: "Jan", leads: 45, conversion: 12 },
  { month: "Feb", leads: 52, conversion: 15 },
  { month: "Mar", leads: 38, conversion: 10 },
  { month: "Apr", leads: 65, conversion: 18 },
  { month: "May", leads: 85, conversion: 22 },
  { month: "Jun", leads: 72, conversion: 16 },
];

export default function LeadSourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { leadSources, updateLeadSourceStatus, updateLeadSourceRule, employees } = useAppStore();
  
  const source = leadSources.find(s => s.id === params.id);
  const [assignRule, setAssignRule] = useState(source?.autoAssignRule || "");

  if (!source) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Source Not Found</h2>
        <button onClick={() => router.push('/admin/sources')} className="text-indigo-600 font-semibold hover:underline">
          Return to Sources
        </button>
      </div>
    );
  }

  const handleSaveRule = () => {
    updateLeadSourceRule(source.id, assignRule);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/admin/sources')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{source.name}</h1>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
              source.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {source.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span className="font-semibold text-slate-700">{source.type}</span> • ID: {source.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Config & Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-indigo-600" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Status</label>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <span className="text-sm font-semibold text-slate-700">Source Active</span>
                  <button 
                    onClick={() => updateLeadSourceStatus(source.id, source.status === 'Active' ? 'Inactive' : 'Active')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${source.status === 'Active' ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span aria-hidden="true" className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${source.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Auto-Assign Rule</label>
                <textarea 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 min-h-[100px]"
                  placeholder="e.g. If Region = North -> Assign to Rohit Verma"
                  value={assignRule}
                  onChange={(e) => setAssignRule(e.target.value)}
                />
                <button 
                  onClick={handleSaveRule}
                  className="mt-3 w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
                >
                  Save Rules
                </button>
              </div>
              
              {source.type === 'Integration' && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">API Webhook Endpoint</label>
                  <div className="flex">
                    <input 
                      readOnly 
                      value={`https://api.estateos.com/v1/webhooks/${source.id}`}
                      className="flex-1 rounded-l-xl border border-r-0 border-slate-200 px-3 py-2 text-xs bg-slate-50 text-slate-500 font-mono"
                    />
                    <button className="px-3 py-2 bg-slate-200 text-slate-700 rounded-r-xl text-xs font-semibold hover:bg-slate-300">
                      Copy
                    </button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Col: Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI Mini Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Target className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Total Leads</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{source.leadsGenerated.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Share2 className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{source.conversionRate}%</p>
            </div>
          </div>

          {/* Chart */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" /> Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      name="Leads Generated"
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorLeads)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
