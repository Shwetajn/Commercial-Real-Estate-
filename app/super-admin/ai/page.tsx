"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, Settings2, FileText, ArrowUpRight, History } from "lucide-react";
import { useState } from "react";

export default function AIControlCenterPage() {
  const { aiPrompts } = useAppStore();
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Control Center</h1>
        <p className="text-slate-500 mt-2">Monitor AI models, adjust global thresholds, and manage prompt configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AI Performance Overview */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold text-slate-900 mb-4">AI Tasks Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPrompts.map(prompt => (
              <Card key={prompt.id} className="bg-white border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600">Healthy</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{prompt.name}</h3>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Processed</p>
                      <p className="font-bold text-slate-900">{prompt.processedRequests.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">Accuracy</p>
                      <p className="font-bold text-emerald-600 flex items-center gap-1 justify-end">
                        {prompt.accuracy}% <ArrowUpRight className="h-3 w-3" />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm h-full">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-indigo-500" /> Global AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-slate-900 text-sm">Lead Confidence Threshold</label>
                  <span className="text-indigo-600 font-bold text-sm">{confidenceThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="100" 
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full accent-indigo-600" 
                />
                <p className="text-xs text-slate-500 mt-2">
                  Auto-approve and assign leads with extraction confidence &gt; {confidenceThreshold}%. 
                  Leads below this require manual review.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  Save Configuration
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Management */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm h-full">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" /> Prompt Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {aiPrompts.map(prompt => (
                  <div key={prompt.id} className="p-4 flex items-start justify-between hover:bg-slate-50/50 transition-colors group">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{prompt.name}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">{prompt.version}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-md line-clamp-1">{prompt.description}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1">
                        <History className="h-3 w-3" /> History
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Logs */}
        <div className="md:col-span-3">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-500" /> Recent AI Logs
              </CardTitle>
              <button className="text-sm font-semibold text-indigo-600 hover:underline">View All Logs</button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Input snippet</th>
                      <th className="px-6 py-4">Confidence</th>
                      <th className="px-6 py-4">Feedback</th>
                      <th className="px-6 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { task: 'Lead Extraction', input: 'Looking for 5000 sqft in cyber city...', conf: 98, feedback: 'Auto-approved', time: '2 mins ago' },
                      { task: 'Mail Generation', input: 'Client requested options for Andheri...', conf: 92, feedback: 'Sent', time: '15 mins ago' },
                      { task: 'Lead Extraction', input: 'Need space asap.', conf: 45, feedback: 'Manual Review', time: '1 hour ago' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{log.task}</td>
                        <td className="px-6 py-4 text-slate-500 italic text-xs truncate max-w-[200px]">&quot;{log.input}&quot;</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${log.conf > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{log.conf}%</span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-medium">{log.feedback}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
