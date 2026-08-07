"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Plus, Search, Filter, Activity } from "lucide-react";

export default function LeadSourcesPage() {
  const router = useRouter();
  const { leadSources, updateLeadSourceStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSources = leadSources.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lead Source Management</h1>
          <p className="text-slate-500 mt-2">Manage lead acquisition channels and automation rules.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/sources/add')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Channel
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sources..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* TABLE */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Source Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Channel Input</th>
                <th className="px-6 py-4 font-semibold">AI Handling Rule</th>
                <th className="px-6 py-4 font-semibold">Auto Assignment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Activity className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-900">No sources found</p>
                  </td>
                </tr>
              ) : (
                filteredSources.map((source) => (
                  <tr key={source.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{source.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {source.type}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {source.channelInput || <span className="italic text-slate-300">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {source.aiHandlingRule || <span className="italic text-slate-300">None</span>}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {source.autoAssignRule ? (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                          {source.autoAssignRule}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => updateLeadSourceStatus(source.id, source.status === 'Active' ? 'Inactive' : 'Active')}
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${
                          source.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {source.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/sources/${source.id}`)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
