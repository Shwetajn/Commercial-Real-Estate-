"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, User as UserIcon, Phone, Mail, FileText, Calendar, ArrowRight, LayoutTemplate, Briefcase, MapPin, CheckCircle2, AlertTriangle, MessageSquare, Users, Activity, Target } from "lucide-react";

// --- MOCK DATA ---
type ClientInfo = {
  id: string;
  name: string;
  industry: string;
  location: string;
  relationshipStatus: 'Existing Client' | 'Potential Client' | 'Past Client';
  contactPerson: string;
  lastInteraction: string;
  employeeCount: string;
  offices: number;
  expansion: string;
  accountOwner: string;
  since: string;
  contacts: { name: string, role: string, email: string, phone: string, influence: string }[];
  requirements: { id: string, text: string, location: string, budget: string, stage: string, status: 'Open' | 'Closed' }[];
  properties: { name: string, location: string, status: string }[];
  communication: { date: string, desc: string, type: 'Email' | 'Call' | 'Meeting' }[];
  brokers: { company: string, person: string, strength: string }[];
  competition: { agency: string, offer: string, price: string, status: string, risk: string, notes: string }[];
  activities: { date: string, desc: string }[];
  pastDeals: number;
  dealValue: string;
};

const MOCK_CLIENTS: ClientInfo[] = [
  {
    id: 'c1',
    name: 'Google India',
    industry: 'Technology',
    location: 'Bangalore, Mumbai, Gurgaon',
    relationshipStatus: 'Existing Client',
    contactPerson: 'Sanjay Gupta',
    lastInteraction: '10 June 2026',
    employeeCount: '5000+',
    offices: 4,
    expansion: 'Looking for 400 seats in Bangalore',
    accountOwner: 'Rohit Verma',
    since: '2024',
    contacts: [
      { name: 'Sanjay Gupta', role: 'Decision Maker', email: 'sanjay@google.com', phone: '9876543210', influence: 'High' },
      { name: 'Priya Sharma', role: 'Finance Contact', email: 'priya@google.com', phone: '9876543211', influence: 'Medium' }
    ],
    requirements: [
      { id: 'req1', text: '400 seat office', location: 'Bangalore', budget: '₹40L/month', stage: 'Proposal Sent', status: 'Open' },
      { id: 'req2', text: '150 seat office', location: 'Gurgaon', budget: '₹15L/month', stage: 'Closed Won', status: 'Closed' }
    ],
    properties: [
      { name: 'Embassy Tech Village', location: 'Bangalore', status: 'Suggested' },
      { name: 'DLF Cyber City', location: 'Gurgaon', status: 'Selected' }
    ],
    communication: [
      { date: '15 June 2026', desc: 'Proposal sent for Bangalore requirement', type: 'Email' },
      { date: '10 June 2026', desc: 'Client meeting completed at current office', type: 'Meeting' }
    ],
    brokers: [
      { company: 'ABC Realty', person: 'Ramesh Sharma', strength: 'Strong Relationship' }
    ],
    competition: [
      { agency: 'CBRE', offer: 'Embassy Tech Village', price: '₹150/sqft', status: 'Proposal Shared', risk: 'Medium', notes: 'Client comparing pricing with our options' }
    ],
    activities: [
      { date: '15 June 2026', desc: 'Property Suggested: Embassy Tech Village' },
      { date: '10 June 2026', desc: 'Meeting Done: Requirement gathering' }
    ],
    pastDeals: 1,
    dealValue: '₹15L/month'
  },
  {
    id: 'c2',
    name: 'Logitech',
    industry: 'Technology',
    location: 'Mumbai, Pune',
    relationshipStatus: 'Potential Client',
    contactPerson: 'Ayush Khandelwal',
    lastInteraction: '12 June 2026',
    employeeCount: '500+',
    offices: 2,
    expansion: 'Exploring options in Mumbai BKC',
    accountOwner: 'Rohit Verma',
    since: '-',
    contacts: [
      { name: 'Ayush Khandelwal', role: 'Admin Contact', email: 'ayush@logitech.com', phone: '9988776655', influence: 'High' }
    ],
    requirements: [
      { id: 'req3', text: '100 seat premium office', location: 'Mumbai BKC', budget: '₹12L/month', stage: 'Negotiating', status: 'Open' }
    ],
    properties: [
      { name: 'Godrej BKC', location: 'Mumbai', status: 'Visited' }
    ],
    communication: [
      { date: '12 June 2026', desc: 'Follow-up call regarding Godrej BKC visit', type: 'Call' }
    ],
    brokers: [
      { company: 'Prime Spaces', person: 'Karan Singh', strength: 'Average' }
    ],
    competition: [
      { agency: 'JLL', offer: 'Maker Maxity', price: '₹300/sqft', status: 'Negotiating', risk: 'High', notes: 'JLL pushing hard on price' }
    ],
    activities: [
      { date: '12 June 2026', desc: 'Competitor Offer Added: JLL at Maker Maxity' },
      { date: '05 June 2026', desc: 'Requirement Created' }
    ],
    pastDeals: 0,
    dealValue: '₹0'
  },
  {
    id: 'c3',
    name: 'Infosys',
    industry: 'Technology',
    location: 'Pune, Bangalore, Hyderabad',
    relationshipStatus: 'Past Client',
    contactPerson: 'Narayana Murthy',
    lastInteraction: '01 Jan 2024',
    employeeCount: '10000+',
    offices: 15,
    expansion: 'Pune office expansion',
    accountOwner: 'Sneha Patel',
    since: '2023',
    contacts: [
      { name: 'Narayana Murthy', role: 'Decision Maker', email: 'nm@infosys.com', phone: '9123456780', influence: 'High' }
    ],
    requirements: [
      { id: 'req4', text: '1000 seat campus', location: 'Pune', budget: '₹1Cr/month', stage: 'Requirement Gathering', status: 'Open' },
      { id: 'req5', text: '500 seat office', location: 'Hyderabad', budget: '₹40L/month', stage: 'Closed Won', status: 'Closed' }
    ],
    properties: [],
    communication: [
      { date: '01 Jan 2024', desc: 'Quarterly review meeting', type: 'Meeting' }
    ],
    brokers: [],
    competition: [],
    activities: [
      { date: '01 Jan 2024', desc: 'Deal Closed: Hyderabad Office' }
    ],
    pastDeals: 1,
    dealValue: '₹40L/month'
  },
  {
    id: 'c4',
    name: 'Paytm',
    industry: 'Fintech',
    location: 'Noida, Mumbai',
    relationshipStatus: 'Existing Client',
    contactPerson: 'Vijay Shekhar',
    lastInteraction: '14 June 2026',
    employeeCount: '3000+',
    offices: 3,
    expansion: 'Consolidating Noida offices',
    accountOwner: 'Rohit Verma',
    since: '2025',
    contacts: [
      { name: 'Vijay Shekhar', role: 'Decision Maker', email: 'vijay@paytm.com', phone: '9888777666', influence: 'High' }
    ],
    requirements: [
      { id: 'req6', text: '50,000 sqft office', location: 'Noida Sector 62', budget: '₹35L/month', stage: 'Site Visits', status: 'Open' }
    ],
    properties: [
      { name: 'Advant Navis', location: 'Noida', status: 'Suggested' }
    ],
    communication: [
      { date: '14 June 2026', desc: 'Shared Advant Navis proposal', type: 'Email' }
    ],
    brokers: [
      { company: 'NCR Brokers', person: 'Amit Jain', strength: 'Strong Relationship' }
    ],
    competition: [
      { agency: 'Cushman & Wakefield', offer: 'World Trade Tower', price: '₹80/sqft', status: 'Proposal Shared', risk: 'Low', notes: 'Client prefers our option due to better parking' }
    ],
    activities: [
      { date: '14 June 2026', desc: 'Property Suggested: Advant Navis' }
    ],
    pastDeals: 1,
    dealValue: '₹20L/month'
  }
];

export default function ClientSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRootTab, setActiveRootTab] = useState<'Corporate Clients' | 'Open Requirements' | 'Broker Relationships' | 'Track Records' | 'Competition Mapping'>('Corporate Clients');
  
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [activeClientTab, setActiveClientTab] = useState<'Overview' | 'Requirements' | 'Contacts' | 'Properties' | 'Communication' | 'Broker Network' | 'Competition' | 'Activity'>('Overview');

  // --- FILTERING LOGIC ---
  const lowerSearch = searchTerm.toLowerCase();
  const matchingClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(lowerSearch) || 
    c.industry.toLowerCase().includes(lowerSearch) ||
    c.contactPerson.toLowerCase().includes(lowerSearch) ||
    c.requirements.some(r => r.text.toLowerCase().includes(lowerSearch))
  );

  // --- COMPONENT RENDERING ---

  if (selectedClient) {
    // --- COMPANY DETAIL PAGE ---
    return (
      <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto pb-20">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 cursor-pointer hover:text-indigo-600 mb-2" onClick={() => setSelectedClient(null)}>
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Search Results
        </div>
        
        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                {selectedClient.name}
              </h1>
              <p className="text-base text-slate-500 font-medium mt-1">{selectedClient.industry}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest ${
              selectedClient.relationshipStatus === 'Existing Client' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
              selectedClient.relationshipStatus === 'Potential Client' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
              'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {selectedClient.relationshipStatus}
            </span>
            <Button variant="outline" className="border-slate-200" onClick={() => router.push('/sales/leads/add')}>
              <FileText className="h-4 w-4 mr-2" /> Create Requirement
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Active Requirements</p>
            <p className="text-2xl font-bold text-slate-900">{selectedClient.requirements.filter(r => r.status === 'Open').length}</p>
          </Card>
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Past Deals</p>
            <p className="text-2xl font-bold text-slate-900">{selectedClient.pastDeals}</p>
          </Card>
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Deal Value</p>
            <p className="text-2xl font-bold text-slate-900">{selectedClient.dealValue}</p>
          </Card>
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Relationship Since</p>
            <p className="text-2xl font-bold text-slate-900">{selectedClient.since}</p>
          </Card>
        </div>

        {/* COMPANY DETAIL TABS */}
        <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-px">
          {['Overview', 'Requirements', 'Contacts', 'Properties', 'Communication', 'Broker Network', 'Competition', 'Activity'].map(tab => {
            const isActive = activeClientTab === tab;
            return (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                onClick={() => setActiveClientTab(tab as any)}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
          
          {activeClientTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-indigo-600" /> Company Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Industry</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Employee Count</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.employeeCount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Office Locations</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.location}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Current Offices</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.offices}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500">Expansion Plans</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedClient.expansion}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600" /> Relationship Summary</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Account Owner</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.accountOwner}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Relationship Stage</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.relationshipStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Last Contact Date</p>
                    <p className="text-sm font-medium text-slate-900">{selectedClient.lastInteraction}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => router.push('/sales/meetings')} className="bg-indigo-600 hover:bg-indigo-700 text-xs"><Calendar className="h-3 w-3 mr-1.5" /> Schedule Meeting</Button>
                  <Button size="sm" variant="outline" className="text-xs"><MessageSquare className="h-3 w-3 mr-1.5" /> Add Note</Button>
                </div>
              </div>
            </div>
          )}

          {activeClientTab === 'Requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Current Open Requirements</h3>
                <div className="grid gap-4">
                  {selectedClient.requirements.filter(r => r.status === 'Open').map(req => (
                    <Card key={req.id} className="p-4 border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-300">
                      <div>
                        <p className="font-bold text-slate-900 text-base">{req.text}</p>
                        <div className="flex gap-4 mt-2 text-sm text-slate-600 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400"/> {req.location}</span>
                          <span>Budget: {req.budget}</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{req.stage}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">Suggest Property</Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => router.push(`/sales/deck-generation?lead=${req.id}`)}>Generate Deck</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {selectedClient.requirements.filter(r => r.status === 'Open').length === 0 && <p className="text-slate-500 text-sm">No open requirements.</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Past Requirements</h3>
                <div className="grid gap-4 opacity-75">
                  {selectedClient.requirements.filter(r => r.status === 'Closed').map(req => (
                    <Card key={req.id} className="p-4 border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-700 text-base">{req.text}</p>
                        <div className="flex gap-4 mt-1 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {req.location}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${req.stage === 'Closed Won' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{req.stage}</span>
                    </Card>
                  ))}
                  {selectedClient.requirements.filter(r => r.status === 'Closed').length === 0 && <p className="text-slate-500 text-sm">No past requirements.</p>}
                </div>
              </div>
            </div>
          )}

          {activeClientTab === 'Contacts' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Company Stakeholders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Role</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Phone</th>
                      <th className="px-6 py-4 font-bold">Influence Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedClient.contacts.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{c.role}</td>
                        <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400"/> {c.email}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{c.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${c.influence === 'High' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                            {c.influence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeClientTab === 'Properties' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Associated Properties</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedClient.properties.map((p, i) => (
                  <Card key={i} className="p-4 border-slate-200 shadow-sm bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${p.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Visited' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</p>
                  </Card>
                ))}
                {selectedClient.properties.length === 0 && <p className="text-slate-500 text-sm">No properties associated yet.</p>}
              </div>
            </div>
          )}

          {activeClientTab === 'Communication' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Communication History</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {selectedClient.communication.map((c, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 group-[.is-active]:bg-indigo-600 group-[.is-active]:text-indigo-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {c.type === 'Email' ? <Mail className="h-4 w-4" /> : c.type === 'Meeting' ? <Users className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">{c.type}</div>
                        <time className="text-xs font-medium text-indigo-600">{c.date}</time>
                      </div>
                      <div className="text-sm text-slate-600">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeClientTab === 'Broker Network' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Connected Brokers</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedClient.brokers.map((b, i) => (
                  <Card key={i} className="p-4 border-slate-200 shadow-sm bg-white flex items-start gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{b.company}</h4>
                      <p className="text-sm text-slate-600 font-medium my-1">{b.person}</p>
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-widest mt-1">
                        {b.strength}
                      </span>
                    </div>
                  </Card>
                ))}
                {selectedClient.brokers.length === 0 && <p className="text-slate-500 text-sm">No external brokers connected.</p>}
              </div>
            </div>
          )}

          {activeClientTab === 'Competition' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Competition Mapping</h3>
              <div className="grid gap-4">
                {selectedClient.competition.map((c, i) => (
                  <Card key={i} className="p-5 border-slate-200 shadow-sm bg-white flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-rose-500" />
                        <h4 className="font-bold text-slate-900 text-lg">{c.agency}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Current Offer</p>
                          <p className="font-medium text-slate-900">{c.offer}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Price Point</p>
                          <p className="font-medium text-slate-900">{c.price}</p>
                        </div>
                        <div className="col-span-2 bg-slate-50 p-3 rounded border border-slate-100">
                          <p className="text-xs font-semibold text-slate-500">Sales Notes</p>
                          <p className="text-slate-700 italic">"{c.notes}"</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-48 flex flex-col items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                      <div className="w-full">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                        <span className="inline-block w-full text-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase tracking-widest">{c.status}</span>
                      </div>
                      <div className="w-full mt-2">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Risk Level</p>
                        <span className={`inline-block w-full text-center px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${c.risk === 'High' ? 'bg-red-100 text-red-700' : c.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {c.risk} Risk
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
                {selectedClient.competition.length === 0 && <p className="text-slate-500 text-sm">No competition threats mapped.</p>}
              </div>
            </div>
          )}

          {activeClientTab === 'Activity' && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {selectedClient.activities.map((a, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{a.desc}</p>
                      <p className="text-xs text-slate-500 mt-1">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // --- MAIN SEARCH VIEW ---
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto pb-20">
      
      {/* SEARCH HEADER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Client Search</h1>
        <p className="text-base text-slate-500 font-medium mb-8">Search clients, requirements, relationships and market intelligence.</p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search company, industry or client... (e.g. Tech, Google)" 
            className="pl-14 h-14 bg-slate-50 border-slate-300 w-full text-lg rounded-xl shadow-inner focus-visible:ring-indigo-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
        {(['Corporate Clients', 'Open Requirements', 'Broker Relationships', 'Track Records', 'Competition Mapping'] as const).map(tab => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-bold tracking-wide whitespace-nowrap border-b-2 transition-colors ${activeRootTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            onClick={() => setActiveRootTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB RESULTS */}
      <div className="min-h-[400px]">
        {activeRootTab === 'Corporate Clients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingClients.map(client => (
              <Card key={client.id} className="p-6 border-slate-200 shadow-sm bg-white hover:border-indigo-300 transition-colors group flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{client.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1"><Briefcase className="h-3 w-3"/> {client.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-3 flex-1 mb-6 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" /> <span className="truncate">{client.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-slate-400" /> <span className="truncate">{client.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" /> <span>Last contact: {client.lastInteraction}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    client.relationshipStatus === 'Existing Client' ? 'bg-emerald-50 text-emerald-700' : 
                    client.relationshipStatus === 'Potential Client' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {client.relationshipStatus}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs">
                    View Company <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
            {matchingClients.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500 bg-white border border-dashed border-slate-200 rounded-xl">
                <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <p className="font-medium text-base">No corporate clients found for "{searchTerm}".</p>
              </div>
            )}
          </div>
        )}

        {activeRootTab === 'Open Requirements' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Requirement</th>
                  <th className="px-6 py-4 font-bold">Company</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Budget</th>
                  <th className="px-6 py-4 font-bold">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchingClients.flatMap(c => c.requirements.filter(r => r.status === 'Open').map(r => ({...r, company: c.name}))).map((req, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedClient(matchingClients.find(c => c.name === req.company) || null)}>
                    <td className="px-6 py-4 font-bold text-slate-900">{req.text}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400"/> {req.company}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{req.location}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{req.budget}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700">{req.stage}</span>
                    </td>
                  </tr>
                ))}
                {matchingClients.flatMap(c => c.requirements.filter(r => r.status === 'Open')).length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No open requirements found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeRootTab === 'Broker Relationships' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Broker Company</th>
                  <th className="px-6 py-4 font-bold">Contact Person</th>
                  <th className="px-6 py-4 font-bold">Connected Client</th>
                  <th className="px-6 py-4 font-bold">Relationship Strength</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchingClients.flatMap(c => c.brokers.map(b => ({...b, clientName: c.name}))).map((broker, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2"><Briefcase className="h-4 w-4 text-indigo-600"/> {broker.company}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{broker.person}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{broker.clientName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700">{broker.strength}</span>
                    </td>
                  </tr>
                ))}
                {matchingClients.flatMap(c => c.brokers).length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No broker relationships found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeRootTab === 'Track Records' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Deal / Requirement</th>
                  <th className="px-6 py-4 font-bold">Client</th>
                  <th className="px-6 py-4 font-bold">Sales Owner</th>
                  <th className="px-6 py-4 font-bold">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchingClients.flatMap(c => c.requirements.filter(r => r.status === 'Closed').map(r => ({...r, clientName: c.name, owner: c.accountOwner, year: c.since || '2023'}))).map((deal, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{deal.text} <span className="ml-2 text-xs font-semibold text-emerald-600">({deal.stage})</span></td>
                    <td className="px-6 py-4 font-medium text-slate-700">{deal.clientName}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2"><UserIcon className="h-4 w-4 text-slate-400"/> {deal.owner}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{deal.year}</td>
                  </tr>
                ))}
                {matchingClients.flatMap(c => c.requirements.filter(r => r.status === 'Closed')).length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No past track records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeRootTab === 'Competition Mapping' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingClients.flatMap(c => c.competition.map(comp => ({...comp, clientName: c.name}))).map((comp, i) => (
              <Card key={i} className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Competitor</p>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><Target className="h-4 w-4 text-rose-500"/> {comp.agency}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${comp.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {comp.risk} Risk
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-500">Client:</span> {comp.clientName}</p>
                  <p><span className="font-semibold text-slate-500">Offer:</span> {comp.offer}</p>
                  <p><span className="font-semibold text-slate-500">Price:</span> {comp.price}</p>
                  <p><span className="font-semibold text-slate-500">Status:</span> {comp.status}</p>
                </div>
              </Card>
            ))}
            {matchingClients.flatMap(c => c.competition).length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-dashed border-slate-200 rounded-xl">
                No competition data mapped for these clients.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
