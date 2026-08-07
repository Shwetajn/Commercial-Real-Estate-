"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, Activity, Calendar, Users, Target, Building2, CheckCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const { properties, leads, employees, currentUser } = useAppStore();

  const adminName = currentUser?.name || 'System Admin';
  const adminEmail = currentUser?.email || 'admin@estateos.com';

  const approvedPropertiesCount = properties.filter(p => p.lifecycleStatus === 'Approved').length;
  const assignedLeadsCount = leads.filter(l => l.assignedExecutive && l.assignedExecutive !== 'System').length;
  const activeUsersCount = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administrator Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account and view your platform footprint.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PROFILE CARD */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
            <div className="h-32 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700" />
            <CardContent className="p-6 pt-0 relative">
              <div className="w-24 h-24 rounded-full bg-white text-indigo-600 flex items-center justify-center text-3xl font-black mx-auto -mt-12 mb-4 ring-4 ring-slate-50 shadow-md">
                {adminName.substring(0,2).toUpperCase()}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900">{adminName}</h3>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mt-1 mb-6 flex items-center justify-center gap-1.5">
                  <Shield className="h-4 w-4" /> Global Admin
                </p>
                
                <div className="space-y-4 pt-6 border-t border-slate-100 text-left">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Employee ID</p>
                    <p className="font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg inline-block">WOS-A001</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email Address</p>
                    <p className="font-medium text-slate-700">{adminEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Account Created</p>
                    <p className="font-medium text-slate-700">January 1, 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* METRICS & ACTIVITY */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm hover:border-indigo-600 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{approvedPropertiesCount}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-1">Properties Approved</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:border-indigo-600 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{assignedLeadsCount}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-1">Leads Assigned</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:border-indigo-600 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{activeUsersCount}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-1">Active Team Members</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" /> Recent Administrative Action
              </h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Approved Property: DLF Cyber City Tower 8</p>
                    <p className="text-xs text-slate-500 mt-0.5">Property was verified and added to active inventory.</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Today, 2:45 PM</p>
                  </div>
                </div>
                <div className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Assigned 5 Leads via Bulk Tool</p>
                    <p className="text-xs text-slate-500 mt-0.5">Assigned to Sales Manager Rohit Verma (North Region).</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Today, 11:30 AM</p>
                  </div>
                </div>
                <div className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Created Employee: Priya Sharma</p>
                    <p className="text-xs text-slate-500 mt-0.5">Generated credentials and assigned Sales Manager role.</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Yesterday, 4:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

    </div>
  );
}
