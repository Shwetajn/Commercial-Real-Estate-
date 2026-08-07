"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Layers, Power, LayoutDashboard, Users, Building2, Target, 
  Globe, CheckSquare, CheckCircle, Settings, ScrollText, Search, Phone, 
  Calendar, Activity, LayoutTemplate, Mail, PlusSquare, Clock, Bot,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";

const ADMIN_MODULES = [
  { id: 'team_management', name: 'Team Management', icon: Users, desc: 'Manage users, reporting structure, departments' },
  { id: 'inventory_management', name: 'Inventory Management', icon: Building2, desc: 'Approve and manage property inventory' },
  { id: 'lead_management', name: 'Lead Management', icon: Target, desc: 'Manage leads, assignment and verification' },
  { id: 'lead_sources', name: 'Lead Source Management', icon: Globe, desc: 'Configure lead capture sources' },
  { id: 'approval_center', name: 'Approval Center', icon: CheckSquare, desc: 'Review approvals from sales/supply teams' },
  { id: 'task_management', name: 'Task Management', icon: CheckCircle, desc: 'Manage operational tasks' },
  { id: 'platform_settings', name: 'Platform Settings', icon: Settings, desc: 'Workspace level rules and preferences' },
  { id: 'audit_logs', name: 'Audit Logs', icon: ScrollText, desc: 'Track admin activities' },
];

const SALES_MODULES = [
  { id: 'lead_signals', name: 'Lead Signals', icon: Activity, desc: 'AI generated opportunity signals' },
  { id: 'leads', name: 'Lead Management', icon: Target, desc: 'Assigned leads and pipeline tracking' },
  { id: 'inventory', name: 'Inventory', icon: Building2, desc: 'Browse approved properties' },
  { id: 'meetings', name: 'Meetings', icon: Calendar, desc: 'Schedule and track client meetings' },
  { id: 'client_search', name: 'Client Search', icon: Search, desc: 'View complete client intelligence' },
  { id: 'client_connect', name: 'Client Connect', icon: Phone, desc: 'Direct client communication' },
  { id: 'deck_generation', name: 'Deck Generation', icon: LayoutTemplate, desc: 'Generate client pitch decks' },
  { id: 'ai_mail_management', name: 'AI Mail Management', icon: Mail, desc: 'Generate and manage client emails' },
  { id: 'task_management', name: 'Task Management', icon: CheckCircle, desc: 'Manage your operational tasks' }
];

const SUPPLY_MODULES = [
  { id: 'inventory_management', name: 'Inventory Management', icon: Building2, desc: 'Submit and manage properties' },
  { id: 'approval_tracking', name: 'Approval Tracking', icon: Clock, desc: 'Track property approval status' },
  { id: 'task_management', name: 'Task Management', icon: CheckCircle, desc: 'Manage supply operational tasks' }
];

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { globalWorkspaces, updateWorkspaceModules } = useAppStore();
  
  const ws = globalWorkspaces.find(w => w.id === params.id);
  
  const [localModules, setLocalModules] = useState<string[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (ws) {
      setLocalModules(ws.modulesEnabled);
    }
  }, [ws]);

  if (!ws) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Layers className="h-12 w-12 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Workspace not found</h2>
        <button onClick={() => router.push('/super-admin/workspaces')} className="mt-4 text-indigo-600 font-semibold hover:underline">Return to list</button>
      </div>
    );
  }

  const getModuleList = () => {
    if (ws.type === 'Admin Workspace') return ADMIN_MODULES;
    if (ws.type === 'Sales Workspace') return SALES_MODULES;
    if (ws.type === 'Supply Workspace') return SUPPLY_MODULES;
    return [];
  };

  const modules = getModuleList();
  
  // Sort logic so disabled and enabled changes don't matter, just use the predefined order.
  const hasChanges = localModules.length !== ws.modulesEnabled.length || 
                     !localModules.every(m => ws.modulesEnabled.includes(m));

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleNavigateBack = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push('/super-admin/workspaces');
      }
    } else {
      router.push('/super-admin/workspaces');
    }
  };

  const handleToggle = (moduleId: string) => {
    setLocalModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSave = () => {
    updateWorkspaceModules(ws.id, localModules);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    const defaultModules = modules.map(m => m.id);
    setLocalModules(defaultModules);
    setShowResetModal(false);
  };

  const discardChanges = () => {
    setLocalModules(ws.modulesEnabled);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleNavigateBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{ws.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                ws.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {ws.status}
              </span>
            </div>
            <p className="text-slate-500 mt-1">{ws.usersCount} Users Provisioned</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            Reset to Default
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 font-semibold rounded-xl text-sm transition-colors shadow-sm ${
              hasChanges ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600/50 text-white cursor-not-allowed'
            }`}
          >
            Save Configuration
          </button>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Power className="h-5 w-5 text-indigo-500" /> Module Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(mod => {
              const isEnabled = localModules.includes(mod.id);
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${isEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-bold ${isEnabled ? 'text-slate-900' : 'text-slate-500'}`}>{mod.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div 
                      onClick={() => handleToggle(mod.id)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${isEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 bg-white w-4 h-4 rounded-full shadow transition-all ${isEnabled ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {isEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50/50 border-red-200 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-900">Deactivate Workspace</h4>
            <p className="text-sm text-red-700 mt-1">Suspend access for all {ws.usersCount} users. Data will be preserved.</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap">
            Deactivate Workspace
          </button>
        </CardContent>
      </Card>

      {/* Sticky Bottom Bar for Unsaved Changes */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 max-w-2xl w-full border border-slate-700">
            <div className="flex items-center gap-3 flex-1">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <p className="font-medium text-sm">You have unsaved workspace changes</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={discardChanges}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-xl text-sm hover:bg-indigo-400 transition-colors shadow-sm"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Reset workspace configuration?</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">This will restore default module access for this workspace. Custom changes will be removed.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowResetModal(false)} 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReset} 
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Reset Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-sm font-medium">Workspace configuration updated successfully</p>
          </div>
        </div>
      )}

    </div>
  );
}
