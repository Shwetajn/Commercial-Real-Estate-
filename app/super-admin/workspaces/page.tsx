"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkspacesPage() {
  const { globalWorkspaces, employees } = useAppStore();
  const router = useRouter();

  const getWorkspaceUsers = (workspaceName: string) => {
    return employees.filter(e => e.workspaceName === workspaceName).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Management</h1>
          <p className="text-slate-500 mt-2">Configure modules and settings for the internal platform workspaces.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {globalWorkspaces.map(ws => (
          <Card key={ws.id} className="bg-white border-slate-200 shadow-sm flex flex-col h-full hover:border-indigo-200 transition-colors">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="h-6 w-6" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  ws.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {ws.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900">{ws.name}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 mb-6">Users: {getWorkspaceUsers(ws.name)}</p>

              <div className="mb-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Enabled Modules</p>
                <div className="space-y-2">
                  {ws.modulesEnabled.map((mod, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm text-slate-700 font-medium">{mod}</span>
                    </div>
                  ))}
                  {ws.modulesEnabled.length === 0 && (
                    <span className="text-sm text-slate-500 italic">No modules enabled</span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={() => router.push(`/super-admin/workspaces/${ws.id}`)}
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Settings className="h-4 w-4" />
                  Configure Modules
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
