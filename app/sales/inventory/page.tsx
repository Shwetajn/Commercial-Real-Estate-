"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, LayoutGrid, List, FileText, Info, HelpCircle, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Data for Requests and Suggestions
interface InfoRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  type: string;
  priority: string;
  message: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface SuggestedProperty {
  id: string;
  name: string;
  type: string;
  city: string;
  location: string;
  developer: string;
  reason: string;
  approxArea: string;
  seats: string;
  availability: string;
  contact: string;
  notes: string;
  date: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
}

export default function SalesInventoryPage() {
  const { properties } = useAppStore();
  const approvedProperties = properties.filter(p => p.lifecycleStatus === 'Approved');

  // UI State
  const [activeTab, setActiveTab] = useState<'Approved Inventory' | 'Information Requests' | 'Suggested Properties'>('Approved Inventory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / Drawers
  const router = useRouter();
  const [requestPropertyId, setRequestPropertyId] = useState<string | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Forms State
  const [requestForm, setRequestForm] = useState({ type: 'Missing Images', priority: 'Medium', message: '' });
  
  const [suggestStep, setSuggestStep] = useState(1);
  const [suggestForm, setSuggestForm] = useState({
    name: '', type: 'Commercial', city: '', location: '', developer: '', reason: '',
    approxArea: '', seats: '', availability: '', contact: '', notes: ''
  });

  // Local Data State
  const [infoRequests, setInfoRequests] = useState<InfoRequest[]>([
    { id: 'req_1', propertyId: approvedProperties[0]?.id || '', propertyName: approvedProperties[0]?.name || 'Sample Prop', type: 'Floor Plan', priority: 'High', message: 'Need floor plans for level 3', date: new Date().toISOString(), status: 'Pending' }
  ]);
  
  const [suggestedProperties, setSuggestedProperties] = useState<SuggestedProperty[]>([
    { id: 'sug_1', name: 'Maker Chambers VI', type: 'Commercial', city: 'Mumbai', location: 'Nariman Point', developer: 'Reliance', reason: 'Client specifically requested this building', approxArea: '10000', seats: '', availability: 'Immediate', contact: 'Ramesh', notes: '', date: new Date().toISOString(), status: 'Pending Review' }
  ]);

  const filteredProperties = approvedProperties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.micromarket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRequestProp = properties.find(p => p.id === requestPropertyId);

  // Handlers
  const handleSubmitRequest = () => {
    if (requestPropertyId) {
      setInfoRequests([{
        id: `req_${Date.now()}`,
        propertyId: requestPropertyId,
        propertyName: selectedRequestProp?.name || '',
        type: requestForm.type,
        priority: requestForm.priority,
        message: requestForm.message,
        date: new Date().toISOString(),
        status: 'Pending'
      }, ...infoRequests]);
      
      setRequestPropertyId(null);
      setRequestForm({ type: 'Missing Images', priority: 'Medium', message: '' });
      alert("Information request sent successfully.");
    }
  };

  const handleSubmitSuggestion = () => {
    setSuggestedProperties([{
      id: `sug_${Date.now()}`,
      ...suggestForm,
      date: new Date().toISOString(),
      status: 'Pending Review'
    } as SuggestedProperty, ...suggestedProperties]);
    
    setShowSuggestModal(false);
    setSuggestStep(1);
    setSuggestForm({ name: '', type: 'Commercial', city: '', location: '', developer: '', reason: '', approxArea: '', seats: '', availability: '', contact: '', notes: '' });
    alert("Property suggestion submitted for admin approval.");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">Explore available workspace inventory and suggest updates.</p>
          </div>
          <Button onClick={() => setShowSuggestModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" /> Suggest Property
          </Button>
        </div>

        {/* TABS */}
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
          {(['Approved Inventory', 'Information Requests', 'Suggested Properties'] as const).map(tab => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-bold tracking-wide whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- APPROVED INVENTORY TAB --- */}
        {activeTab === 'Approved Inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Search properties..." 
                  className="pl-9 bg-white border-slate-200 h-9 text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-slate-100 p-1 rounded-md shrink-0">
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded text-sm ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><List className="h-4 w-4" /></button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded text-sm ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><LayoutGrid className="h-4 w-4" /></button>
              </div>
            </div>

            {viewMode === 'table' ? (
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-bold">Property Name</th>
                        <th className="px-4 py-3 font-bold">Location</th>
                        <th className="px-4 py-3 font-bold">Type</th>
                        <th className="px-4 py-3 font-bold">Developer</th>
                        <th className="px-4 py-3 font-bold">Area</th>
                        <th className="px-4 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProperties.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 font-bold text-slate-900">{p.name}</td>
                          <td className="px-4 py-4 font-medium text-slate-700">{p.micromarket}, {p.city}</td>
                          <td className="px-4 py-4 font-medium text-slate-700">{p.buildingType}</td>
                          <td className="px-4 py-4 font-medium text-slate-700">{p.developer || 'N/A'}</td>
                          <td className="px-4 py-4 font-medium text-slate-700">{p.totalArea.toLocaleString()} sqft</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => router.push('/sales/inventory/' + p.id)} className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50">View Details</Button>
                              <Button variant="outline" size="sm" onClick={() => setRequestPropertyId(p.id)} className="h-8 text-xs font-semibold text-amber-600 border-amber-200 hover:bg-amber-50"><HelpCircle className="h-3 w-3 mr-1"/> Request Info</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProperties.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No approved properties match your search.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(p => (
                  <Card key={p.id} className="overflow-hidden border-slate-200 shadow-sm bg-white hover:border-indigo-300 transition-colors flex flex-col">
                    <div className="h-40 bg-slate-100 relative">
                      <img src={p.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-indigo-700">{p.buildingType}</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1 mb-4"><MapPin className="h-3.5 w-3.5" /> {p.micromarket}, {p.city}</p>
                      
                      <div className="space-y-1 mb-4 flex-1">
                        <p className="text-sm"><span className="text-slate-500">Developer:</span> <span className="font-medium text-slate-900">{p.developer || 'N/A'}</span></p>
                        <p className="text-sm"><span className="text-slate-500">Area:</span> <span className="font-medium text-slate-900">{p.totalArea.toLocaleString()} sqft</span></p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Button variant="outline" size="sm" onClick={() => router.push('/sales/inventory/' + p.id)} className="w-full h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50">View Details</Button>
                        <Button variant="outline" size="sm" onClick={() => setRequestPropertyId(p.id)} className="w-full h-8 text-xs font-semibold text-amber-600 border-amber-200 hover:bg-amber-50">Request Info</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- INFORMATION REQUESTS TAB --- */}
        {activeTab === 'Information Requests' && (
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Property</th>
                  <th className="px-6 py-4 font-bold">Request Type</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                  <th className="px-6 py-4 font-bold">Requested Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {infoRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2"><Building2 className="h-4 w-4 text-indigo-600"/> {req.propertyName}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{req.type} <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">{req.priority}</span></td>
                    <td className="px-6 py-4 font-medium text-slate-600 max-w-[200px] truncate">{req.message}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(req.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${req.status === 'Pending' ? 'bg-amber-50 text-amber-700' : req.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {infoRequests.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No information requests pending.</td></tr>}
              </tbody>
            </table>
          </Card>
        )}

        {/* --- SUGGESTED PROPERTIES TAB --- */}
        {activeTab === 'Suggested Properties' && (
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Suggested Property</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Reason</th>
                  <th className="px-6 py-4 font-bold">Submitted Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suggestedProperties.map(sug => (
                  <tr key={sug.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{sug.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{sug.location}, {sug.city}</td>
                    <td className="px-6 py-4 font-medium text-slate-600 max-w-[200px] truncate">{sug.reason}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(sug.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${sug.status === 'Pending Review' ? 'bg-amber-50 text-amber-700' : sug.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {sug.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {suggestedProperties.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No properties suggested yet.</td></tr>}
              </tbody>
            </table>
          </Card>
        )}



        {/* --- REQUEST INFORMATION MODAL --- */}
        {requestPropertyId && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Request Information</h3>
              <p className="text-sm text-slate-500 mb-6">Ask the Supply team to verify or update details for <span className="font-bold text-slate-900">{selectedRequestProp?.name}</span>.</p>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Request Type</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm"
                    value={requestForm.type}
                    onChange={e => setRequestForm({...requestForm, type: e.target.value})}
                  >
                    <option>Missing Images</option>
                    <option>Updated Pricing</option>
                    <option>Availability Confirmation</option>
                    <option>Floor Plan</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm"
                    value={requestForm.priority}
                    onChange={e => setRequestForm({...requestForm, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message / Clarification</label>
                  <textarea 
                    className="w-full h-24 p-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm resize-none"
                    value={requestForm.message}
                    onChange={e => setRequestForm({...requestForm, message: e.target.value})}
                    placeholder="E.g. Client is interested but we need confirmation on floor 4 availability."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setRequestPropertyId(null)}>Cancel</Button>
                <Button disabled={!requestForm.message} onClick={handleSubmitRequest} className="bg-amber-600 hover:bg-amber-700">Submit Request <Send className="h-3.5 w-3.5 ml-2"/></Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- SUGGEST PROPERTY MULTI-STEP MODAL --- */}
        {showSuggestModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-xl bg-white shadow-2xl animate-in zoom-in-95 flex flex-col overflow-hidden max-h-[90vh]">
              <div className="bg-indigo-600 p-6 text-white shrink-0">
                <h3 className="text-lg font-bold">Suggest Property</h3>
                <p className="text-indigo-200 text-sm mt-1">Submit properties missing from inventory for admin approval.</p>
                <div className="flex gap-2 mt-4">
                  <div className={`h-1.5 flex-1 rounded-full ${suggestStep >= 1 ? 'bg-white' : 'bg-indigo-400/30'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full ${suggestStep >= 2 ? 'bg-white' : 'bg-indigo-400/30'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full ${suggestStep >= 3 ? 'bg-white' : 'bg-indigo-400/30'}`}></div>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {suggestStep === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">Step 1: Basic Details</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Name</label>
                      <Input placeholder="e.g. K Raheja Corp" value={suggestForm.name} onChange={e => setSuggestForm({...suggestForm, name: e.target.value})} className="bg-slate-50 border-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Type</label>
                        <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm" value={suggestForm.type} onChange={e => setSuggestForm({...suggestForm, type: e.target.value})}>
                          <option>Commercial</option>
                          <option>Coworking</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Developer / Operator</label>
                        <Input placeholder="e.g. Raheja" value={suggestForm.developer} onChange={e => setSuggestForm({...suggestForm, developer: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">City</label>
                        <Input placeholder="e.g. Mumbai" value={suggestForm.city} onChange={e => setSuggestForm({...suggestForm, city: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Location</label>
                        <Input placeholder="e.g. BKC" value={suggestForm.location} onChange={e => setSuggestForm({...suggestForm, location: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Reason for Suggestion</label>
                      <Input placeholder="e.g. Client specifically requested this building" value={suggestForm.reason} onChange={e => setSuggestForm({...suggestForm, reason: e.target.value})} className="bg-slate-50 border-slate-200" />
                    </div>
                  </div>
                )}

                {suggestStep === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">Step 2: Available Information (Optional)</h4>
                    <p className="text-xs text-slate-500 mb-4">Enter whatever details you have. The Supply team will verify and fill the rest.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Approx Area</label>
                        <Input placeholder="sqft" value={suggestForm.approxArea} onChange={e => setSuggestForm({...suggestForm, approxArea: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Seats</label>
                        <Input placeholder="Count" value={suggestForm.seats} onChange={e => setSuggestForm({...suggestForm, seats: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Expected Availability</label>
                        <Input placeholder="e.g. Next Month" value={suggestForm.availability} onChange={e => setSuggestForm({...suggestForm, availability: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Person</label>
                        <Input placeholder="Broker/Owner name" value={suggestForm.contact} onChange={e => setSuggestForm({...suggestForm, contact: e.target.value})} className="bg-slate-50 border-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Additional Notes</label>
                      <textarea 
                        className="w-full h-20 p-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm resize-none"
                        value={suggestForm.notes}
                        onChange={e => setSuggestForm({...suggestForm, notes: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {suggestStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">Step 3: Review & Submit</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Property</p>
                        <p className="font-bold text-slate-900 text-lg">{suggestForm.name}</p>
                        <p className="text-sm font-medium text-slate-600">{suggestForm.location}, {suggestForm.city}</p>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Reason</p>
                        <p className="text-sm font-medium text-slate-700">{suggestForm.reason}</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                      <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-indigo-900">Pending Admin Approval</p>
                        <p className="text-xs text-indigo-700 mt-1">Once submitted, this will go to the Admin queue. It will only become visible in the main inventory after supply team verification.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between shrink-0">
                <Button variant="ghost" onClick={() => { setShowSuggestModal(false); setSuggestStep(1); }}>Cancel</Button>
                <div className="flex gap-2">
                  {suggestStep > 1 && <Button variant="outline" onClick={() => setSuggestStep(s => s - 1)}>Back</Button>}
                  {suggestStep < 3 && <Button disabled={suggestStep === 1 && (!suggestForm.name || !suggestForm.city)} onClick={() => setSuggestStep(s => s + 1)} className="bg-indigo-600 hover:bg-indigo-700">Next Step <ArrowRight className="h-4 w-4 ml-2"/></Button>}
                  {suggestStep === 3 && <Button onClick={handleSubmitSuggestion} className="bg-emerald-600 hover:bg-emerald-700">Submit to Admin <CheckCircle2 className="h-4 w-4 ml-2"/></Button>}
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

// Separate component for PlusIcon since it's missing from import sometimes based on lucide versions
function PlusIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}
