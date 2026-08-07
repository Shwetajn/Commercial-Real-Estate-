"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Database, Zap, Clock, AlertTriangle, RefreshCw } from "lucide-react";

export default function SystemMonitoringPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Monitoring</h1>
          <p className="text-slate-500 mt-2">Technical health and platform infrastructure metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Server className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">99.9% Uptime</span>
            </div>
            <h3 className="font-bold text-slate-900">Server Status</h3>
            <p className="text-sm text-slate-500 mt-1">Healthy</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Replica Syncing</span>
            </div>
            <h3 className="font-bold text-slate-900">Database Status</h3>
            <p className="text-sm text-slate-500 mt-1">Load: 24%</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Optimal</span>
            </div>
            <h3 className="font-bold text-slate-900">AI Services</h3>
            <p className="text-sm text-slate-500 mt-1">All models active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">P95</span>
            </div>
            <h3 className="font-bold text-slate-900">API Response</h3>
            <p className="text-sm text-slate-500 mt-1">124ms avg</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> System Warnings & Errors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {[
                { type: 'Warning', title: 'High memory usage on Worker Node 3', time: '10 mins ago', id: 'W-492' },
                { type: 'Error', title: 'LinkedIn scraper API rate limit exceeded', time: '22 mins ago', id: 'E-118' },
                { type: 'Warning', title: 'Database replica lag > 5 seconds', time: '1 hour ago', id: 'W-491' },
                { type: 'Error', title: 'Failed to dispatch email (SendGrid timeout)', time: '3 hours ago', id: 'E-117' },
              ].map((log, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${log.type === 'Error' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <p className="font-bold text-slate-900 text-sm">{log.title}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{log.time}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">{log.id}</span>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View Trace</button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" /> Background Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {[
                { name: 'Sync Salesforce Leads', org: 'Knight Frank', status: 'Running', time: '2m 14s' },
                { name: 'Generate Monthly Invoice', org: 'System', status: 'Failed', time: '4s' },
                { name: 'Train Client Model (v2)', org: 'CBRE', status: 'Running', time: '45m 10s' },
                { name: 'Data Retention Cleanup', org: 'System', status: 'Completed', time: '12m 00s' },
              ].map((job, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{job.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Target: {job.org}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${
                        job.status === 'Completed' ? 'text-emerald-600' :
                        job.status === 'Failed' ? 'text-red-600' :
                        'text-indigo-600 animate-pulse'
                      }`}>{job.status}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{job.time}</p>
                    </div>
                    {job.status === 'Failed' ? (
                      <button className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
