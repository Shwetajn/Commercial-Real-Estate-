"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Building2, User as UserIcon, CheckCircle2, Search } from "lucide-react";
import { Lead } from "@/types";

export default function AddLeadPage() {
  const router = useRouter();
  const { addLead, properties, currentUser } = useAppStore();
  const [step, setStep] = useState(1);

  // Form State
  const [leadType, setLeadType] = useState<'Individual' | 'Company'>('Company');
  const [identity, setIdentity] = useState({
    clientName: '', phone: '', email: '', region: '', city: '',
    companyName: '', contactPerson: '', designation: '', industry: '', employeeCount: ''
  });
  
  const [lookingFor, setLookingFor] = useState<'Commercial Office' | 'Coworking Space'>('Commercial Office');
  const [req, setReq] = useState({
    micromarket: '', requiredArea: '', expectedSeats: '', leaseDuration: '',
    coworkingSeats: '', cabinRequirement: '', meetingRoomNeed: '',
    budgetRange: '', expectedMoveIn: '', additionalReqs: ''
  });

  const [suggestedProps, setSuggestedProps] = useState<string[]>([]);
  
  const [internal, setInternal] = useState({
    source: 'Website', priority: 'Medium', notes: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const newLead: Lead = {
      id: `ld_${Date.now()}`,
      type: leadType,
      ...identity,
      employeeCount: parseInt(identity.employeeCount) || undefined,
      lookingFor,
      ...req,
      requiredArea: parseInt(req.requiredArea) || undefined,
      expectedSeats: parseInt(req.expectedSeats) || undefined,
      leaseDuration: parseInt(req.leaseDuration) || undefined,
      coworkingSeats: parseInt(req.coworkingSeats) || undefined,
      cabinRequirement: parseInt(req.cabinRequirement) || undefined,
      meetingRoomNeed: parseInt(req.meetingRoomNeed) || undefined,
      source: internal.source as any,
      priority: internal.priority as any,
      assignedExecutive: currentUser.id,
      status: suggestedProps.length > 0 ? 'Property Suggested' : 'New Requirement',
      suggestedProperties: suggestedProps.map(id => ({ propertyId: id, matchPercentage: 90, status: 'Suggested' })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addLead(newLead);
    router.push('/sales/leads');
  };

  // Step 3 Filtering Logic
  const approvedProps = properties.filter(p => p.lifecycleStatus === 'Approved');
  const filteredProps = approvedProps.filter(p => {
    if (lookingFor === 'Commercial Office' && p.buildingType === 'Coworking') return false;
    if (lookingFor === 'Coworking Space' && p.buildingType !== 'Coworking') return false;
    if (identity.city && p.city.toLowerCase() !== identity.city.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push('/sales/leads')} className="text-slate-500">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Add New Lead</h1>
          <p className="text-sm text-slate-500">Step {step} of 4: {['Lead Identity', 'Requirement', 'Suggest Property', 'Internal Status'][step-1]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
              step >= s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-16 sm:w-32 h-1 mx-2 rounded-full transition-colors ${
                step > s ? 'bg-indigo-600' : 'bg-slate-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <Card className="bg-white border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <button 
                onClick={() => setLeadType('Company')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                  leadType === 'Company' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <Building2 className="h-6 w-6" />
                <span className="font-bold text-sm">Company</span>
              </button>
              <button 
                onClick={() => setLeadType('Individual')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                  leadType === 'Individual' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="h-6 w-6" />
                <span className="font-bold text-sm">Individual</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {leadType === 'Company' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Name</label>
                    <Input value={identity.companyName} onChange={e => setIdentity({...identity, companyName: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Industry</label>
                    <Input value={identity.industry} onChange={e => setIdentity({...identity, industry: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. IT Services" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Person</label>
                    <Input value={identity.contactPerson} onChange={e => setIdentity({...identity, contactPerson: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Designation</label>
                    <Input value={identity.designation} onChange={e => setIdentity({...identity, designation: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. CEO" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Employee Count</label>
                    <Input type="number" value={identity.employeeCount} onChange={e => setIdentity({...identity, employeeCount: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 50" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Client Name</label>
                    <Input value={identity.clientName} onChange={e => setIdentity({...identity, clientName: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. John Doe" />
                  </div>
                </>
              )}
              
              {/* Shared fields */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                <Input value={identity.phone} onChange={e => setIdentity({...identity, phone: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <Input type="email" value={identity.email} onChange={e => setIdentity({...identity, email: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="client@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Region</label>
                <Input value={identity.region} onChange={e => setIdentity({...identity, region: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. North India" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">City</label>
                <Input value={identity.city} onChange={e => setIdentity({...identity, city: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. Gurugram" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REQUIREMENT */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <button 
                onClick={() => setLookingFor('Commercial Office')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                  lookingFor === 'Commercial Office' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <Building2 className="h-6 w-6" />
                <span className="font-bold text-sm text-center">Commercial Office</span>
              </button>
              <button 
                onClick={() => setLookingFor('Coworking Space')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                  lookingFor === 'Coworking Space' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="h-6 w-6" />
                <span className="font-bold text-sm text-center">Coworking Space</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Micromarket</label>
                <Input value={req.micromarket} onChange={e => setReq({...req, micromarket: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. Cyber City" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Expected Move-in Date</label>
                <Input type="date" value={req.expectedMoveIn} onChange={e => setReq({...req, expectedMoveIn: e.target.value})} className="h-11 bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Budget Range</label>
                <Input value={req.budgetRange} onChange={e => setReq({...req, budgetRange: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. ₹5L - ₹8L/month" />
              </div>
              
              {lookingFor === 'Commercial Office' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Required Area (sq ft)</label>
                    <Input type="number" value={req.requiredArea} onChange={e => setReq({...req, requiredArea: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 5000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Expected Seats</label>
                    <Input type="number" value={req.expectedSeats} onChange={e => setReq({...req, expectedSeats: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Lease Duration (Years)</label>
                    <Input type="number" value={req.leaseDuration} onChange={e => setReq({...req, leaseDuration: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 3" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Coworking Seats Required</label>
                    <Input type="number" value={req.coworkingSeats} onChange={e => setReq({...req, coworkingSeats: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Cabin Requirement</label>
                    <Input type="number" value={req.cabinRequirement} onChange={e => setReq({...req, cabinRequirement: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Meeting Room Need</label>
                    <Input type="number" value={req.meetingRoomNeed} onChange={e => setReq({...req, meetingRoomNeed: e.target.value})} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. 1" />
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Additional Requirements</label>
              <textarea 
                value={req.additionalReqs} 
                onChange={e => setReq({...req, additionalReqs: e.target.value})} 
                className="w-full h-24 p-3 rounded-md bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-colors" 
                placeholder="e.g. Fully furnished, near metro station..."
              />
            </div>
          </div>
        )}

        {/* STEP 3: PROPERTY SUGGESTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">Matching Approved Inventory</p>
                <p className="text-xs text-slate-500">Filtering by {lookingFor} in {identity.city || 'all cities'}</p>
              </div>
              <div className="relative w-64 mt-3 sm:mt-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search property name..." className="pl-9 h-9 bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredProps.length > 0 ? (
                filteredProps.map(prop => (
                  <Card key={prop.id} className={`p-4 border-2 transition-all cursor-pointer ${suggestedProps.includes(prop.id) ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300'}`} onClick={() => {
                    setSuggestedProps(prev => prev.includes(prop.id) ? prev.filter(id => id !== prop.id) : [...prev, prop.id]);
                  }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{prop.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{prop.micromarket}, {prop.city}</p>
                        <p className="text-xs font-medium text-slate-700 mt-2">{prop.buildingType}</p>
                      </div>
                      <div className={`h-5 w-5 rounded border flex items-center justify-center ${suggestedProps.includes(prop.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                        {suggestedProps.includes(prop.id) && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                  No matching approved inventory found. You can skip this step and add properties later.
                </div>
              )}
            </div>
            {suggestedProps.length > 0 && (
              <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg inline-block">
                {suggestedProps.length} propert{suggestedProps.length > 1 ? 'ies' : 'y'} selected to suggest.
              </p>
            )}
          </div>
        )}

        {/* STEP 4: INTERNAL STATUS */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Lead Source</label>
                <select value={internal.source} onChange={e => setInternal({...internal, source: e.target.value})} className="w-full h-11 px-3 rounded-md bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm">
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Existing Client">Existing Client</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority</label>
                <select value={internal.priority} onChange={e => setInternal({...internal, priority: e.target.value})} className="w-full h-11 px-3 rounded-md bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Assigned Executive</label>
                <Input value={currentUser.name} disabled className="h-11 bg-slate-100 border-slate-200 text-slate-500 font-medium" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Internal Notes</label>
                <textarea 
                  value={internal.notes} 
                  onChange={e => setInternal({...internal, notes: e.target.value})} 
                  className="w-full h-24 p-3 rounded-md bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-colors text-sm" 
                  placeholder="Any private notes regarding this lead..."
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mt-6 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Ready to submit</p>
                <p className="text-xs text-amber-700 mt-1">This lead will be created and added to your active pipeline.</p>
              </div>
            </div>
          </div>
        )}

      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={step === 1 ? () => router.push('/sales/leads') : handlePrev} className="px-6 h-11">
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={step === 4 ? handleSubmit : handleNext} className="bg-primary hover:bg-primary/90 px-8 h-11 font-bold">
          {step === 4 ? 'Submit Lead' : 'Next Step'} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
