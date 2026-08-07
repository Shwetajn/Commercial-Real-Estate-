"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, ShieldCheck, Briefcase, KeyRound, CheckCircle, Info, Layers } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SelectWorkspacePage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, setWorkspace } = useAppStore();
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleRoleSelect = (role: string) => {
    if (role === 'Supply Executive') {
      setWorkspace(role);
      router.push('/supply/dashboard');
    } else if (role === 'Sales Executive') {
      setWorkspace(role);
      router.push('/sales/dashboard');
    } else if (role === 'Admin') {
      setWorkspace(role);
      router.push('/admin/dashboard');
    } else if (role === 'Super Admin') {
      setWorkspace(role);
      router.push('/super-admin/dashboard');
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-screen bg-slate-50">
      <div className="w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-indigo-600 mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {currentUser?.name.split(' ')[0]}</h3>
          <p className="text-sm text-slate-500 mt-1">Select your operational workspace to continue.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleRoleSelect('Supply Executive')}
            className="flex items-center p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50/30 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Supply Executive</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-slate-500">Manage properties, inventory and operational tasks.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors ml-2" />
          </button>

          <button 
            onClick={() => handleRoleSelect('Sales Executive')}
            className="flex items-center p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50/30 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Sales Executive</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-slate-500">Manage leads, clients and workspace deals.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors ml-2" />
          </button>

          <button 
            onClick={() => handleRoleSelect('Admin')}
            className="flex items-center p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-600 hover:bg-amber-50/30 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Admin</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-slate-500">Regional operations and approvals.</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect('Super Admin')}
            className="flex items-center p-5 rounded-2xl border border-slate-200 bg-white hover:border-red-600 hover:bg-red-50/30 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Super Admin</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-slate-500">Global system configuration.</p>
            </div>
          </button>
        </div>


        {/* TOAST */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <Info className="h-5 w-5 text-amber-400" />
              <div>
                <p className="font-bold text-sm">Role Unavailable</p>
                <p className="text-xs text-slate-300 mt-0.5">This workspace is currently under development.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
