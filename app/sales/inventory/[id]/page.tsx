"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, MapPin, ArrowLeft, HelpCircle, AlertTriangle, 
  CheckCircle2, FileText, Image as ImageIcon, Download, Check
} from "lucide-react";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { properties } = useAppStore();
  const property = properties.find(p => p.id === params.id);

  const [activeTab, setActiveTab] = useState<'Overview' | 'Availability' | 'Amenities' | 'Documents' | 'Commercial Details' | 'Activity'>('Overview');
  
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [requestForm, setRequestForm] = useState({ type: 'Missing Images', priority: 'Medium', message: '' });

  const [showRaiseFlag, setShowRaiseFlag] = useState(false);
  const [flagForm, setFlagForm] = useState({ type: 'Incorrect Availability', description: '' });

  if (!property) {
    return (
      <div className="flex-1 p-8 h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Property not found</h2>
        <Button onClick={() => router.push('/sales/inventory')} className="mt-4">Back to Inventory</Button>
      </div>
    );
  }

  const handleSubmitRequest = () => {
    alert("Information Request Submitted successfully!");
    setShowRequestInfo(false);
    setRequestForm({ type: 'Missing Images', priority: 'Medium', message: '' });
  };

  const handleSubmitFlag = () => {
    alert("Flag raised successfully! Sent to Admin verification queue.");
    setShowRaiseFlag(false);
    setFlagForm({ type: 'Incorrect Availability', description: '' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
        
        {/* BACK NAVIGATION */}
        <Button variant="ghost" onClick={() => router.push('/sales/inventory')} className="text-slate-600 hover:text-slate-900 -ml-2 font-bold px-3">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inventory
        </Button>

        {/* HEADER SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-64 bg-slate-200 relative">
            <img src={property.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-sm text-slate-900 font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full shadow-sm">
                {property.buildingType}
              </span>
              <span className="bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Approved
              </span>
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{property.name}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {property.micromarket}, {property.city}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Button variant="outline" onClick={() => setShowRaiseFlag(true)} className="flex-1 md:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold">
                <AlertTriangle className="h-4 w-4 mr-2" /> Raise Flag
              </Button>
              <Button onClick={() => setShowRequestInfo(true)} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md">
                <HelpCircle className="h-4 w-4 mr-2" /> Request Information
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-100">
            <div className="p-4 md:p-6 border-r border-b md:border-b-0 border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Area</p>
              <p className="text-xl font-bold text-slate-900">{property.totalArea.toLocaleString()} sqft</p>
            </div>
            <div className="p-4 md:p-6 border-r border-b md:border-b-0 border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Available Area</p>
              <p className="text-xl font-bold text-indigo-600">{(property.totalArea * 0.4).toLocaleString()} sqft</p>
            </div>
            <div className="p-4 md:p-6 border-r border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Occupancy</p>
              <p className="text-xl font-bold text-emerald-600">60%</p>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Last Updated</p>
              <p className="text-xl font-bold text-slate-900">12 June</p>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto hide-scrollbar pb-px">
          {(['Overview', 'Availability', 'Amenities', 'Documents', 'Commercial Details', 'Activity'] as const).map(tab => (
            <button
              key={tab}
              className={`px-5 py-3.5 text-sm font-bold tracking-wide whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-transparent">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <Card className="md:col-span-2 p-6 border-slate-200 shadow-sm bg-white space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Property Description</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Premium commercial property offering state-of-the-art infrastructure. Excellent connectivity to major transit hubs and surrounded by key business districts. Features a modern glass facade, grand reception area, and advanced security systems.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Property Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <span className="flex items-center text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100"><Check className="h-4 w-4 mr-2 text-indigo-500" /> Grade A Building</span>
                    <span className="flex items-center text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100"><Check className="h-4 w-4 mr-2 text-indigo-500" /> Metro Connected</span>
                    <span className="flex items-center text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100"><Check className="h-4 w-4 mr-2 text-indigo-500" /> 24/7 Access</span>
                    <span className="flex items-center text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100"><Check className="h-4 w-4 mr-2 text-indigo-500" /> Premium Location</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-slate-200 shadow-sm bg-white">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Key Facts</h3>
                <div className="space-y-4 text-sm">
                  <div><p className="text-slate-500 font-medium mb-1">Developer / Operator</p><p className="font-bold text-slate-900">{property.developer || 'N/A'}</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Building Grade</p><p className="font-bold text-slate-900">Grade A</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Year Built</p><p className="font-bold text-slate-900">2018</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Certifications</p><p className="font-bold text-slate-900">LEED Gold</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Address</p><p className="font-bold text-slate-900">{property.micromarket}, {property.city}</p></div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: AVAILABILITY */}
          {activeTab === 'Availability' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-indigo-900">Important Note</p>
                  <p className="text-xs text-indigo-700 mt-1">If this availability seems incorrect based on a recent site visit or client discussion, use the 'Raise Flag' button to alert the Supply Team.</p>
                </div>
              </div>

              {property.buildingType === 'Commercial' ? (
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Building2 className="h-4 w-4" /> Tower A</h3>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-white border-b border-slate-100 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4 font-bold">Floor / Unit</th>
                        <th className="px-6 py-4 font-bold">Area</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold">Expected Rent</th>
                        <th className="px-6 py-4 font-bold">Availability Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">Floor 5, Unit 501</td>
                        <td className="px-6 py-4 font-medium text-slate-700">4,500 sqft</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700">Available</span></td>
                        <td className="px-6 py-4 font-medium text-slate-700">₹140 / sqft</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">Immediate</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">Floor 8, Unit 802</td>
                        <td className="px-6 py-4 font-medium text-slate-700">6,200 sqft</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700">Available</span></td>
                        <td className="px-6 py-4 font-medium text-slate-700">₹145 / sqft</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">Oct 1, 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-6 border-slate-200 bg-white shadow-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Seats</p>
                    <p className="text-3xl font-black text-slate-900">450</p>
                  </Card>
                  <Card className="p-6 border-slate-200 bg-white shadow-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Available Seats</p>
                    <p className="text-3xl font-black text-emerald-600">120</p>
                  </Card>
                  <Card className="p-6 border-slate-200 bg-white shadow-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Private Offices (Avail)</p>
                    <p className="text-3xl font-black text-slate-900">4</p>
                  </Card>
                  <Card className="p-6 border-slate-200 bg-white shadow-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Meeting Rooms</p>
                    <p className="text-3xl font-black text-slate-900">8</p>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* TAB: AMENITIES */}
          {activeTab === 'Amenities' && (
            <Card className="p-6 border-slate-200 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Building Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Parking', 'Security 24/7', 'Cafeteria', 'Power Backup', 'Grand Reception', 'Gymnasium', 'Meeting Rooms', 'High Speed Lifts'].map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Nearby & Connectivity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Metro Station (500m)', 'Airport (15km)', '5 Star Hotels', 'Restaurants & Malls', 'Bus Stop', 'Highway Access'].map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'Documents' && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
              {['Floor Plan - Level 5', 'Building Brochure', 'Legal Title Clear', 'NOC Documents'].map((doc, i) => (
                <Card key={i} className="p-4 border-slate-200 shadow-sm bg-white hover:border-indigo-300 transition-colors group">
                  <div className="h-24 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-indigo-50/50 group-hover:text-indigo-400 transition-colors">
                    {i === 0 ? <ImageIcon className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3 truncate">{doc}</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs font-semibold">View</Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50"><Download className="h-3 w-3 mr-1" /> DL</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB: COMMERCIAL DETAILS */}
          {activeTab === 'Commercial Details' && (
            <Card className="p-6 border-slate-200 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Commercial Terms</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4 text-sm">
                  <div><p className="text-slate-500 font-medium mb-1">Expected Rent</p><p className="font-bold text-slate-900">₹140 - ₹150 / sqft</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Maintenance</p><p className="font-bold text-slate-900">₹15 / sqft</p></div>
                </div>
                <div className="space-y-4 text-sm">
                  <div><p className="text-slate-500 font-medium mb-1">Security Deposit</p><p className="font-bold text-slate-900">6 Months</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Lease Terms</p><p className="font-bold text-slate-900">3 + 3 Years</p></div>
                </div>
                <div className="space-y-4 text-sm">
                  <div><p className="text-slate-500 font-medium mb-1">Lock-in Period</p><p className="font-bold text-slate-900">3 Years</p></div>
                  <div><p className="text-slate-500 font-medium mb-1">Availability Terms</p><p className="font-bold text-slate-900">Warm Shell / Furnished</p></div>
                </div>
              </div>
            </Card>
          )}

          {/* TAB: ACTIVITY */}
          {activeTab === 'Activity' && (
            <Card className="p-6 border-slate-200 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Property Timeline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {[
                  { date: '12 June 2026', title: 'Availability Updated', desc: 'Supply updated Unit 501 to available status.', icon: <CheckCircle2 className="h-4 w-4"/>, color: 'text-emerald-500 bg-emerald-50' },
                  { date: '10 June 2026', title: 'Price Updated', desc: 'Expected rent updated from ₹135 to ₹140 per sqft.', icon: <CheckCircle2 className="h-4 w-4"/>, color: 'text-blue-500 bg-blue-50' },
                  { date: '05 June 2026', title: 'Information Requested', desc: 'Sales requested missing floor plans for Level 8.', icon: <HelpCircle className="h-4 w-4"/>, color: 'text-amber-500 bg-amber-50' },
                  { date: '01 June 2026', title: 'Inventory Added', desc: 'Property onboarded to the platform.', icon: <Building2 className="h-4 w-4"/>, color: 'text-indigo-500 bg-indigo-50' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm shadow-slate-200 bg-slate-100 text-slate-500">
                      {item.icon}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <time className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.date}</time>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* MODALS */}
        
        {/* REQUEST INFORMATION */}
        {showRequestInfo && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Request Information</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Ask the Supply team to verify details for <span className="font-bold text-slate-900">{property.name}</span>.</p>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Request Type</label>
                  <select className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white font-medium text-sm" value={requestForm.type} onChange={e => setRequestForm({...requestForm, type: e.target.value})}>
                    <option>Missing Images</option>
                    <option>Pricing Information</option>
                    <option>Availability Confirmation</option>
                    <option>Floor Plan</option>
                    <option>Document Required</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority</label>
                  <select className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white font-medium text-sm" value={requestForm.priority} onChange={e => setRequestForm({...requestForm, priority: e.target.value})}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                  <textarea 
                    className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-600 text-sm resize-none"
                    value={requestForm.message}
                    onChange={e => setRequestForm({...requestForm, message: e.target.value})}
                    placeholder="What information do you need?"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowRequestInfo(false)} className="font-semibold">Cancel</Button>
                <Button disabled={!requestForm.message} onClick={handleSubmitRequest} className="bg-primary hover:bg-primary/90 font-bold px-6">Submit Request</Button>
              </div>
            </Card>
          </div>
        )}

        {/* RAISE FLAG */}
        {showRaiseFlag && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Raise Data Flag</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 font-medium">Report incorrect information to the Supply Verification Queue.</p>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Issue Type</label>
                  <select className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white font-medium text-sm" value={flagForm.type} onChange={e => setFlagForm({...flagForm, type: e.target.value})}>
                    <option>Incorrect Availability</option>
                    <option>Wrong Pricing</option>
                    <option>Incorrect Property Details</option>
                    <option>Outdated Images</option>
                    <option>Wrong Documents</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea 
                    className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-red-600 text-sm resize-none"
                    value={flagForm.description}
                    onChange={e => setFlagForm({...flagForm, description: e.target.value})}
                    placeholder="E.g. Client visited today. Unit 501 is already occupied."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button variant="ghost" onClick={() => setShowRaiseFlag(false)} className="font-semibold text-slate-500">Cancel</Button>
                <Button disabled={!flagForm.description} onClick={handleSubmitFlag} className="bg-red-600 hover:bg-red-700 font-bold px-6">Submit Flag</Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
