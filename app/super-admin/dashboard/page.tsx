"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layers, Zap, AlertTriangle, ArrowUpRight, Target, Building2 } from "lucide-react";
import { KpiCard } from "@/components/shared/KpiCard";

export default function SuperAdminDashboard() {
  const { globalWorkspaces, aiPrompts, employees, leads, properties } = useAppStore();

  const totalUsers = employees.length;
  const activeWorkspaces = globalWorkspaces.filter(w => w.status === 'Active').length;
  const totalLeads = leads.length;
  const availableInventory = properties.length;
  const aiActions = aiPrompts.reduce((acc, p) => acc + p.processedRequests, 0);

  const salesTeamCount = employees.filter(e => e.department === 'Sales').length;
  const supplyTeamCount = employees.filter(e => e.department === 'Supply').length;
  const adminTeamCount = employees.filter(e => e.department === 'Operations').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Global Dashboard</h1>
        <p className="text-slate-500 mt-2">Internal platform governance, system health, and overall performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <KpiCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          trendIcon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
          trendText="+12% growth"
          trendTextColor="text-emerald-600"
        />

        <KpiCard
          title="Active Workspaces"
          value={activeWorkspaces}
          icon={<Layers className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          trendText="All Internal Active"
          trendTextColor="text-slate-500"
        />

        <KpiCard
          title="Total Leads"
          value={totalLeads}
          icon={<Target className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50"
          trendIcon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
          trendText="+4 this week"
          trendTextColor="text-emerald-600"
        />

        <KpiCard
          title="Available Inventory"
          value={availableInventory}
          icon={<Building2 className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
          trendText="+2 new properties"
          trendTextColor="text-emerald-600"
        />

        <KpiCard
          title="AI Processes"
          value={`${(aiActions / 1000).toFixed(1)}k`}
          icon={<Zap className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
          trendIcon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
          trendText="+22% load"
          trendTextColor="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Team Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Sales Team</span>
                  <span className="text-sm text-slate-500">{salesTeamCount} users</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(salesTeamCount / totalUsers) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Supply Team</span>
                  <span className="text-sm text-slate-500">{supplyTeamCount} users</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(supplyTeamCount / totalUsers) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Admin Team</span>
                  <span className="text-sm text-slate-500">{adminTeamCount} users</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(adminTeamCount / totalUsers) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">System Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">New user added: Rohit Verma</p>
                  <p className="text-xs text-slate-600 mt-1">Assigned to Sales Workspace.</p>
                </div>
                <span className="text-xs text-slate-400">10 mins ago</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Permission changes</p>
                  <p className="text-xs text-slate-600 mt-1">Global permission &quot;Approve Inventory&quot; updated.</p>
                </div>
                <span className="text-xs text-slate-400">1 hr ago</span>
              </div>
              <div className="p-4 flex items-center justify-between bg-amber-50/50">
                <div>
                  <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> AI confidence drop
                  </p>
                  <p className="text-xs text-amber-700 mt-1">Lead Extraction Prompt v2.4 fell below 90% accuracy threshold.</p>
                </div>
                <span className="text-xs text-amber-600">3 hrs ago</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Integration Alert</p>
                  <p className="text-xs text-slate-600 mt-1">WhatsApp API reconnected successfully.</p>
                </div>
                <span className="text-xs text-slate-400">5 hrs ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
