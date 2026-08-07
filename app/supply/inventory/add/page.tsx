"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, ArrowLeft, CheckCircle2, Building, Layers, Trash2, Plus, Users, Armchair, Briefcase, GripVertical } from "lucide-react";
import { Property, PropertyLifecycleStatus, UnitStatus, WorkspaceType, Tower, CoworkingInventory } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type FlowType = 'selection' | 'commercial' | 'coworking';

export default function AddPropertyPage() {
  const router = useRouter();
  const { addProperty, currentUser } = useAppStore();
  
  const [flowType, setFlowType] = useState<FlowType>('selection');
  const [draggedTowerIdx, setDraggedTowerIdx] = useState<number | null>(null);
  
  // Common State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Commercial State
  const [commDetails, setCommDetails] = useState({
    name: "", developer: "", city: "", address: "", micromarket: "",
    grade: "A" as "A"|"B", status: "Operational" as "Operational"|"Under Construction",
    yearBuilt: new Date().getFullYear(), totalArea: 0, description: ""
  });
  const [towers, setTowers] = useState<Tower[]>([]);
  
  // Coworking State
  const [coDetails, setCoDetails] = useState({
    name: "", operatorName: "", city: "", address: "", micromarket: "",
    totalArea: 0, openingYear: new Date().getFullYear(), operatingHours: "", description: ""
  });
  const [coInventory, setCoInventory] = useState<CoworkingInventory>({
    seats: { totalSeats: 0, availableSeats: 0, pricePerSeat: 0, status: 'Available' },
    cabins: [],
    meetingRooms: []
  });

  const handleSaveDraft = () => {
    submitProperty('Draft');
  };

  const handleSubmitReview = () => {
    submitProperty('Under Review');
  };

  const submitProperty = (status: PropertyLifecycleStatus) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      let newProperty: Property;

      if (flowType === 'commercial') {
        newProperty = {
          id: `prop_${Date.now()}`,
          buildingType: 'Corporate Office',
          ...commDetails,
          lat: 19.0760, lng: 72.8777,
          towers: towers,
          certifications: [],
          images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"],
          documents: [],
          lifecycleStatus: status,
          createdBy: currentUser.id,
          createdAt: new Date().toISOString()
        };
      } else {
        newProperty = {
          id: `prop_${Date.now()}`,
          buildingType: 'Coworking',
          name: coDetails.name,
          developer: coDetails.operatorName, // map operator to developer for card display
          operatorName: coDetails.operatorName,
          city: coDetails.city,
          address: coDetails.address,
          micromarket: coDetails.micromarket,
          totalArea: coDetails.totalArea,
          yearBuilt: coDetails.openingYear,
          operatingHours: coDetails.operatingHours,
          description: coDetails.description,
          lat: 19.0760, lng: 72.8777,
          grade: 'A',
          status: 'Operational',
          towers: [], // empty for coworking
          coworkingInventory: coInventory,
          certifications: [],
          images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"],
          documents: [],
          lifecycleStatus: status,
          createdBy: currentUser.id,
          createdAt: new Date().toISOString()
        };
      }

      addProperty(newProperty);
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        router.push('/supply/inventory');
      }, 2000);
    }, 1000);
  };

  // ---------------------------------------------------------------------------
  // COMMERCIAL HELPERS
  // ---------------------------------------------------------------------------
  const addTower = () => {
    setTowers([...towers, { id: `t_${Date.now()}`, name: `Tower ${String.fromCharCode(65 + towers.length)}`, floors: [] }]);
  };
  const addFloor = (towerId: string) => {
    setTowers(towers.map(t => {
      if (t.id === towerId) {
        return { ...t, floors: [...t.floors, { id: `f_${Date.now()}`, floorNumber: `${t.floors.length + 1}`, units: [] }] };
      }
      return t;
    }));
  };
  const addUnit = (towerId: string, floorId: string) => {
    setTowers(towers.map(t => {
      if (t.id === towerId) {
        return { ...t, floors: t.floors.map(f => {
          if (f.id === floorId) {
            return { ...f, units: [...f.units, { id: `u_${Date.now()}`, unitNumber: `${f.floorNumber}0${f.units.length + 1}`, area: 1500, seatCapacity: 20, workspaceType: 'Private Office' as WorkspaceType, status: 'Available' as UnitStatus, amenities: [], statusHistory: [{status: 'Available', date: new Date().toISOString(), updatedBy: currentUser.name}] }] };
          }
          return f;
        })};
      }
      return t;
    }));
  };
  const updateUnit = (towerId: string, floorId: string, unitId: string, field: string, value: any) => {
    setTowers(towers.map(t => t.id === towerId ? { ...t, floors: t.floors.map(f => f.id === floorId ? { ...f, units: f.units.map(u => u.id === unitId ? { ...u, [field]: value } : u) } : f) } : t));
  };
  const removeUnit = (towerId: string, floorId: string, unitId: string) => {
    setTowers(towers.map(t => t.id === towerId ? { ...t, floors: t.floors.map(f => f.id === floorId ? { ...f, units: f.units.filter(u => u.id !== unitId) } : f) } : t));
  };
  const removeTower = (towerId: string) => {
    setTowers(towers.filter(t => t.id !== towerId));
  };
  const removeFloor = (towerId: string, floorId: string) => {
    setTowers(towers.map(t => t.id === towerId ? { ...t, floors: t.floors.filter(f => f.id !== floorId) } : t));
  };

  // ---------------------------------------------------------------------------
  // COWORKING HELPERS
  // ---------------------------------------------------------------------------
  const addCabin = () => {
    setCoInventory({ ...coInventory, cabins: [...coInventory.cabins, { id: `cab_${Date.now()}`, name: `Cabin ${coInventory.cabins.length + 1}`, capacity: 4, status: 'Available' }] });
  };
  const addMeetingRoom = () => {
    setCoInventory({ ...coInventory, meetingRooms: [...coInventory.meetingRooms, { id: `mr_${Date.now()}`, name: `Meeting Room ${coInventory.meetingRooms.length + 1}`, capacity: 10, status: 'Available' }] });
  };
  const removeCabin = (id: string) => {
    setCoInventory({ ...coInventory, cabins: coInventory.cabins.filter(c => c.id !== id) });
  };
  const removeMeetingRoom = (id: string) => {
    setCoInventory({ ...coInventory, meetingRooms: coInventory.meetingRooms.filter(m => m.id !== id) });
  };

  // ---------------------------------------------------------------------------
  // RENDER: SELECTION SCREEN
  // ---------------------------------------------------------------------------
  if (flowType === 'selection') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Add New Property</h1>
          <p className="text-slate-500 text-lg">Select the inventory model for your new real estate asset.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="cursor-pointer hover:shadow-xl hover:border-indigo-600 transition-all duration-300 border-slate-200/60" onClick={() => setFlowType('commercial')}>
            <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
                <Building className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Commercial Office</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Add traditional commercial office buildings with structured towers, floors and office units.
              </p>
              <div className="pt-4 flex gap-2 w-full justify-center">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Towers</Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Floors</Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Units</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl hover:border-emerald-600 transition-all duration-300 border-slate-200/60" onClick={() => setFlowType('coworking')}>
            <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Co-working Space</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Add flexible workspace inventory including dedicated seats, private cabins, and meeting rooms.
              </p>
              <div className="pt-4 flex gap-2 w-full justify-center">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Seats</Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Cabins</Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">Meeting Rooms</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center pt-8">
          <Button variant="ghost" onClick={() => router.push('/supply/inventory')}>Cancel & Return</Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: WIZARD SHELL
  // ---------------------------------------------------------------------------
  const totalSteps = flowType === 'commercial' ? 4 : 3;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setFlowType('selection')} className="rounded-full shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Add {flowType === 'commercial' ? 'Commercial Office' : 'Co-working Space'}
          </h1>
          <p className="text-slate-500 mt-1">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>

      <div className="flex items-center w-full gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className="flex-1">
            <div className={`h-2 rounded-full transition-all duration-300 ${currentStep >= idx + 1 ? (flowType === 'commercial' ? 'bg-indigo-600' : 'bg-emerald-600') : 'bg-slate-200'}`} />
          </div>
        ))}
      </div>

      <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          
          {/* FLOW A: COMMERCIAL */}
          {flowType === 'commercial' && (
            <>
              {currentStep === 1 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Building Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Building Name *</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.name} onChange={e => setCommDetails({...commDetails, name: e.target.value})} placeholder="e.g. DLF Cyber City" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Developer *</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.developer} onChange={e => setCommDetails({...commDetails, developer: e.target.value})} placeholder="e.g. DLF Limited" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">City</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.city} onChange={e => setCommDetails({...commDetails, city: e.target.value})} placeholder="e.g. Gurugram" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Micro Market</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.micromarket} onChange={e => setCommDetails({...commDetails, micromarket: e.target.value})} placeholder="e.g. Phase 2" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Full Address</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.address} onChange={e => setCommDetails({...commDetails, address: e.target.value})} placeholder="Enter complete address" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Area (sq ft)</label>
                        <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.totalArea || ''} onChange={e => setCommDetails({...commDetails, totalArea: Number(e.target.value)})} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Building Grade</label>
                        <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" value={commDetails.grade} onChange={e => setCommDetails({...commDetails, grade: e.target.value as "A"|"B"})}>
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Commercial Inventory Configuration</h2>
                      <p className="text-sm text-slate-500 mt-1">Build the structural hierarchy: Towers &gt; Floors &gt; Units</p>
                    </div>
                    <Button onClick={addTower} className="rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-none border border-indigo-200"><Plus className="h-4 w-4 mr-2" /> Add Tower</Button>
                  </div>
                  
                  {towers.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Layers className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900">No Towers Added</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto mb-6">Start by adding a tower to this property to configure its floors and office units.</p>
                      <Button onClick={addTower} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"><Plus className="h-4 w-4 mr-2" /> Add First Tower</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {towers.map((tower, tIdx) => (
                        <div 
                          key={tower.id} 
                          draggable
                          onDragStart={() => setDraggedTowerIdx(tIdx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedTowerIdx === null || draggedTowerIdx === tIdx) return;
                            const newTowers = [...towers];
                            const [moved] = newTowers.splice(draggedTowerIdx, 1);
                            newTowers.splice(tIdx, 0, moved);
                            setTowers(newTowers);
                            setDraggedTowerIdx(null);
                          }}
                          className="border border-slate-200/60 rounded-2xl bg-white shadow-sm overflow-hidden group/tower"
                        >
                          <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="cursor-grab hover:bg-slate-100 p-1.5 rounded text-slate-300 hover:text-slate-500 active:cursor-grabbing">
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <input className="font-bold text-lg text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 w-64 shadow-sm" value={tower.name} onChange={(e) => setTowers(towers.map(t => t.id === tower.id ? {...t, name: e.target.value} : t))} />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => addFloor(tower.id)} className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-semibold h-8 rounded-lg"><Plus className="h-3 w-3 mr-1.5" /> Add Floor</Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                onClick={() => {
                                  if(window.confirm(`Are you sure you want to delete ${tower.name}? This will remove all Floors and Units inside it.`)) {
                                    removeTower(tower.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-6 space-y-6">
                            {tower.floors.length === 0 ? (
                              <p className="text-sm text-slate-400 text-center py-4 font-medium">No floors added to this tower yet.</p>
                            ) : (
                              tower.floors.map((floor, fIdx) => (
                                <div key={floor.id} className="border border-slate-100 rounded-xl p-5 bg-slate-50/30 group/floor">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Floor Number</span>
                                      <input className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold text-slate-900 text-center" value={floor.floorNumber} onChange={(e) => setTowers(towers.map(t => t.id === tower.id ? {...t, floors: t.floors.map(f => f.id === floor.id ? {...f, floorNumber: e.target.value} : f)} : t))} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" onClick={() => addUnit(tower.id, floor.id)} className="h-8 rounded-lg border-slate-200 font-semibold shadow-none"><Plus className="h-3 w-3 mr-1.5" /> Add Unit</Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        onClick={() => removeFloor(tower.id, floor.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {floor.units.map((unit) => (
                                      <div key={unit.id} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm group/unit">
                                        <div className="w-full md:w-auto">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Unit</label>
                                          <input className="w-full md:w-24 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold" value={unit.unitNumber} onChange={e => updateUnit(tower.id, floor.id, unit.id, 'unitNumber', e.target.value)} />
                                        </div>
                                        <div className="w-full md:w-auto">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Area (sqft)</label>
                                          <input type="number" className="w-full md:w-28 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={unit.area} onChange={e => updateUnit(tower.id, floor.id, unit.id, 'area', Number(e.target.value))} />
                                        </div>
                                        <div className="w-full md:w-auto">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Seats</label>
                                          <input type="number" className="w-full md:w-20 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={unit.seatCapacity} onChange={e => updateUnit(tower.id, floor.id, unit.id, 'seatCapacity', Number(e.target.value))} />
                                        </div>
                                        <div className="w-full md:w-auto">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Status</label>
                                          <select className="w-full md:w-32 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={unit.status} onChange={e => updateUnit(tower.id, floor.id, unit.id, 'status', e.target.value)}>
                                            <option value="Available">Available</option>
                                            <option value="Occupied">Occupied</option>
                                          </select>
                                        </div>
                                        <div className="w-full md:w-auto ml-auto pt-4 md:pt-0">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeUnit(tower.id, floor.id, unit.id)} 
                                            className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Commercial Property Profile</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Property Description</label>
                      <textarea className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 min-h-[120px]" value={commDetails.description} onChange={e => setCommDetails({...commDetails, description: e.target.value})} placeholder="Describe the building..." />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Submit</h2>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Property Type</p><p className="font-semibold text-slate-900 mt-1">Commercial Office</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Building Name</p><p className="font-semibold text-slate-900 mt-1">{commDetails.name || 'N/A'}</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Location</p><p className="font-semibold text-slate-900 mt-1">{commDetails.micromarket}, {commDetails.city}</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Inventory Setup</p><p className="font-semibold text-slate-900 mt-1">{towers.length} Towers configured</p></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* FLOW B: COWORKING */}
          {flowType === 'coworking' && (
            <>
              {currentStep === 1 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Space Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Workspace Name *</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.name} onChange={e => setCoDetails({...coDetails, name: e.target.value})} placeholder="e.g. WeWork Cyber City" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Operator Name *</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.operatorName} onChange={e => setCoDetails({...coDetails, operatorName: e.target.value})} placeholder="e.g. WeWork India" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">City</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.city} onChange={e => setCoDetails({...coDetails, city: e.target.value})} placeholder="e.g. Gurugram" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Micro Market</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.micromarket} onChange={e => setCoDetails({...coDetails, micromarket: e.target.value})} placeholder="e.g. Phase 2" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Full Address</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.address} onChange={e => setCoDetails({...coDetails, address: e.target.value})} placeholder="Enter complete address" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Area (sq ft)</label>
                        <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.totalArea || ''} onChange={e => setCoDetails({...coDetails, totalArea: Number(e.target.value)})} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Operating Hours</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" value={coDetails.operatingHours} onChange={e => setCoDetails({...coDetails, operatingHours: e.target.value})} placeholder="e.g. 24/7 or 9AM - 8PM" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Co-working Inventory Configuration</h2>
                      <p className="text-sm text-slate-500 mt-1">Configure flexible workspace inventory</p>
                    </div>
                  </div>
                  
                  {/* Dedicated Seats */}
                  <div className="border border-slate-200/60 rounded-2xl p-6 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4"><Armchair className="h-5 w-5 text-emerald-600" /> Dedicated Desks</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Total Seats</label>
                        <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={coInventory.seats.totalSeats} onChange={e => setCoInventory({...coInventory, seats: {...coInventory.seats, totalSeats: Number(e.target.value)}})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Available Seats</label>
                        <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={coInventory.seats.availableSeats} onChange={e => setCoInventory({...coInventory, seats: {...coInventory.seats, availableSeats: Number(e.target.value)}})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Price / Seat (₹)</label>
                        <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={coInventory.seats.pricePerSeat} onChange={e => setCoInventory({...coInventory, seats: {...coInventory.seats, pricePerSeat: Number(e.target.value)}})} />
                      </div>
                    </div>
                  </div>

                  {/* Private Cabins */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Briefcase className="h-5 w-5 text-emerald-600" /> Private Cabins</h3>
                      <Button variant="ghost" size="sm" onClick={addCabin} className="text-emerald-700 hover:bg-emerald-50 font-semibold h-8 rounded-lg"><Plus className="h-3 w-3 mr-1.5" /> Add Cabin</Button>
                    </div>
                    <div className="p-6">
                      {coInventory.cabins.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center font-medium">No cabins configured.</p>
                      ) : (
                        <div className="space-y-3">
                          {coInventory.cabins.map(cabin => (
                            <div key={cabin.id} className="flex gap-3 items-center">
                              <input className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold" value={cabin.name} onChange={e => setCoInventory({...coInventory, cabins: coInventory.cabins.map(c => c.id === cabin.id ? {...c, name: e.target.value} : c)})} placeholder="Cabin Name" />
                              <input type="number" className="w-24 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={cabin.capacity} onChange={e => setCoInventory({...coInventory, cabins: coInventory.cabins.map(c => c.id === cabin.id ? {...c, capacity: Number(e.target.value)} : c)})} placeholder="Capacity" />
                              <select className="w-32 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={cabin.status} onChange={e => setCoInventory({...coInventory, cabins: coInventory.cabins.map(c => c.id === cabin.id ? {...c, status: e.target.value as UnitStatus} : c)})}>
                                <option value="Available">Available</option><option value="Occupied">Occupied</option>
                              </select>
                              <Button variant="ghost" size="icon" onClick={() => removeCabin(cabin.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meeting Rooms */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Users className="h-5 w-5 text-emerald-600" /> Meeting Rooms</h3>
                      <Button variant="ghost" size="sm" onClick={addMeetingRoom} className="text-emerald-700 hover:bg-emerald-50 font-semibold h-8 rounded-lg"><Plus className="h-3 w-3 mr-1.5" /> Add Room</Button>
                    </div>
                    <div className="p-6">
                      {coInventory.meetingRooms.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center font-medium">No meeting rooms configured.</p>
                      ) : (
                        <div className="space-y-3">
                          {coInventory.meetingRooms.map(mr => (
                            <div key={mr.id} className="flex gap-3 items-center">
                              <input className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold" value={mr.name} onChange={e => setCoInventory({...coInventory, meetingRooms: coInventory.meetingRooms.map(m => m.id === mr.id ? {...m, name: e.target.value} : m)})} placeholder="Room Name" />
                              <input type="number" className="w-24 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={mr.capacity} onChange={e => setCoInventory({...coInventory, meetingRooms: coInventory.meetingRooms.map(m => m.id === mr.id ? {...m, capacity: Number(e.target.value)} : m)})} placeholder="Capacity" />
                              <select className="w-32 rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={mr.status} onChange={e => setCoInventory({...coInventory, meetingRooms: coInventory.meetingRooms.map(m => m.id === mr.id ? {...m, status: e.target.value as UnitStatus} : m)})}>
                                <option value="Available">Available</option><option value="Occupied">Occupied</option>
                              </select>
                              <Button variant="ghost" size="icon" onClick={() => removeMeetingRoom(mr.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {currentStep === 3 && (
                <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Submit</h2>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Property Type</p><p className="font-semibold text-slate-900 mt-1">Co-working Space</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Operator</p><p className="font-semibold text-slate-900 mt-1">{coDetails.operatorName || 'N/A'}</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Location</p><p className="font-semibold text-slate-900 mt-1">{coDetails.micromarket}, {coDetails.city}</p></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Inventory Setup</p><p className="font-semibold text-slate-900 mt-1">{coInventory.seats.totalSeats} Seats, {coInventory.cabins.length} Cabins</p></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </CardContent>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setFlowType('selection')} 
          >
            {currentStep > 1 ? 'Previous' : 'Back'}
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
              Save Draft
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Property"} <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-slate-200/60 shadow-2xl flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${flowType === 'commercial' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Submitted</h2>
          <p className="text-slate-500 font-medium">Your {flowType === 'commercial' ? 'commercial' : 'co-working'} property has been successfully added to the inventory and is now under review.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
