"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Mail, MessageSquare, Share2, Globe, FileText, Smartphone } from "lucide-react";

export default function AddLeadSourcePage() {
  const router = useRouter();
  const { leadSources, addLeadSource } = useAppStore();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");
  const [channelInput, setChannelInput] = useState("");
  const [aiHandlingRule, setAiHandlingRule] = useState("Auto AI respond");
  const [notifyOnNew, setNotifyOnNew] = useState(false);
  const [tagHighPriority, setTagHighPriority] = useState(false);

  const channelOptions = [
    { value: 'Email', icon: Mail },
    { value: 'WhatsApp', icon: MessageSquare },
    { value: 'Business Messaging', icon: MessageSquare },
    { value: 'SMS Notification', icon: Smartphone },
    { value: 'Web Form', icon: Globe },
    { value: 'LinkedIn Scraper', icon: Share2 },
    { value: 'Manual Upload', icon: FileText }
  ];

  const handleAddChannel = () => {
    if (!name || !type) return;

    const newSource = {
      id: `src_${Date.now()}`,
      name,
      type: type as any,
      channelInput,
      aiHandlingRule,
      status: 'Active' as const,
      leadsGenerated: 0,
      conversionRate: 0,
    };

    addLeadSource(newSource);
    router.push('/admin/sources');
  };

  const isTypeDisabled = (optionValue: string) => {
    return leadSources.some(s => s.type === optionValue);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/admin/sources')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Channel</h1>
          <p className="text-sm text-slate-500 mt-1">Configure a new lead acquisition source and AI rules.</p>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" /> Basic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Channel Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" 
              placeholder="e.g. Primary Website Form" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Channel Type</label>
            <div className="relative">
              <select 
                value={type}
                onChange={e => {
                  setType(e.target.value);
                  setChannelInput(''); // Reset input on type change
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white appearance-none"
              >
                <option value="">Select Channel Type...</option>
                {channelOptions.map(opt => {
                  const disabled = isTypeDisabled(opt.value);
                  return (
                    <option key={opt.value} value={opt.value} disabled={disabled}>
                      {opt.value} {disabled ? ' - already exists' : ''}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {type && type !== 'Manual Upload' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
                {type === 'Email' ? 'Email Inbox' :
                 ['WhatsApp', 'Business Messaging', 'SMS Notification'].includes(type) ? 'Business Phone Number' :
                 type === 'LinkedIn Scraper' ? 'Scraper Configuration URL' :
                 'Form Endpoint'}
              </label>
              <input 
                value={channelInput}
                onChange={e => setChannelInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white font-mono" 
                placeholder={
                  type === 'Email' ? 'leads@company.com' :
                  ['WhatsApp', 'Business Messaging', 'SMS Notification'].includes(type) ? '+91 98765 43210' :
                  type === 'LinkedIn Scraper' ? 'https://api.scraper.com/v1/config' :
                  'https://api.estateos.com/v1/webhooks/form'
                }
              />
            </div>
          )}

        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" /> AI Fallback Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">When AI can't parse details:</label>
          <div className="relative">
            <select 
              value={aiHandlingRule}
              onChange={e => setAiHandlingRule(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white appearance-none"
            >
              <option value="Auto AI respond">Auto AI respond</option>
              <option value="Send to admin review">Send to admin review</option>
              <option value="Ignore incomplete lead">Ignore incomplete lead</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" /> Automation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              checked={notifyOnNew}
              onChange={e => setNotifyOnNew(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-600" 
            />
            <div>
              <p className="font-bold text-slate-900">Notify on new lead</p>
              <p className="text-xs text-slate-500">Send an alert when a lead is captured from this channel.</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              checked={tagHighPriority}
              onChange={e => setTagHighPriority(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-600" 
            />
            <div>
              <p className="font-bold text-slate-900">Tag high priority</p>
              <p className="text-xs text-slate-500">Automatically tag if message includes: <span className="font-mono bg-slate-100 px-1 rounded">urgent</span> / <span className="font-mono bg-slate-100 px-1 rounded">relocate</span> / <span className="font-mono bg-slate-100 px-1 rounded">expansion</span></p>
            </div>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleAddChannel}
          disabled={!name || !type}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          Add Channel
        </button>
      </div>

    </div>
  );
}
