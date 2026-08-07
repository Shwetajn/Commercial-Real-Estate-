"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, Building2, Search, ArrowLeft, Edit, RefreshCw, Plus, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Extended Mock Data for Meetings to support the new UI
interface ExtendedMeeting {
  id: string;
  leadId: string;
  purpose: string;
  type: string;
  mode: string;
  date: string;
  time: string;
  status: string;
  location: string;
  createdBy: string;
  requirementNotes: string;
  internalNotes: string;
  propertiesDiscussed: { name: string, area: string, location: string, status: string }[];
  outcome?: string;
}

const MOCK_MEETINGS_EXTENDED: Record<string, ExtendedMeeting> = {
  mtg_1: {
    id: 'mtg_1',
    leadId: 'lead_2', // Logitech
    purpose: 'Revisit Sites',
    type: 'Follow-up Meeting',
    mode: 'Site Visit',
    date: '2026-06-20',
    time: '14:00',
    status: 'Upcoming',
    location: 'Mumbai BKC',
    createdBy: 'Rohit Verma',
    requirementNotes: 'Office space in BKC, 1 meeting room, 25-seater, flexible lease.',
    internalNotes: 'Client liked property but needs pricing clarification. JLL is also pitching them.',
    propertiesDiscussed: [
      { name: 'Godrej BKC', area: '4500 sqft', location: 'Mumbai BKC', status: 'Shortlisted' },
      { name: 'Maker Maxity', area: '4300 sqft', location: 'Mumbai BKC', status: 'Under Consideration' }
    ],
    outcome: 'Pending'
  },
  mtg_2: {
    id: 'mtg_2',
    leadId: 'lead_2',
    purpose: 'Initial Requirement Gathering',
    type: 'Initial Discussion',
    mode: 'Online',
    date: '2026-06-10',
    time: '11:00',
    status: 'Completed',
    location: 'Zoom Link',
    createdBy: 'Rohit Verma',
    requirementNotes: 'Looking for premium office space in BKC.',
    internalNotes: 'First connect. High intent client.',
    propertiesDiscussed: [],
    outcome: 'Requirements clear, scheduled site visit.'
  }
};

export default function MeetingsPage() {
  const { leads, meetings, properties, addMeeting } = useAppStore();
  
  // Landing State
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTab, setClientTab] = useState<'Individual' | 'Company'>('Individual');
  
  // View State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  // Modals
  const [showEditNotes, setShowEditNotes] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Modal Data
  const [tempNotes, setTempNotes] = useState("");
  const [newSchedule, setNewSchedule] = useState({ date: '', time: '', reason: '' });
  const [newMeetingForm, setNewMeetingForm] = useState({ purpose: '', type: 'Initial Discussion', mode: 'Online', date: '', time: '', agenda: '' });

  // Local state for extended meetings to allow edits
  const [localExtendedMeetings, setLocalExtendedMeetings] = useState(MOCK_MEETINGS_EXTENDED);

  // Filters for Landing
  const activeLeads = leads.filter(l => l.status !== 'Closed');
  const filteredLeads = activeLeads.filter(l => 
    l.type === clientTab &&
    (l.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     l.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedLead = activeLeads.find(l => l.id === selectedLeadId);
  
  // Gather meetings for the selected lead
  const leadMeetings = Object.values(localExtendedMeetings).filter(m => m.leadId === selectedLeadId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const activeMeeting = leadMeetings.find(m => m.id === selectedMeetingId) || leadMeetings[0];

  const handleSelectClient = (leadId: string) => {
    setSelectedLeadId(leadId);
    // Find if we have mocked meetings for this lead, if not, generate a basic one
    const existing = Object.values(localExtendedMeetings).filter(m => m.leadId === leadId);
    if (existing.length > 0) {
      setSelectedMeetingId(existing[0].id);
    } else {
      const newId = `mtg_${Date.now()}`;
      setLocalExtendedMeetings(prev => ({
        ...prev,
        [newId]: {
          id: newId,
          leadId,
          purpose: 'Requirement Discussion',
          type: 'Initial Discussion',
          mode: 'Online',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          status: 'Upcoming',
          location: 'Virtual',
          createdBy: 'Rohit Verma',
          requirementNotes: leads.find(l => l.id === leadId)?.lookingFor || 'Pending details.',
          internalNotes: 'Initial auto-generated log.',
          propertiesDiscussed: [],
          outcome: 'Pending'
        }
      }));
      setSelectedMeetingId(newId);
    }
  };

  const saveNotes = () => {
    if (activeMeeting) {
      setLocalExtendedMeetings(prev => ({
        ...prev,
        [activeMeeting.id]: { ...activeMeeting, internalNotes: tempNotes }
      }));
    }
    setShowEditNotes(false);
  };

  const saveReschedule = () => {
    if (activeMeeting) {
      setLocalExtendedMeetings(prev => ({
        ...prev,
        [activeMeeting.id]: { ...activeMeeting, date: newSchedule.date, time: newSchedule.time }
      }));
    }
    setShowReschedule(false);
  };

  const saveNewMeeting = () => {
    if (selectedLeadId) {
      const newId = `mtg_new_${Date.now()}`;
      setLocalExtendedMeetings(prev => ({
        ...prev,
        [newId]: {
          id: newId,
          leadId: selectedLeadId,
          purpose: newMeetingForm.purpose,
          type: newMeetingForm.type,
          mode: newMeetingForm.mode,
          date: newMeetingForm.date,
          time: newMeetingForm.time,
          status: 'Upcoming',
          location: newMeetingForm.mode === 'Online' ? 'Virtual' : 'Office/Site',
          createdBy: 'Rohit Verma',
          requirementNotes: activeMeeting?.requirementNotes || 'See previous notes.',
          internalNotes: newMeetingForm.agenda,
          propertiesDiscussed: [],
          outcome: 'Pending'
        }
      }));
      // Also update standard Zustand store
      addMeeting({
        id: newId, leadId: selectedLeadId, date: newMeetingForm.date, time: newMeetingForm.time, notes: newMeetingForm.agenda, status: 'Upcoming'
      });
      setSelectedMeetingId(newId);
      setShowSchedule(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: LANDING PAGE
  // -------------------------------------------------------------
  if (!selectedLeadId) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meetings</h1>
            <p className="text-sm text-slate-500 mt-1">Track client discussions and meeting history.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Search clients..." 
                  className="pl-10 h-10 bg-slate-50 border-slate-200 w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                <button 
                  className={`flex-1 md:w-32 py-1.5 text-sm font-semibold rounded-md transition-all ${clientTab === 'Individual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setClientTab('Individual')}
                >
                  Individual
                </button>
                <button 
                  className={`flex-1 md:w-32 py-1.5 text-sm font-semibold rounded-md transition-all ${clientTab === 'Company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setClientTab('Company')}
                >
                  Company
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredLeads.map(lead => {
                const latestMtg = Object.values(localExtendedMeetings).filter(m => m.leadId === lead.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                return (
                  <Card key={lead.id} className="p-4 border-slate-200 hover:border-indigo-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        {lead.type === 'Company' ? <Building2 className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{lead.type === 'Company' ? lead.companyName : lead.clientName}</h3>
                        {lead.type === 'Company' && lead.contactPerson && <p className="text-xs text-slate-500 mt-0.5">Contact: {lead.contactPerson}</p>}
                        <p className="text-xs text-slate-500 mt-0.5">Requirement: {lead.lookingFor || 'Workspace'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                      <div className="text-sm font-medium text-slate-600">
                        Last meeting: {latestMtg ? new Date(latestMtg.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) : 'None'}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSelectClient(lead.id)}>View Meetings</Button>
                    </div>
                  </Card>
                )
              })}
              {filteredLeads.length === 0 && (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No {clientTab.toLowerCase()}s match your search.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MEETING LOG PAGE
  // -------------------------------------------------------------
  if (activeMeeting && selectedLead) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Button variant="ghost" onClick={() => { setSelectedLeadId(null); setSelectedMeetingId(null); }} className="text-slate-600 hover:text-slate-900 -ml-2 font-bold px-3">
              <ArrowLeft className="h-4 w-4 mr-2" /> Meeting Log
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { setTempNotes(activeMeeting.internalNotes); setShowEditNotes(true); }} className="text-slate-600 border-slate-200">
                <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Notes
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setNewSchedule({date: activeMeeting.date, time: activeMeeting.time, reason: ''}); setShowReschedule(true); }} className="text-amber-600 border-amber-200 hover:bg-amber-50">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reschedule Meeting
              </Button>
              <Button size="sm" onClick={() => setShowSchedule(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Schedule Meeting
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 shrink-0">
              {selectedLead.type === 'Company' ? <Building2 className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {selectedLead.type === 'Company' ? selectedLead.companyName : selectedLead.clientName}
            </h2>
          </div>

          {/* TOP INFORMATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: MEETING DETAILS */}
            <Card className="p-5 border-slate-200 shadow-sm bg-white">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><CalendarIcon className="h-3.5 w-3.5" /> Meeting Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Purpose:</span><span className="font-semibold text-slate-900">{activeMeeting.purpose}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Type:</span><span className="font-semibold text-slate-900">{activeMeeting.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Mode:</span><span className="font-semibold text-slate-900">{activeMeeting.mode}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Date & Time:</span><span className="font-semibold text-indigo-600">{new Date(activeMeeting.date).toLocaleDateString('en-GB')} at {activeMeeting.time}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Status:</span><span className="font-bold text-slate-900">{activeMeeting.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Location:</span><span className="font-semibold text-slate-900">{activeMeeting.location}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Created By:</span><span className="font-semibold text-slate-900">{activeMeeting.createdBy}</span></div>
              </div>
            </Card>

            {/* Card 2: CLIENT REQUIREMENT UPDATED */}
            <Card className="p-5 border-slate-200 shadow-sm bg-white flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Client Requirement Updated</h3>
              <div className="bg-indigo-50/50 rounded-lg p-4 flex-1 border border-indigo-100">
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {activeMeeting.requirementNotes}
                </p>
              </div>
            </Card>

            {/* Card 3: INTERNAL NOTES */}
            <Card className="p-5 border-slate-200 shadow-sm bg-white flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Edit className="h-3.5 w-3.5" /> Internal Notes</h3>
                <button onClick={() => { setTempNotes(activeMeeting.internalNotes); setShowEditNotes(true); }} className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800">Edit</button>
              </div>
              <div className="bg-amber-50/50 rounded-lg p-4 flex-1 border border-amber-100">
                <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
                  {activeMeeting.internalNotes || "No notes added."}
                </p>
              </div>
            </Card>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* PROPERTIES DISCUSSED SECTION */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /> Properties Discussed</h3>
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3 font-bold">Property Name</th>
                      <th className="px-4 py-3 font-bold">Area</th>
                      <th className="px-4 py-3 font-bold">Location</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeMeeting.propertiesDiscussed.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{p.area}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{p.location}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700">{p.status}</span>
                        </td>
                      </tr>
                    ))}
                    {activeMeeting.propertiesDiscussed.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No properties documented for this meeting.</td></tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* MEETING HISTORY */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> Meeting History</h3>
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Purpose</th>
                      <th className="px-4 py-3 font-bold">Outcome</th>
                      <th className="px-4 py-3 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leadMeetings.map(mtg => (
                      <tr key={mtg.id} className={`hover:bg-indigo-50/50 cursor-pointer transition-colors ${mtg.id === activeMeeting.id ? 'bg-indigo-50/30 border-l-2 border-l-indigo-600' : ''}`} onClick={() => setSelectedMeetingId(mtg.id)}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{new Date(mtg.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{mtg.purpose}</td>
                        <td className="px-4 py-3 font-medium text-slate-600 truncate max-w-[150px]">{mtg.outcome}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${mtg.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{mtg.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

          </div>
        </div>

        {/* MODALS */}
        
        {/* EDIT NOTES MODAL */}
        {showEditNotes && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Internal Notes</h3>
              <textarea 
                value={tempNotes}
                onChange={e => setTempNotes(e.target.value)}
                className="w-full h-32 p-3 rounded-md bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right mt-1">{tempNotes.length} chars</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setShowEditNotes(false)}>Cancel</Button>
                <Button onClick={saveNotes} className="bg-indigo-600 hover:bg-indigo-700">Save Notes</Button>
              </div>
            </Card>
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        {showReschedule && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Reschedule Meeting</h3>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Date</label>
                    <Input type="date" value={newSchedule.date} onChange={e => setNewSchedule({...newSchedule, date: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Time</label>
                    <Input type="time" value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Reason</label>
                  <Input placeholder="Client requested change..." value={newSchedule.reason} onChange={e => setNewSchedule({...newSchedule, reason: e.target.value})} className="bg-slate-50 border-slate-200" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowReschedule(false)}>Cancel</Button>
                <Button onClick={saveReschedule} className="bg-amber-600 hover:bg-amber-700">Update Log</Button>
              </div>
            </Card>
          </div>
        )}

        {/* SCHEDULE NEW MEETING MODAL */}
        {showSchedule && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Schedule New Meeting</h3>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Purpose</label>
                  <Input placeholder="e.g. Discuss shortlists" value={newMeetingForm.purpose} onChange={e => setNewMeetingForm({...newMeetingForm, purpose: e.target.value})} className="bg-slate-50 border-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Meeting Type</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm"
                      value={newMeetingForm.type}
                      onChange={e => setNewMeetingForm({...newMeetingForm, type: e.target.value})}
                    >
                      <option>Initial Discussion</option>
                      <option>Follow-up</option>
                      <option>Site Visit</option>
                      <option>Negotiation</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Mode</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm"
                      value={newMeetingForm.mode}
                      onChange={e => setNewMeetingForm({...newMeetingForm, mode: e.target.value})}
                    >
                      <option>Online</option>
                      <option>Office Visit</option>
                      <option>Site Visit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date</label>
                    <Input type="date" value={newMeetingForm.date} onChange={e => setNewMeetingForm({...newMeetingForm, date: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Time</label>
                    <Input type="time" value={newMeetingForm.time} onChange={e => setNewMeetingForm({...newMeetingForm, time: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Agenda / Notes</label>
                  <textarea 
                    value={newMeetingForm.agenda} 
                    onChange={e => setNewMeetingForm({...newMeetingForm, agenda: e.target.value})} 
                    className="w-full h-20 p-3 rounded-md bg-slate-50 border border-slate-200 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button variant="ghost" onClick={() => setShowSchedule(false)}>Cancel</Button>
                <Button disabled={!newMeetingForm.date || !newMeetingForm.time || !newMeetingForm.purpose} onClick={saveNewMeeting} className="bg-indigo-600 hover:bg-indigo-700">
                  Save Meeting
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    );
  }

  return null;
}
