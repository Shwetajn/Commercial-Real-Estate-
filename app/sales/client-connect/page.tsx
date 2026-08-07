"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Plus, Search, MapPin, Send, Paperclip, 
  Bot, Sparkles, User, Calendar, Layers, CheckSquare, 
  ChevronRight, Building2, ExternalLink, RefreshCw, X, 
  Activity, Clock, FileText, Briefcase
} from "lucide-react";
import { useAppStore } from "@/lib/store";

// ==========================================
// MOCK DATA & TYPES
// ==========================================
type Message = { id: string, text: string, sender: 'client' | 'sales', time: string, isProperty?: boolean, propertyData?: any };
type Thread = { id: string, title: string, requirement: string, location: string, budget: string, preferred: string, timeline: string, propertyId?: string, messages: Message[] };
type Client = { 
  id: string, name: string, company: string, avatar: string, unread: boolean, 
  industry: string, companySize: string, decisionMaker: string,
  inquiries: number, temperature: 'Hot' | 'Warm' | 'Cold', threads: Thread[],
  progressStep: number
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: "c1", name: "Rahul Mehta", company: "TechFlow Solutions", avatar: "RM", unread: true, 
    industry: "Technology", companySize: "200-500", decisionMaker: "Rahul Mehta (VP Ops)",
    inquiries: 3, temperature: "Hot", progressStep: 3,
    threads: [
      {
        id: "t1_1", title: "Inquiry #001", requirement: "500 Seats", location: "Gurgaon", budget: "₹1L - ₹2L/month", preferred: "Managed Office", timeline: "Immediate", propertyId: "prop_1",
        messages: [
          { id: "m1", text: "Hi, I wanted to know about coworking properties in Gurgaon", sender: "client", time: "09:00 AM" },
          { id: "m2", text: "Sure, sharing available options matching your requirement of 500 seats.", sender: "sales", time: "09:15 AM" },
          { id: "m3", text: "Is the Cyber City property still available for lease?", sender: "client", time: "06:21 PM" }
        ]
      }
    ]
  },
  {
    id: "c2", name: "Shweta Jain", company: "Nexus Finance", avatar: "SJ", unread: false, 
    industry: "Finance", companySize: "50-100", decisionMaker: "Shweta Jain (Director)",
    inquiries: 1, temperature: "Warm", progressStep: 2,
    threads: [
      {
        id: "t2_1", title: "Inquiry #001", requirement: "50 Seats", location: "Mumbai BKC", budget: "₹50K/month", preferred: "Private Office", timeline: "3 Months",
        messages: [
          { id: "m1", text: "Do you have any private offices available in BKC?", sender: "client", time: "Monday" }
        ]
      }
    ]
  },
  { id: "c3", name: "Rohit Verma", company: "Creative Minds", avatar: "RV", unread: false, industry: "Media", companySize: "10-50", decisionMaker: "Rohit Verma (CEO)", inquiries: 2, temperature: "Cold", progressStep: 1, threads: [] },
  { id: "c4", name: "Priya Sahani", company: "HealthPlus", avatar: "PS", unread: false, industry: "Healthcare", companySize: "1000+", decisionMaker: "Sonia Das (Procurement)", inquiries: 1, temperature: "Warm", progressStep: 4, threads: [] }
];

export default function ClientConnectPage() {
  const { properties } = useAppStore();
  
  // State
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [activeClientId, setActiveClientId] = useState<string>("c1");
  const [activeThreadId, setActiveThreadId] = useState<string>("t1_1");
  const [clientSearch, setClientSearch] = useState("");
  const [composerText, setComposerText] = useState("");
  const [inboxFilter, setInboxFilter] = useState("All"); // All, Hot, Follow Ups, Meetings
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [aiSuggestionText, setAiSuggestionText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Derived
  const activeClient = clients.find(c => c.id === activeClientId);
  const activeThread = activeClient?.threads.find(t => t.id === activeThreadId) || activeClient?.threads[0];
  const associatedProperty = activeThread?.propertyId ? properties.find(p => p.id === activeThread?.propertyId) : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  // Actions
  const handleSendMessage = () => {
    if (!composerText.trim() || !activeClient || !activeThread) return;
    
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      text: composerText,
      sender: 'sales',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setClients(prev => prev.map(c => {
      if (c.id === activeClientId) {
        return {
          ...c,
          threads: c.threads.map(t => t.id === activeThread.id ? { ...t, messages: [...t.messages, newMsg] } : t)
        };
      }
      return c;
    }));
    setComposerText("");
    setShowAiSuggestion(false);
  };

  const handleGenerateAiReply = () => {
    setAiSuggestionText(`Hi ${activeClient?.name.split(' ')[0] || 'there'}, regarding your requirement for ${activeThread?.requirement || 'workspace'} in ${activeThread?.location || 'your preferred location'}, we have several ${activeThread?.preferred?.toLowerCase() || 'options'} matching your budget of ${activeThread?.budget}. Let me share some curated properties with you.`);
    setShowAiSuggestion(true);
  };

  const filteredClients = clients.filter(c => {
    if (clientSearch && !c.name.toLowerCase().includes(clientSearch.toLowerCase()) && !c.company.toLowerCase().includes(clientSearch.toLowerCase())) return false;
    if (inboxFilter === 'Hot' && c.temperature !== 'Hot') return false;
    // Mocking other filters for now
    return true;
  });

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      
      {/* ==========================================
          LEFT PANEL: CLIENT PIPELINE INBOX
          ========================================== */}
      <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-slate-900">Pipeline Inbox</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-3">
            {['All', 'Hot', 'Follow Ups', 'Meetings'].map(filter => (
              <Badge 
                key={filter}
                variant={inboxFilter === filter ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap ${inboxFilter === filter ? 'bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setInboxFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 h-9 text-[13px] bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className={`p-4 cursor-pointer transition-colors border-l-[3px] ${
                activeClientId === client.id 
                  ? 'bg-indigo-50/50 border-indigo-600' 
                  : 'border-transparent hover:bg-slate-50'
              }`}
              onClick={() => {
                setActiveClientId(client.id);
                if (client.threads.length > 0) setActiveThreadId(client.threads[0].id);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {client.avatar}
                    </div>
                    {client.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{client.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{client.company}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] uppercase tracking-wider px-1.5 py-0 rounded-sm border ${getTemperatureColor(client.temperature)}`}>
                  {client.temperature}
                </Badge>
              </div>
              
              {client.threads[0] && (
                <div className="mb-2 bg-white border border-slate-200 rounded p-1.5 px-2">
                  <p className="text-[11px] font-semibold text-slate-700 truncate"><Target className="h-3 w-3 inline mr-1 text-slate-400"/> {client.threads[0].requirement} in {client.threads[0].location}</p>
                </div>
              )}

              <p className={`text-[12px] truncate ${client.unread ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                {client.threads[0]?.messages[client.threads[0].messages.length - 1]?.text || 'No active conversation'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          CENTER PANEL: CONVERSATION & CONTEXT
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 border-r border-slate-200">
        {activeClient ? (
          <>
            {/* Context Header */}
            <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{activeClient.name}</h2>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">Active Status</Badge>
                </div>
                <Button variant="outline" size="sm" className="h-8 font-medium">
                  View Full Lead <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>

              {/* Requirement Summary Card */}
              {activeThread && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4 grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{activeThread.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Requirement</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{activeThread.requirement}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Budget</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{activeThread.budget}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Timeline</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{activeThread.timeline}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Type</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{activeThread.preferred}</p>
                  </div>
                </div>
              )}

              {/* Matched Properties Horizontal Scroll */}
              <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                {[1, 2].map((i) => (
                  <div key={i} className="flex-shrink-0 w-64 bg-white border border-indigo-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0">{95 - (i * 5)}% Match</Badge>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">DLF Cyber City T{i}</h4>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                      Attach
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeThread?.messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'sales' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'sales' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 mt-1.5 mx-1">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Inline AI & Composer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3">
              
              {/* Inline AI Suggestion Card */}
              {showAiSuggestion && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> AI Suggestion
                    </h4>
                    <button onClick={() => setShowAiSuggestion(false)} className="text-indigo-400 hover:text-indigo-600"><X className="h-4 w-4" /></button>
                  </div>
                  <p className="text-sm text-indigo-900/80 mb-3 leading-relaxed">{aiSuggestionText}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 bg-primary hover:bg-primary/90 text-xs font-bold px-4" onClick={() => { setComposerText(aiSuggestionText); setShowAiSuggestion(false); }}>
                      Use Reply
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold px-4" onClick={handleGenerateAiReply}>
                      <RefreshCw className="h-3 w-3 mr-1.5" /> Regenerate
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl shrink-0 text-slate-500">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <textarea 
                    value={composerText}
                    onChange={e => setComposerText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full min-h-[48px] max-h-32 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none custom-scrollbar"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute right-2 bottom-2 text-indigo-600 hover:bg-indigo-50 font-bold px-2 py-1 h-8"
                    onClick={handleGenerateAiReply}
                  >
                    <Bot className="h-4 w-4 mr-1.5" /> AI Reply
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!composerText.trim()}
                  className="h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Select a Client</h3>
            <p>Choose a lead from your pipeline inbox to view deal context and continue the conversation.</p>
          </div>
        )}
      </div>

      {/* ==========================================
          RIGHT PANEL: SALES INTELLIGENCE
          ========================================== */}
      {activeClient && (
        <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col z-10 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-6">
            
            <h2 className="font-bold text-lg text-slate-900 mb-4">Sales Intelligence</h2>

            {/* Client Profile */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Profile</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Industry</span>
                  <span className="text-xs font-semibold text-slate-900">{activeClient.industry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Size</span>
                  <span className="text-xs font-semibold text-slate-900">{activeClient.companySize} Emp</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><User className="h-3 w-3" /> Decision Maker</span>
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{activeClient.decisionMaker}</span>
                </div>
              </div>
            </div>

            {/* Deal Progress Timeline */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deal Progress</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="space-y-4">
                  {[
                    'Lead Created', 'Qualified', 'Property Shared', 'Meeting Scheduled', 'Negotiation'
                  ].map((step, idx) => {
                    const isCompleted = activeClient.progressStep > idx;
                    const isCurrent = activeClient.progressStep === idx;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                          isCurrent ? 'bg-white border-indigo-600' : 'bg-white border-slate-200'
                        }`}>
                          {isCompleted && <CheckSquare className="h-2.5 w-2.5" />}
                          {isCurrent && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </div>
                        <span className={`text-xs font-semibold ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Next Best Actions */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Next Best Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start h-9 text-xs font-semibold text-slate-700 bg-white">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 text-xs font-semibold text-slate-700 bg-white">
                  <Layers className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Generate Deck
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 text-xs font-semibold text-slate-700 bg-white">
                  <CheckSquare className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Create Task
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3 pb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent Activity</h3>
              <div className="space-y-4 border-l-2 border-slate-100 ml-2.5 pl-4 relative">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                  <p className="text-xs font-semibold text-slate-900">Email Received</p>
                  <p className="text-[10px] text-slate-500">2 hours ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                  <p className="text-xs font-semibold text-slate-900">Property "DLF Cyber City" shared</p>
                  <p className="text-[10px] text-slate-500">Yesterday</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                  <p className="text-xs font-semibold text-slate-900">Lead Qualified</p>
                  <p className="text-[10px] text-slate-500">3 days ago</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
