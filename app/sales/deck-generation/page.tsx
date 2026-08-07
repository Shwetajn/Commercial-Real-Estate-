"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutTemplate, FileDown, Mail, ArrowRight, Building2, MapPin, Search, Check, Trash2, CheckCircle2, User as UserIcon, Send, Clock, Copy, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock interface for generated decks
interface GeneratedDeck {
  id: string;
  prompt: string;
  selectedProperties: string[];
  clientId: string;
  createdDate: string;
  status: 'Draft' | 'Sent';
  name: string;
}

function DeckGenContent() {
  const router = useRouter();
  const { leads, properties, addMail, currentUser } = useAppStore();
  
  // App States: 'landing' | 'results' | 'preview'
  const [appState, setAppState] = useState<'landing' | 'results' | 'preview'>('landing');
  
  // Data State
  const [promptText, setPromptText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProps, setSelectedProps] = useState<string[]>([]);
  const [recentDecks, setRecentDecks] = useState<GeneratedDeck[]>([
    {
      id: 'deck_1',
      prompt: 'Office for 50 people in BKC',
      selectedProperties: ['prop_1'],
      clientId: 'lead_2',
      createdDate: new Date().toISOString(),
      status: 'Sent',
      name: 'BKC Office Proposal'
    }
  ]);
  
  // UI State
  const [generating, setGenerating] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [viewingPropertyId, setViewingPropertyId] = useState<string | null>(null);
  
  // Modal state
  const [leadType, setLeadType] = useState<'Individual' | 'Company'>('Individual');
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const approvedProps = properties.filter(p => p.lifecycleStatus === 'Approved');
  const filteredProps = approvedProps.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.micromarket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.amenities && p.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const toggleProperty = (id: string) => {
    setSelectedProps(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handlePromptSubmit = () => {
    if (!promptText.trim()) return;
    setAppState('results');
  };

  const handleChipClick = (text: string) => {
    setPromptText(prev => prev ? `${prev}, ${text}` : text);
  };

  const handleGeneratePreview = () => {
    if (selectedProps.length === 0) {
      alert("Select at least one property");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setAppState('preview');
    }, 1500);
  };

  const handleSendDeck = () => {
    if (!selectedLeadId) return;
    
    // Add to Mail
    addMail({
      id: `mail_${Date.now()}`,
      leadId: selectedLeadId,
      subject: `Property Proposal Deck`,
      date: new Date().toISOString(),
      status: 'Sent',
      tag: 'Proposal',
      message: 'Please find attached the customized property deck tailored to your requirements.',
      attachment: 'proposal_deck.pdf'
    });

    // Add to Recent Decks
    const client = leads.find(l => l.id === selectedLeadId);
    setRecentDecks(prev => [{
      id: `deck_${Date.now()}`,
      prompt: promptText,
      selectedProperties: [...selectedProps],
      clientId: selectedLeadId,
      createdDate: new Date().toISOString(),
      status: 'Sent',
      name: `${client?.type === 'Company' ? client.companyName : client?.clientName} Proposal`
    }, ...prev]);

    setSuccessModalOpen(false);
    alert('Deck sent successfully');
    
    // Reset to Landing
    setPromptText("");
    setSelectedProps([]);
    setAppState('landing');
  };

  // ----------------------------------------------------------------------
  // LANDING STATE
  // ----------------------------------------------------------------------
  if (appState === 'landing') {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          
          <div className="text-center pt-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Deck Generation</h1>
            <p className="text-slate-500">Generate AI-powered property proposals from client requirements.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Hey {currentUser?.name || 'Rohit Verma'},<br/><span className="text-slate-400">What can I help you find?</span></h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Budget</p>
                <div className="flex flex-wrap gap-2">
                  <span onClick={() => handleChipClick('Under ₹50K/month')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Under ₹50K/month</span>
                  <span onClick={() => handleChipClick('₹1L-₹2L/month')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">₹1L-₹2L/month</span>
                  <span onClick={() => handleChipClick('Above ₹5L/month')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Above ₹5L/month</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Region</p>
                <div className="flex flex-wrap gap-2">
                  <span onClick={() => handleChipClick('Gurgaon - DLF')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Gurgaon - DLF</span>
                  <span onClick={() => handleChipClick('Mumbai BKC')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Mumbai BKC</span>
                  <span onClick={() => handleChipClick('Bangalore Koramangala')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Bangalore Koramangala</span>
                  <span onClick={() => handleChipClick('Noida Sector 62')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Noida Sector 62</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  <span onClick={() => handleChipClick('Furnished Office')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Furnished Office</span>
                  <span onClick={() => handleChipClick('Coworking Space')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Coworking Space</span>
                  <span onClick={() => handleChipClick('Meeting Rooms')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Meeting Rooms</span>
                  <span onClick={() => handleChipClick('Parking')} className="cursor-pointer bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100">Parking</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <textarea 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe your ideal commercial property — e.g. ₹2L budget in Gurgaon with parking"
                className="w-full h-32 p-4 pr-16 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-base font-medium text-slate-800 resize-none shadow-inner"
              />
              <Button 
                onClick={handlePromptSubmit}
                disabled={!promptText.trim()}
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 p-0 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* RECENT DECKS */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Clock className="h-5 w-5 text-slate-400" /> Recent Generated Decks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentDecks.map(deck => {
                const client = leads.find(l => l.id === deck.clientId);
                return (
                  <Card key={deck.id} className="p-5 border-slate-200 hover:border-indigo-300 transition-colors bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{deck.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${deck.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {deck.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-4 space-y-1 flex-1">
                      <p><span className="text-slate-400">Client:</span> {client?.type === 'Company' ? client.companyName : client?.clientName}</p>
                      <p><span className="text-slate-400">Properties:</span> {deck.selectedProperties.length} included</p>
                      <p><span className="text-slate-400">Created:</span> {new Date(deck.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <Button variant="outline" size="sm" className="flex-1 text-xs"><LayoutTemplate className="h-3 w-3 mr-2"/> View Deck</Button>
                      <Button variant="outline" size="sm" className="text-xs px-2"><Copy className="h-3 w-3"/></Button>
                      <Button variant="outline" size="sm" className="text-xs px-2"><RefreshCw className="h-3 w-3"/></Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // PREVIEW STATE
  // ----------------------------------------------------------------------
  if (appState === 'preview') {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Workspace Proposal Preview</h1>
              <p className="text-sm text-slate-500 mt-1">Review the deck before sending to the client.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAppState('results')}>
                Back to Editor
              </Button>
              <Button onClick={() => setSuccessModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Mail className="h-4 w-4 mr-2" /> Dispatch Deck
              </Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden aspect-[16/9] flex flex-col">
            <div className="flex-1 bg-indigo-900 p-12 text-white flex flex-col justify-center relative">
              <div className="absolute top-8 right-8 w-32 h-32 opacity-10">
                <Building2 className="w-full h-full" />
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-6">Workspace Proposal</h2>
              <div className="bg-white/10 p-6 rounded-xl border border-white/20 inline-block max-w-2xl mb-12">
                <p className="text-xs font-bold tracking-widest uppercase text-indigo-300 mb-2">Requirement Summary</p>
                <p className="text-lg text-white font-medium">{promptText}</p>
              </div>
              
              <div className="mt-auto grid grid-cols-3 gap-6">
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-300">Selected Properties</p>
                  <p className="text-2xl font-bold mt-1">{selectedProps.length}</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-300">Comparison</p>
                  <p className="text-2xl font-bold mt-1">Included</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-300">Availability</p>
                  <p className="text-2xl font-bold mt-1">Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* DISPATCH SUCCESS MODAL */}
          {successModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <Card className="w-full max-w-md bg-white p-0 shadow-2xl animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 text-center border-b border-slate-100">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Send Proposal</h3>
                  <p className="text-sm text-slate-500 mt-2">Select the recipient for this generated deck.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Recipient Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="leadType" checked={leadType === 'Individual'} onChange={() => setLeadType('Individual')} className="text-indigo-600 focus:ring-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">Individual Lead</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="leadType" checked={leadType === 'Company'} onChange={() => setLeadType('Company')} className="text-indigo-600 focus:ring-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">Company Lead</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Select {leadType === 'Company' ? 'Company Lead' : 'Lead'}
                    </label>
                    <select 
                      className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium"
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {leads.filter(l => l.status !== 'Closed' && (leadType === 'Company' ? l.type === 'Company' : l.type === 'Individual')).map(l => (
                        <option key={l.id} value={l.id}>
                          {l.type === 'Company' ? l.companyName : l.clientName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLeadId && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
                      <p className="text-xs font-bold text-slate-400 mb-1">Email</p>
                      <p className="text-sm font-medium text-slate-800">{leads.find(l => l.id === selectedLeadId)?.email}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setSuccessModalOpen(false)}>Cancel</Button>
                    <Button disabled={!selectedLeadId} onClick={handleSendDeck} className="bg-indigo-600 hover:bg-indigo-700">
                      Send Deck <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RESULTS / RECOMMENDATION WORKSPACE STATE
  // ----------------------------------------------------------------------
  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* CENTER WORKSPACE */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          <Card className="p-5 border-slate-200 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-3">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Client Requirement Summary Card</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setAppState('landing')} className="h-8 text-xs">Edit</Button>
                <Button variant="secondary" size="sm" onClick={() => setAppState('landing')} className="h-8 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Regenerate</Button>
              </div>
            </div>
            <p className="text-slate-800 font-medium bg-slate-50 p-4 rounded-lg border border-slate-100">{promptText}</p>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">AI Recommended Properties</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Search inventory..." 
                  className="pl-9 h-9 bg-white border-slate-200 text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredProps.map(prop => {
                const isSelected = selectedProps.includes(prop.id);
                // Mock match percentage based on string length to give a varied number
                const matchPct = Math.min(98, 75 + (prop.name.length % 20));
                
                return (
                  <Card key={prop.id} className={`p-4 border shadow-sm transition-all flex gap-4 ${isSelected ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/10' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                    <div className="flex items-start pt-1">
                      <div 
                        onClick={() => toggleProperty(prop.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                    
                    <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img src={prop.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} alt={prop.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 truncate">{prop.name}</h3>
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">{matchPct}% Match</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewingPropertyId(prop.id)} className="h-8 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">View Details</Button>
                          <Button variant={isSelected ? "default" : "outline"} size="sm" onClick={() => toggleProperty(prop.id)} className={`h-8 text-xs font-semibold ${isSelected ? 'bg-indigo-600 text-white' : ''}`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> {prop.micromarket}, {prop.city} <span className="mx-2">•</span> {prop.buildingType}</p>
                      
                      <div className="flex gap-2 flex-wrap mt-2">
                        {prop.amenities?.slice(0, 4).map((amenity, idx) => (
                          <span key={idx} className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  </Card>
                )
              })}
              
              {filteredProps.length === 0 && (
                <div className="p-8 text-center text-slate-500 bg-white border border-dashed border-slate-200 rounded-xl">
                  No properties found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - SELECTED PROPERTIES */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-bold text-slate-900 flex justify-between items-center">
            Selected Properties
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{selectedProps.length}</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedProps.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No properties selected</p>
            </div>
          ) : (
            selectedProps.map(id => {
              const p = properties.find(prop => prop.id === id);
              if (!p) return null;
              return (
                <div key={id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex justify-between items-start group">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{p.name}</h4>
                  </div>
                  <button onClick={() => toggleProperty(id)} className="text-slate-400 hover:text-red-500 transition-colors p-1 shrink-0 text-xs font-semibold">
                    Remove
                  </button>
                </div>
              )
            })
          )}
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
           <Button 
            onClick={handleGeneratePreview} 
            disabled={generating || selectedProps.length === 0} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11"
          >
            {generating ? 'Generating...' : 'Generate Deck'}
          </Button>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewingPropertyId && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-end p-4 sm:p-0 animate-in fade-in">
          <div className="bg-white h-full w-full sm:w-[450px] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {(() => {
              const p = properties.find(prop => prop.id === viewingPropertyId);
              if (!p) return null;
              return (
                <>
                  <div className="relative h-64 shrink-0 bg-slate-100">
                    <img src={p.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" />
                    <button onClick={() => setViewingPropertyId(null)} className="absolute top-4 right-4 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                      &times;
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{p.name}</h2>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {p.micromarket}, {p.city}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Inventory details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 text-xs block">Building Type</span><span className="font-semibold">{p.buildingType}</span></div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 text-xs block">Total Area</span><span className="font-semibold">{p.totalArea.toLocaleString()} sq ft</span></div>
                        {p.buildingType === 'Commercial Office' ? (
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 text-xs block">Towers</span><span className="font-semibold">{p.towers.length}</span></div>
                        ) : (
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 text-xs block">Seats</span><span className="font-semibold">{p.totalArea}</span></div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {p.amenities?.map((a, i) => (
                          <span key={i} className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Availability</h4>
                      <p className="text-sm text-slate-600">Property is currently available and approved for client proposals.</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <Button onClick={() => {
                        if (!selectedProps.includes(p.id)) toggleProperty(p.id);
                        setViewingPropertyId(null);
                      }} className="w-full bg-indigo-600 hover:bg-indigo-700">
                      {selectedProps.includes(p.id) ? 'Close' : 'Select Property'}
                    </Button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeckGenerationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading module...</div>}>
      <DeckGenContent />
    </Suspense>
  );
}
