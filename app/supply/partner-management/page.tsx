"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Plus, Building2, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Partner, PartnerType } from "@/types";
import { useRouter } from "next/navigation";

export default function PartnerManagementPage() {
  const router = useRouter();
  const { partners, addProperty, currentUser, properties, addPartner } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add Partner Form State
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    type: 'Developer',
    status: 'Active',
    name: '',
    website: '',
    city: '',
    contactPerson: '',
    phone: '',
    email: '',
    relationshipManager: currentUser?.name || '',
    notes: ''
  });

  const filteredPartners = partners.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== "All" && p.type !== filterType) return false;
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    return true;
  });

  const handleSavePartner = () => {
    if (!newPartner.name || !newPartner.contactPerson) return;
    
    const partnerToAdd: Partner = {
      id: `pt_${Date.now()}`,
      name: newPartner.name,
      type: newPartner.type as PartnerType,
      status: 'Active',
      website: newPartner.website,
      city: newPartner.city || '',
      contactPerson: newPartner.contactPerson,
      phone: newPartner.phone || '',
      email: newPartner.email || '',
      relationshipManager: newPartner.relationshipManager || '',
      since: new Date().getFullYear().toString(),
      notes: newPartner.notes,
      activityHistory: [{ date: new Date().toISOString(), action: 'Partner Added' }]
    };
    
    addPartner(partnerToAdd);
    setShowAddModal(false);
    // Reset form
    setNewPartner({
      type: 'Developer',
      status: 'Active',
      name: '', website: '', city: '', contactPerson: '', phone: '', email: '', relationshipManager: currentUser?.name || '', notes: ''
    });
  };

  const getPartnerMetrics = (partnerName: string) => {
    const partnerProperties = properties.filter(p => p.developer === partnerName || p.operatorName === partnerName);
    const count = partnerProperties.length;
    let totalArea = 0;
    
    partnerProperties.forEach(p => {
      if (p.buildingType === 'Corporate Office' && p.towers) {
        p.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
          if (u.status === 'Available') totalArea += u.area;
        })));
      } else if (p.buildingType === 'Coworking' && p.coworkingInventory) {
        totalArea += p.coworkingInventory.seats.availableSeats * 50; // estimate 50 sqft per seat
      }
    });

    return { count, totalArea };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Partner Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage developers, operators and broker relationships.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Partner
          </Button>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or contact..."
              className="pl-9 bg-slate-50 border-slate-200 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Developer">Developer</option>
              <option value="Coworking Operator">Coworking Operator</option>
              <option value="Broker">Broker</option>
              <option value="Property Owner">Property Owner</option>
            </select>
            <select 
              className="h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* PARTNER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => {
            const metrics = getPartnerMetrics(partner.name);
            return (
              <Card key={partner.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-0">
                  <div className="p-5 border-b border-slate-100 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-none mb-1.5">{partner.name}</h3>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-medium text-slate-500">{partner.type}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-500">{partner.city}</span>
                        </div>
                      </div>
                      <Badge variant={partner.status === 'Active' ? 'success' : 'secondary'} className="rounded-sm">
                        {partner.status}
                      </Badge>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Contact</span>
                        <span className="text-xs font-semibold text-slate-700">{partner.contactPerson}</span>
                      </div>
                      {partner.type === 'Broker' ? (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Deals Supported</span>
                          <span className="text-xs font-semibold text-slate-900">24</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{partner.type === 'Coworking Operator' ? 'Locations' : 'Properties'}</span>
                            <span className="text-xs font-semibold text-slate-900">{metrics.count}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{partner.type === 'Coworking Operator' ? 'Available Seats' : 'Available Inv.'}</span>
                            <span className="text-xs font-semibold text-slate-900">{partner.type === 'Coworking Operator' ? (metrics.totalArea / 50).toFixed(0) : `${metrics.totalArea.toLocaleString()} sqft`}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 w-full justify-between"
                      onClick={() => router.push(`/supply/partner-management/${partner.id}`)}
                    >
                      View Partner <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredPartners.length === 0 && (
            <div className="col-span-full text-center p-12 bg-white rounded-xl border border-slate-200">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No partners found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setFilterType("All"); setFilterStatus("All"); }}>Clear Filters</Button>
            </div>
          )}
        </div>

        {/* ADD PARTNER MODAL */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">Add New Partner</DialogTitle>
                <p className="text-xs text-slate-500 mt-1">Create a new relationship record in the CRM.</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Basic Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Partner Type</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={newPartner.type}
                      onChange={e => setNewPartner({...newPartner, type: e.target.value as PartnerType})}
                    >
                      <option value="Developer">Developer</option>
                      <option value="Coworking Operator">Coworking Operator</option>
                      <option value="Broker">Broker</option>
                      <option value="Property Owner">Property Owner</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Company / Person Name</label>
                    <Input 
                      placeholder="e.g. DLF Limited" 
                      value={newPartner.name}
                      onChange={e => setNewPartner({...newPartner, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Website</label>
                    <Input 
                      placeholder="e.g. www.dlf.in" 
                      value={newPartner.website}
                      onChange={e => setNewPartner({...newPartner, website: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">City</label>
                    <Input 
                      placeholder="e.g. Gurgaon" 
                      value={newPartner.city}
                      onChange={e => setNewPartner({...newPartner, city: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Contact Person</label>
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      value={newPartner.contactPerson}
                      onChange={e => setNewPartner({...newPartner, contactPerson: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <Input 
                      placeholder="+91 98765 43210" 
                      value={newPartner.phone}
                      onChange={e => setNewPartner({...newPartner, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <Input 
                      type="email"
                      placeholder="rahul@company.com" 
                      value={newPartner.email}
                      onChange={e => setNewPartner({...newPartner, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Relationship</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Relationship Manager</label>
                    <Input 
                      value={newPartner.relationshipManager}
                      onChange={e => setNewPartner({...newPartner, relationshipManager: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Notes</label>
                    <textarea 
                      className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none min-h-[80px]"
                      placeholder="Initial context about this relationship..."
                      value={newPartner.notes}
                      onChange={e => setNewPartner({...newPartner, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleSavePartner} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6">
                Save Partner
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
