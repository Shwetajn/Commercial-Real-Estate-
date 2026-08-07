"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AuditLogsPage() {
  const { auditLogs } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit & Compliance</h1>
          <p className="text-slate-500 mt-2">Global activity tracking across internal platforms and workspaces.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors shadow-sm">
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search actions or users..."
              className="w-full rounded-lg bg-white pl-9 border-slate-200 focus-visible:ring-indigo-600/20 text-sm h-9"
            />
          </div>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium outline-none focus:border-indigo-600">
            <option>All Workspaces</option>
            <option>Admin Workspace</option>
            <option>Sales Workspace</option>
            <option>Supply Workspace</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium outline-none focus:border-indigo-600">
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Sales Executive</option>
            <option>Supply Executive</option>
          </select>
          <input type="date" className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium outline-none focus:border-indigo-600" />
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4 w-1/3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{log.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        log.role === 'Super Admin' ? 'bg-red-50 text-red-600' :
                        log.role === 'Admin' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-800">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditLogs.length === 0 && (
            <div className="p-12 text-center text-slate-500">No audit logs found matching criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
