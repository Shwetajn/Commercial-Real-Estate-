"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Shield, Users, Target, Building2, Search, Filter, ArrowRight } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    { id: 'log_1', action: 'Approved Property', target: 'DLF Cyber City Tower 8', user: 'System Admin', role: 'Admin', time: 'Today, 2:45 PM', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'log_2', action: 'Bulk Assigned Leads', target: '5 Leads -> Rohit Verma', user: 'System Admin', role: 'Admin', time: 'Today, 11:30 AM', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'log_3', action: 'Status Update', target: 'Lead: TechFlow Solutions', user: 'Priya Sharma', role: 'Sales Manager', time: 'Today, 10:15 AM', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'log_4', action: 'Created Employee', target: 'Priya Sharma', user: 'System Admin', role: 'Admin', time: 'Yesterday, 4:15 PM', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'log_5', action: 'Property Submitted', target: 'Prestige Tech Cloud', user: 'Sanjay Verma', role: 'Supply Executive', time: 'Yesterday, 2:00 PM', icon: Building2, color: 'text-slate-600', bg: 'bg-slate-100' },
    { id: 'log_6', action: 'Security Policy Updated', target: 'Global Data Compliance', user: 'System Admin', role: 'Admin', time: 'Last Week, Monday', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
          <p className="text-slate-500 mt-2">Chronological system trace of all workspace activities.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
          Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or target..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Action</th>
                <th className="px-6 py-4 font-semibold w-1/3">Target</th>
                <th className="px-6 py-4 font-semibold w-1/4">User</th>
                <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const Icon = log.icon;
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.bg} ${log.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-900">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{log.target}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                          {log.user.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{log.user}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-slate-500">{log.time}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
            Load Older Logs <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Card>

    </div>
  );
}
