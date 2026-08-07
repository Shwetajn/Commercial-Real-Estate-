"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, ArrowLeft, MoreHorizontal, Mail, Phone, Calendar, User as UserIcon, LayoutTemplate, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { leads, properties, meetings, updateLeadStatus, updateSuggestedPropertyStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Basic Info' | 'Requirements' | 'Suggested Properties' | 'Communication' | 'Emails' | 'Activity'>('Basic Info');

  const lead = leads.find(l => l.id === params.id);
  
  if (!lead) {
    return <div className="p-8 text-center text-slate-500 animate-in fade-in">Lead not found.</div>;
  }

  const leadMeetings = meetings.filter(m => m.leadId === lead.id);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New Requirement': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'Property Suggested': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      case 'Proposal Sent': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Negotiation': return 'bg-pink-50 text-pink-700 ring-pink-600/20';
      case 'Closed': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/sales/leads')} className="text-slate-500 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {lead.type === 'Company' ? lead.companyName : lead.clientName}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {lead.region}, {lead.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-white" onClick={() => router.push(`/sales/deck-generation?lead=${lead.id}`)}>
            <LayoutTemplate className="h-4 w-4 mr-2 text-indigo-600" /> Generate Deck
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white">
                Update Status <MoreHorizontal className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'New Requirement')}>New Requirement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Property Suggested')}>Property Suggested</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Proposal Sent')}>Proposal Sent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Negotiation')}>Negotiation</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Closed')}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-1 overflow-x-auto pb-2 border-b border-slate-200">
        {['Basic Info', 'Requirements', 'Suggested Properties', 'Communication', 'Emails', 'Activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-6">
        
        {/* BASIC INFO */}
        {activeTab === 'Basic Info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <UserIcon className="h-4 w-4 text-indigo-600" /> Client Profile
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Type</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.type}</div>
                </div>
                {lead.type === 'Company' ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Contact Person</div>
                      <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.contactPerson}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Designation</div>
                      <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.designation}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="col-span-1 text-sm font-medium text-slate-500">Industry</div>
                      <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.industry}</div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                    <div className="col-span-1 text-sm font-medium text-slate-500">Client Name</div>
                    <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.clientName}</div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Email</div>
                  <div className="col-span-2 text-sm font-semibold text-indigo-600">{lead.email}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Phone</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.phone}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Building2 className="h-4 w-4 text-indigo-600" /> Internal Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Lead Source</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.source}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Priority</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${lead.priority === 'High' ? 'bg-red-50 text-red-700' : lead.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                      {lead.priority}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Assigned To</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">{lead.assignedExecutive}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm font-medium text-slate-500">Created At</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* REQUIREMENTS */}
        {activeTab === 'Requirements' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Primary Requirement</h3>
                  <p className="text-sm text-slate-500">{lead.lookingFor} in {lead.micromarket}</p>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Space Needed</p>
                  {lead.lookingFor === 'Commercial Office' ? (
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-slate-500">Area:</span> <span className="font-semibold text-slate-900">{lead.requiredArea} sq ft</span></p>
                      <p className="text-sm"><span className="text-slate-500">Seats:</span> <span className="font-semibold text-slate-900">{lead.expectedSeats}</span></p>
                      <p className="text-sm"><span className="text-slate-500">Lease:</span> <span className="font-semibold text-slate-900">{lead.leaseDuration} Years</span></p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-slate-500">Seats:</span> <span className="font-semibold text-slate-900">{lead.coworkingSeats}</span></p>
                      <p className="text-sm"><span className="text-slate-500">Cabins:</span> <span className="font-semibold text-slate-900">{lead.cabinRequirement}</span></p>
                      <p className="text-sm"><span className="text-slate-500">Meeting Rms:</span> <span className="font-semibold text-slate-900">{lead.meetingRoomNeed}</span></p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Financials & Timeline</p>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-slate-500">Budget:</span> <span className="font-semibold text-slate-900">{lead.budgetRange}</span></p>
                    <p className="text-sm"><span className="text-slate-500">Move-in:</span> <span className="font-semibold text-slate-900">{new Date(lead.expectedMoveIn).toLocaleDateString()}</span></p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Additional Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{lead.additionalReqs || 'None'}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SUGGESTED PROPERTIES */}
        {activeTab === 'Suggested Properties' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            {lead.suggestedProperties.length === 0 ? (
              <Card className="py-12 text-center bg-slate-50 border-dashed border-2 border-slate-200">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Properties Suggested</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">You haven't attached any inventory to this lead yet.</p>
                <Button onClick={() => router.push('/sales/inventory')} className="bg-indigo-600 hover:bg-indigo-700">Browse Inventory</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lead.suggestedProperties.map(sp => {
                  const prop = properties.find(p => p.id === sp.propertyId);
                  if (!prop) return null;
                  return (
                    <Card key={sp.propertyId} className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col group">
                      <div className="h-40 bg-slate-100 relative">
                        <img src={prop.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} alt="Property" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-700 flex items-center shadow-sm">
                          {sp.matchPercentage}% Match
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{prop.name}</h4>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                            sp.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' :
                            sp.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            sp.status === 'Interested' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {sp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{prop.micromarket}, {prop.city}</p>
                        
                        <div className="mt-auto grid grid-cols-2 gap-2 mb-4">
                          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => updateSuggestedPropertyStatus(lead.id, prop.id, 'Interested')}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-amber-600" /> Interested
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => updateSuggestedPropertyStatus(lead.id, prop.id, 'Rejected')}>
                            <XCircle className="h-3.5 w-3.5 mr-1 text-red-600" /> Rejected
                          </Button>
                        </div>
                        <Button variant="default" size="sm" className="w-full bg-slate-900 hover:bg-slate-800" onClick={() => router.push(`/supply/inventory/${prop.id}`)}>
                          View Property Details
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* COMMUNICATION & EMAILS placeholders to save space but maintain structure */}
        {(activeTab === 'Communication' || activeTab === 'Emails' || activeTab === 'Activity') && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
             <Card className="py-20 text-center bg-slate-50 border-dashed border-2 border-slate-200">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Module Connect</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">To log {activeTab.toLowerCase()}, please use the global module.</p>
                <Button onClick={() => router.push(activeTab === 'Emails' ? '/sales/mail' : '/sales/meetings')} className="bg-indigo-600 hover:bg-indigo-700">Go to Module</Button>
             </Card>
          </div>
        )}

      </div>
    </div>
  );
}
