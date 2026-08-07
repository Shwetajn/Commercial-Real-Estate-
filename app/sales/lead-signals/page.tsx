"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Activity, Users, MessageSquare, Globe, FileText, CheckCircle, TrendingUp, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_SIGNALS, LeadSignal } from "./mock-data";

export default function LeadSignalsPage() {
  const router = useRouter();
  const [signals] = useState<LeadSignal[]>(MOCK_SIGNALS);
  const [activeTab, setActiveTab] = useState<'All Signals' | 'High Intent' | 'Converted' | 'Pending Verification'>('All Signals');
  const [searchTerm, setSearchTerm] = useState('');

  // Derived metrics
  const pendingCount = signals.filter(s => s.status === 'Pending Verification').length;

  // Filter logic
  const filteredSignals = signals.filter(s => {
    const matchesSearch = s.company.toLowerCase().includes(searchTerm.toLowerCase()) || s.industry.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeTab === 'All Signals') return s.status === 'New';
    if (activeTab === 'High Intent') return s.confidenceLevel === 'High' && s.status === 'New';
    if (activeTab === 'Converted') return s.status === 'Converted';
    if (activeTab === 'Pending Verification') return s.status === 'Pending Verification';
    return true;
  });

  const getSourceIcon = (type: string) => {
    switch(type) {
      case 'linkedin': return <Users className="h-4 w-4 text-[#0A66C2]" />;
      case 'twitter': return <MessageSquare className="h-4 w-4 text-slate-800" />;
      case 'news': return <FileText className="h-4 w-4 text-amber-600" />;
      default: return <Globe className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600" /> Lead Signals
          </h1>
          <p className="text-sm text-slate-500 mt-1">Discover AI identified expansion opportunities and potential clients before they enter CRM.</p>
        </div>

        {/* TABS & SEARCH */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 p-2 gap-4">
            <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar">
              {(['All Signals', 'High Intent', 'Converted', 'Pending Verification'] as const).map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-md transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === 'Pending Verification' && pendingCount > 0 && <span className="ml-2 bg-amber-100 text-amber-800 py-0.5 px-1.5 rounded text-[10px]">{pendingCount}</span>}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64 px-2 md:px-0 md:mr-2 mb-2 md:mb-0">
              <Search className="absolute left-3 md:left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search signals..." 
                className="pl-9 h-9 text-sm bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* SIGNALS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Company</th>
                  <th className="px-6 py-4 font-bold">Signal</th>
                  <th className="px-6 py-4 font-bold">Source</th>
                  <th className="px-6 py-4 font-bold">Confidence</th>
                  <th className="px-6 py-4 font-bold">Detected Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSignals.map(signal => (
                  <tr key={signal.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base">{signal.company}</div>
                      <div className="text-xs text-slate-500 font-medium">{signal.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-indigo-500"/> {signal.signalType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600 bg-slate-100/50 w-max px-2.5 py-1 rounded-md">
                        {getSourceIcon(signal.sourceIcon)} {signal.source}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${signal.confidenceScore > 85 ? 'bg-emerald-500' : signal.confidenceScore > 70 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{width: `${signal.confidenceScore}%`}}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{signal.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(signal.detectedDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        activeTab === 'Pending Verification' ? 'text-amber-700 bg-amber-50 border-amber-200/50' : 
                        activeTab === 'Converted' ? 'text-emerald-700 bg-emerald-50 border-emerald-200/50' :
                        'text-indigo-700 bg-indigo-50 border-indigo-200/50'
                      }`}>
                        {activeTab === 'Converted' && <CheckCircle className="h-3 w-3 mr-1"/>}
                        {activeTab === 'Pending Verification' ? 'Pending' : signal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/sales/lead-signals/${signal.id}`)} className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredSignals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <Activity className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No signals found in this category.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
